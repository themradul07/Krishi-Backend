const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require("@google/genai");
const Chat = require('../models/Chat');
const Farmer = require('../models/Farmer');
const Activity = require('../models/Activity');
const { getWeather } = require("../services/weather.service");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const { default: mongoose } = require("mongoose");

// Initialize ElevenLabs client once at the module level, not in handler
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const generate = async (req, res) => {
  try {
    const farmerId = req.farmerId;
    const { question } = req.body;

    if (!farmerId || !question) return res.status(400).json({ message: 'Missing fields' });

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const activities = await Activity.find({ farmerId })
      .sort({ timestamp: -1 })
      .limit(10);

    const basePrompt = `
You are Krishi Sakhi, a farming assistant. You MUST respond only in valid JSON.

Farmer Details:
- name: ${farmer.name}
- crop: ${farmer.crop ?? "Paddy"}
- soil: ${farmer.soilType ?? "Clay"}
- location: ${farmer.location}
- landSize: ${farmer.landSize ?? "2 acres"}
${activities.length
        ? "Recent Activities:\n" + activities
          .map(a => `- ${a.type || a.activity} at ${a.timestamp.toISOString()}`)
          .join("\n")
        : ""
      }

User Question: ${question}

STRICT OUTPUT RULES (DO NOT BREAK):
1. You MUST respond **ONLY** with a valid JSON object.
2. NO backticks, NO extra text, NO explanations.
3. JSON structure MUST be EXACTLY:

{
  "answer": "string",
  "templateId": 1 or 2,
  "steps": ["string", ...],
  "language": "en" | "hi" | "ml"
}

4. templateId rules:
   - Use 1 → if the answer is plain text (no steps needed).
   - Use 2 → if the answer includes a heading + multiple steps.

5. "steps" must be:
   - an array of strings if needed, OR
   - an empty array if not applicable.

6. Detect language from the user question and set:
   - "en" for English
   - "hi" for Hindi
   - "ml" for Malayalam

7. The response MUST be valid JSON that can be parsed with JSON.parse().

FAILURE TO FOLLOW ANY RULE IS NOT ALLOWED.
Return ONLY the JSON object.
`;

    const history = [
      {
        role: "user",
        parts: [
          {
            text: basePrompt
          }
        ],
      }
    ];

    // Create Gemini chat session
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history
    });

    // Ask the model the question
    const answer = await chat.sendMessage({ message: question });

    // Extract the first candidate’s content string
    const responseText = answer.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return res.status(500).json({ message: "No response from AI" });
    }

    // Clean response from markdown backticks if any
    const cleanResponse = responseText.replace('```json', '').replace(/```/g, '').trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanResponse);
    } catch (parseError) {
      return res.status(500).json({
        error: "Failed to parse AI JSON",
        rawResponse: cleanResponse
      });
    }

    // Save the chat with question and the answer string (stringify the JSON)
    await Chat.create({
      farmerId,
      question,
      answer: JSON.stringify(parsedResponse)
    });
    const answerText = parsedResponse.answer + (parsedResponse.steps && parsedResponse.steps.length > 0
      ? " Steps: " + parsedResponse.steps.join(" ")
      : "");

    // Generate speech audio from answer text using ElevenLabs
    const audio = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
      text: answerText,
      modelId: 'eleven_multilingual_v2', // supports multiple languages incl. Malayalam
      outputFormat: 'mp3_44100_128',
    });

    // Read the audio as a buffer
    const reader = audio.getReader();
    const chunks = [];
    let doneReading = false;
    while (!doneReading) {
      const { done, value } = await reader.read();
      if (done) {
        doneReading = true;
      } else {
        chunks.push(value);
      }
    }
    // Concatenate buffer chunks into a single buffer
    const audioBuffer = Buffer.concat(chunks);

    // Encode audio buffer to base64 string to send via JSON response
    const audioBase64 = audioBuffer.toString('base64');

    // Send JSON response including audio base64 data
    res.json({
      ...parsedResponse,
      audioBase64, // frontend can play this as a data URL: "data:audio/mp3;base64," + audioBase64
    });


  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Replace your existing detectCropDisease with this improved version.
// This includes fallback default doses per disease and computes personalized total quantity.

const detectCropDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // ---------- Helpers (minimal copies - remove if you already have these above) ----------
    const ACRES_PER_HECTARE = 2.47105;

    function parseLandSizeToAcres(landSizeRaw) {
      if (!landSizeRaw) return 1;
      const s = String(landSizeRaw).trim().toLowerCase().replace(/,/g, '');
      const m = s.match(/([\d.]+)\s*(ha|hectare|hectares|acre|ac|acres)?/i);
      if (!m) return 1;
      const value = parseFloat(m[1]) || 1;
      const unit = (m[2] || "").toLowerCase();
      if (unit.startsWith("ha") || unit.startsWith("hect")) return value * ACRES_PER_HECTARE;
      return value;
    }

    function parseQuantityString(qRaw) {
      if (!qRaw || typeof qRaw !== "string") return null;
      const q = qRaw.replace(/\s+/g, " ").trim().toLowerCase();
      const normalized = q.replace(/\//g, " per ");
      const rx = /([\d.,]+)\s*(g|gram|grams|kg|kilogram|kilograms|ml|milliliter|milliliters|l|litre|liter|litres|liters|packet|packets|unit|units)?(?:\s*per\s*(acre|ac|hectare|ha))?/i;
      const m = normalized.match(rx);
      if (!m) return null;
      const amount = parseFloat(m[1].replace(/,/g, ''));
      let unit = (m[2] || "g").toLowerCase();
      let per = (m[3] || "acre").toLowerCase();

      if (unit.startsWith("gram")) unit = "g";
      if (unit === "kg" || unit.startsWith("kilogram")) unit = "kg";
      if (unit.startsWith("ml") || unit.startsWith("milliliter")) unit = "ml";
      if (unit === "l" || unit.startsWith("litre") || unit.startsWith("liter")) unit = "l";
      if (unit.startsWith("pack")) unit = "packet";
      if (unit.startsWith("unit")) unit = "unit";

      if (per === "ac") per = "acre";
      if (per.startsWith("hect")) per = "ha";

      return { amount: Number(amount), unit, per, raw: qRaw };
    }

    function formatAmount(amount, unit) {
      if (amount === null || amount === undefined || Number.isNaN(amount)) return "";
      const roundSmart = v => (Math.abs(v) >= 100 ? Math.round(v) : Math.abs(v) >= 10 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100);
      if (unit === "kg" && Math.abs(amount) < 1) return `${roundSmart(amount * 1000)} g`;
      if (unit === "l" && Math.abs(amount) < 1) return `${roundSmart(amount * 1000)} ml`;
      return `${roundSmart(amount)} ${unit}`;
    }

    function computeTotalQuantity(parsedQty, farmerAcres) {
      if (!parsedQty || parsedQty.amount === undefined || parsedQty.amount === null) return null;
      let { amount, unit, per } = parsedQty;
      if (per === "ha") {
        amount = amount / ACRES_PER_HECTARE;
        per = "acre";
      }
      const areaBased = (per === "acre" || per === "ha");
      if (!areaBased) {
        return {
          perAcDose: formatAmount(amount, unit),
          perUnit: per,
          totalAmount: null,
          totalUnit: null,
          totalFormatted: null,
          farmerAcres,
          note: "quantity not area-based"
        };
      }
      const amountPerAcre = amount;
      const totalRaw = amountPerAcre * farmerAcres;
      let displayUnit = unit;
      let displayAmount = totalRaw;
      if (unit === "g" && Math.abs(totalRaw) >= 1000) {
        displayAmount = totalRaw / 1000;
        displayUnit = "kg";
      }
      if (unit === "ml" && Math.abs(totalRaw) >= 1000) {
        displayAmount = totalRaw / 1000;
        displayUnit = "l";
      }
      return {
        perAcDose: formatAmount(amountPerAcre, unit),
        perUnit: "acre",
        totalAmount: displayAmount,
        totalUnit: displayUnit,
        totalFormatted: formatAmount(displayAmount, displayUnit),
        farmerAcres,
      };
    }
    // ---------- end helpers ----------

    // Fallback default doses per disease (per acre). Adjust values to your local recommendations
    const DEFAULT_DOSES = {
      // diseaseKey: { amount: Number, unit: 'g'|'kg'|'ml'|'l', per: 'acre'|'ha' }
      "rice brown spot": { amount: 300, unit: "g", per: "acre" }, // example: 300 g per acre tricyclazole
      "brown spot": { amount: 300, unit: "g", per: "acre" },
      "blast": { amount: 250, unit: "g", per: "acre" },
      "sheath blight": { amount: 400, unit: "g", per: "acre" },
      // add other disease defaults as required
    };

    // Try to find farmer
    const farmerId = req.farmerId;
    const farmer = farmerId ? await Farmer.findById(farmerId) : null;
    const landSizeRaw = farmer?.landSize || farmer?.landsize || null;
    const farmerAcres = parseLandSizeToAcres(landSizeRaw);

    // Read & send image to AI
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const base64Image = fileBuffer.toString('base64');

    console.log("rUNNING DISEASE DETECTION FOR FARMER:", farmerId || "unknown");

    const contents = [
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      {
        text: `Analyze the crop image and return result ONLY in pure JSON (no text, no backticks).

Return JSON exactly in this structure:

{
  "disease": "Disease Name or 'No disease detected'",
  "confidence": 80,
  "severity": "Low/Moderate/High",
  "stage": "Early/Mid/Late/Unknown",
  "treatment": ["Step 1", "Step 2"],
  "prevention": ["Tip 1", "Tip 2"],
  "Fertilizers": ["Fertilizer 1", "Fertilizer 2"],
  "Quantity": "Amount of fungicide/pesticide to be used for ${farmer.landsize} acres. Always give quantity in grams (g) or kilograms (kg)."
}

Rules:
- If the image is NOT related to crops or plants → return:
  "disease": "No disease detected",
  "confidence": 0,
  "severity": "Low",
  "stage": "Unknown",
  all arrays empty,
  "Quantity": "".

- Disease stage must be determined visually based on symptoms:
  - "Early" → small lesions, initial color changes  
  - "Mid" → spreading spots, visible damage  
  - "Late" → severe spread, dying leaves, advanced infection  
  - "Unknown" → unsure stage

Return ONLY valid JSON with no extra text.`

      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    let raw = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({
        error: "Failed to parse AI JSON",
        rawResponse: raw
      });
    }

    // If the AI did not provide a Quantity or it couldn't be parsed, use default dose for the disease
    let parsedQty = parseQuantityString(parsed.Quantity || parsed.quantity || "");
    let usedFallback = false;

    if (!parsedQty || !parsedQty.amount) {
      // try match disease to a default dose
      const diseaseKey = String(parsed.disease || "").trim().toLowerCase();
      const defaultDose = DEFAULT_DOSES[diseaseKey] || null;

      if (defaultDose) {
        parsedQty = {
          amount: defaultDose.amount,
          unit: defaultDose.unit,
          per: defaultDose.per,
          raw: `default for ${diseaseKey}`
        };
        usedFallback = true;
      }
    }

    // compute personalization
    const personalization = computeTotalQuantity(parsedQty, farmerAcres);

    // Attach computed personalization
    parsed._personalization = {
      farmerId: farmerId || null,
      landSizeRaw: landSizeRaw || null,
      farmerAcres,
      parsedQuantity: parsedQty || null,
      computed: personalization || null,
      usedFallback // true if we used default dose
    };

    // Provide top-level fields for frontend
    if (personalization) {
      parsed.quantityPerUnit = personalization.perAcDose; // e.g. "300 g"
      parsed.quantityUnit = personalization.perUnit; // "acre"
      parsed.totalQuantity = personalization.totalFormatted; // e.g. "600 g" or "0.6 kg"
      parsed.totalQuantityNumeric = personalization.totalAmount;
      parsed.totalQuantityUnit = personalization.totalUnit;
    } else {
      parsed.quantityPerUnit = parsed.Quantity || parsed.quantity || "";
      parsed.totalQuantity = "";
    }

    // Add a small message to inform frontend (optional)
    if (usedFallback) {
      parsed.note = `Used default per-area dose for "${parsed.disease}" to compute totals. Please follow local extension recommendations or product label.`;
    }
    const activity = await Activity.create({
      farmerId,
      type: " Crop Disease Detection",
      note: ` Crop Disease Detection: ${parsed.disease || "Unknown"} (used default dose: ${usedFallback})`
    })

    activity.save();

    res.json(parsed);

  } catch (error) {
    console.error("Error detecting disease:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const detectPest = async (req, res) => {
  try {
    const farmerId = req.farmerId;
    const farmer = await Farmer.findById(farmerId);
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const base64Image = fileBuffer.toString('base64');

    const contents = [
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      {
        text: `Analyze the given image and identify if there is any pest affecting the plant.  
- If the image contains a pest on a plant, return a detailed JSON with pest name, confidence score (0-100), severity level (Low, Moderate, or High), recommended treatment steps, and prevention tips,"Quantity": "Amount of fungicide/pesticide to be used for farmer.landsize", formatted exactly as below:

{
  "Pest": "Pest Name",
  "confidence": 80,
  "severity": "Low/Moderate/High",
  "treatment": ["Step 1", "Step 2"],
  "prevention": ["Tip 1", "Tip 2"],
  "Pesticides" : ["Pesticide 1", "Pesticide 2"],
  "Quantity": "Amount of fungicide/pesticide to be used for ${farmer.landsize} in acres and please provide the quantity in grams or kilograms.",
}

- If the image is related to a plant but no pest is detected, return a valid JSON with an error message field:

{
  "error": "No pest detected in the plant photo. Please upload an image clearly showing the affected area."
}

- If the image does not contain a plant, return the following JSON:

{
  "error": "The uploaded photo does not show a plant. Please upload a clear plant photo for pest detection."
}

Return only valid JSON, without any additional text or formatting.
`
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    let raw = response.text;
    console.log("AI raw response:", raw);

    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({
        error: "Failed to parse AI JSON",
        rawResponse: raw
      });
    }

    const activity = await Activity.create({
      farmerId,
      type: " Pest Detection",
      note: ` Pest Detection: ${parsed.pest || "Unknown"}`
    })

    console.log("Parsed pest detection response:", parsed);

    res.json(parsed);

  } catch (error) {
    console.error("Error detecting disease:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateAdvisory = async (req, res) => {
  try {
    const farmerId = req.farmerId;
    if (!farmerId) return res.status(400).json({ message: 'Missing fields' });

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const activities = await Activity.find({ farmerId })
      .sort({ timestamp: -1 })
      .limit(10);

    const weather = await getWeather("Jhansi");


    // Nearby Pest Alerts:
    // {{pest}
    //Sowing Date Can Also be included in farmer profile for better advisories
    const basePrompt = `You are Krishi Sakhi – an AI agriculture assistant for Kerala.

Generate a personalized advisory based on the details below:

Farmer Profile:
- Crop: ${farmer.primaryCrop ?? "Paddy"}
- Soil: ${farmer.soilType ?? "Clay"}
- Irrigation: ${farmer.irrigation ?? "Canal"}
- Land Size: ${farmer.landSize ?? "2 acres"}

Latest Activities:
${activities}

Weather Forecast:
${weather}

do not give long explanations. be crisp and precise.

STRICT OUTPUT IN JSON:


return an array with 3-5 advices of one liner in english. Answer in JSON format as below:
{
  "advisories": [
    "advice 1",
    "advice 2"

  ]
}

`;


    // Create Gemini chat session
    const advisory = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: basePrompt,
      config: {
        systemInstruction: "You are a Kisihi Sakhi Advisory System",
      },
    });

    console.log("Advisory response:", advisory);

    // Ask the model the question
    // const answer = await chat.sendMessage({ message: question });

    // // Extract the first candidate’s content string
    // const responseText = answer.candidates?.[0]?.content?.parts?.[0]?.text;

    // if (!responseText) {
    //   return res.status(500).json({ message: "No response from AI" });
    // }

    // // Clean response from markdown backticks if any
    // const cleanResponse = responseText.replace('```json', '').replace(/```/g, '').trim();

    // let parsedResponse;
    // try {
    //   parsedResponse = JSON.parse(cleanResponse);
    // } catch (parseError) {
    //   return res.status(500).json({
    //     error: "Failed to parse AI JSON",
    //     rawResponse: cleanResponse
    //   });
    // }

    // // Save the chat with question and the answer string (stringify the JSON)
    // await Chat.create({
    //   farmerId,
    //   question,
    //   answer: JSON.stringify(parsedResponse)
    // });

    // // Send parsed JSON response to client
    let text = advisory.candidates?.[0]?.content?.parts?.[0]?.text;

    // Remove code block wrappers
    text = text.replace(/```json|```/g, '').trim();

    const data = JSON.parse(text);
    console.log(data);

    res.json(data);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio provided" });

    // TEMP FILE — exists only for milliseconds
    const tempPath = path.join(os.tmpdir(), `${Date.now()}-${req.file.originalname}`);
    fs.writeFileSync(tempPath, req.file.buffer);

    // Upload to Gemini
    const uploaded = await genAI.files.upload({
      file: tempPath,
      config: { mimeType: req.file.mimetype },
    });

    // Delete temp file immediately
    fs.unlinkSync(tempPath);

    // Ask Gemini to transcribe
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([
        createPartFromUri(uploaded.uri, uploaded.mimeType),
        "Please generate an accurate transcription of the audio.",
      ]),
    });

    return res.json({
      text: result.text,
    });

  }
  catch (error) {
    console.error("STT ERROR:", error);
    return res.status(500).json({ error: "Transcription failed" });
  }
};

const generateSuggestion = async (req, res) => {
  try {
    const farmerId = req.farmerId;
    const plotId = req.body.plotId;
    console.log("This is the plot ID", plotId)
    if (!farmerId) return res.status(400).json({ message: 'Missing fields' });

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // const bodyPlotId =new mongoose.Types.ObjectId(plotId);

    const activities = await Activity.find({ farmerId })
      .sort({ timestamp: -1 })
      .limit(20);

    const weather = await getWeather("Jhansi");
    const basePrompt = `You are an agricultural assistant AI. Generate personalized farming suggestions based on the user's top activity types and recent notes.

Inputs:
- Recent Activities: ${activities}
- Crop context (if available): ${farmer.primaryCrop}
- Location context (if available): ${farmer.location}
- Current weather: ${weather}

Your tasks:
1. Based on top repeated activities (ex: fertilization happening frequently), generate 4–6 actionable recommendations.
2. Each suggestion should mention:
   - What to do
   - Why it matters (short reason)
   - Timing guidance (now / next 2–3 days / before next rain)
3. If recent notes show patterns (ex: pest spike, repeated irrigation, consecutive fertilizer use), flag *possible anomalies* and recommend a check or precaution.
4. Suggest “future-focused” actions:
   - What should be planned for next week or next stage of crop
   - Any inspections, soil tests, or preparation steps
   - Risk indicators based on recent patterns
5. Keep tone simple, practical, farmer-friendly.
6. Avoid giving chemical doses unless explicitly provided by user; otherwise say “follow recommended local dose”.

Output Format  (strict JSON, no extra text):
Provide output as a clean JSON array like: 
[
  {
    "title": "",
    "description": "",
    "timing": "",
    "reason": ""
  }
]


`;


    // Create Gemini chat session
    const suggestions = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: basePrompt,
      config: {
        systemInstruction: "You are a Kisihi Sakhi Advisory System",
      },
    });

    console.log("Suggestions response:", suggestions);


    // const answer = await chat.sendMessage({ message: question });

    // // Extract the first candidate’s content string
    // const responseText = answer.candidates?.[0]?.content?.parts?.[0]?.text;

    // if (!responseText) {
    //   return res.status(500).json({ message: "No response from AI" });
    // }

    // // Clean response from markdown backticks if any
    // const cleanResponse = responseText.replace('```json', '').replace(/```/g, '').trim();

    // let parsedResponse;
    // try {
    //   parsedResponse = JSON.parse(cleanResponse);
    // } catch (parseError) {
    //   return res.status(500).json({
    //     error: "Failed to parse AI JSON",
    //     rawResponse: cleanResponse
    //   });
    // }

    // // Save the chat with question and the answer string (stringify the JSON)
    // await Chat.create({
    //   farmerId,
    //   question,
    //   answer: JSON.stringify(parsedResponse)
    // });

    // // Send parsed JSON response to client
    let text = suggestions.candidates?.[0]?.content?.parts?.[0]?.text;

    // Remove code block wrappers
    text = text.replace(/```json|```/g, '').trim();

    const data = JSON.parse(text);
    console.log(data);

    res.json({ "suggestions": data });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const detectPesticide = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Convert image
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    console.log("Pesticide detection started...");

    // -------------------- AI REQUEST --------------------
    const contents = [
      {
        inlineData: { mimeType, data: base64Image }
      },
      {
        text: `
You are an expert in Indian agricultural pesticide regulation.

Analyze the pesticide image and RETURN ONLY JSON (no explanation, no backticks).

Use this structure:

{
  "name": "Detected pesticide name",
  "activeIngredient": "Chemical ingredient",
  "category": "Insecticide / Fungicide / Herbicide / Unknown",
  "status": "Allowed / Restricted / Banned",
  "confidence": 0-100,
  "reason": "Explain why it is allowed/restricted/banned based on toxicity, safety guidelines, or regulatory patterns."
}

Rules to classify status:
- "Banned": If known internationally banned, WHO class 1 toxicity, extremely hazardous, or banned in India.
- "Restricted": Highly toxic (Class 2), allowed only with license, or restricted-use pesticide.
- "Allowed": Low/medium toxicity, legally sold for general agricultural use.
- If unsure: choose the safest classification and set status to "Restricted".

If image is NOT a pesticide:
Return:
{
  "name": "Unknown",
  "activeIngredient": "",
  "category": "Unknown",
  "status": "Unknown",
  "confidence": 0,
  "reason": "Image does not appear to contain a pesticide or agrochemical product."
}

Return ONLY JSON.
`
      }
    ];

    const aiResp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    // Clean JSON
    let raw =
      aiResp?.text ||
      aiResp?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(raw);
      console.log("Pesticide detection parsed response:", parsed);
    } catch (err) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw
      });
    }

    // -------------------- FINAL RESPONSE --------------------
    return res.json({
      name: parsed.name || "Unknown",
      activeIngredient: parsed.activeIngredient || "",
      category: parsed.category || "Unknown",
      status: parsed.status || "Unknown",
      confidence: parsed.confidence || 0,
      reason: parsed.reason || ""
    });

  } catch (err) {
    console.error("Error detecting pesticide:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { generate, detectCropDisease, generateAdvisory, detectPest, transcribeAudio, generateSuggestion, detectPesticide };