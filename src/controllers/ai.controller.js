const { GoogleGenAI } = require("@google/genai");
const Chat = require('../models/Chat');
const Farmer = require('../models/Farmer');
const Activity = require('../models/Activity');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate AI answer for farmer queries
 * GitHub version is PRIMARY — Gemini chat implementation
 */
// const generate = async (req, res) => {
//   try {
//     const farmerId = req.farmerId;
//     const { question } = req.body;
//     console.log("this is the question", question);
//     console.log("this is the farmerId", farmerId);
//     if (!farmerId || !question) return res.status(400).json({ message: 'Missing fields' });

//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(404).json({ message: 'Farmer not found' });
//     }

//     const activities = await Activity.find({ farmerId })
//       .sort({ timestamp: -1 })
//       .limit(10);

//     // Build context prompt (GitHub version)
//     const basePrompt = `
// You are Krishi Sakhi, a farming assistant. You MUST respond only in valid JSON.

// Farmer Details:
// - name: ${farmer.name}
// - crop: ${farmer.crop ?? "Paddy"}
// - soil: ${farmer.soilType ?? "Clay"}
// - location: ${farmer.location}

// ${activities.length
//         ? "Recent Activities:\n" + activities
//           .map(a => `- ${a.type || a.activity} at ${a.timestamp.toISOString()}`)
//           .join("\n")
//         : ""
//       }

// User Question: ${question}

// STRICT OUTPUT RULES (DO NOT BREAK):
// 1. You MUST respond **ONLY** with a valid JSON object.
// 2. NO backticks, NO extra text, NO explanations.
// 3. JSON structure MUST be EXACTLY:

// {
//   "answer": "string",
//   "templateId": 1 or 2,
//   "steps": ["string", ...],
//   "language": "en" | "hi" | "ml"
// }

// 4. templateId rules:
//    - Use 1 → if the answer is plain text (no steps needed).
//    - Use 2 → if the answer includes a heading + multiple steps.

// 5. "steps" must be:
//    - an array of strings if needed, OR
//    - an empty array if not applicable.

// 6. Detect language from the user question and set:
//    - "en" for English
//    - "hi" for Hindi
//    - "ml" for Malayalam

// 7. The response MUST be valid JSON that can be parsed with JSON.parse().

// FAILURE TO FOLLOW ANY RULE IS NOT ALLOWED.
// Return ONLY the JSON object.
// `;


//     const history = [
//       {
//         role: "user",
//         parts: [
//           {
//             text: basePrompt
//           }
//         ],
//       }
//     ];

//     // Create Gemini chat session
//     const chat = ai.chats.create({
//       model: "gemini-2.5-pro",
//       history
//     });

//     // Ask the model the question
//     console.log("Sending question to AI:", question);
//     const answer = await chat.sendMessage({ message: question });
//     const response = answer.candidates?.[0]?.content?.parts?.[0]?.text;

//     console.log("AI Raw Output:", response);

//     // const answer = response.text;

//     await Chat.create({ farmerId, question });


//     let raw = response.text;
//     console.log("AI raw response:", raw);

//     raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();

//     let parsed;

//     try {
//       parsed = JSON.parse(raw);
//     } catch (err) {
//       return res.status(500).json({
//         error: "Failed to parse AI JSON",
//         rawResponse: raw
//       });
//     }

//     res.json(parsed);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

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
    const cleanResponse = responseText.replace('```json','').replace(/```/g, '').trim();

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
    
    // Send parsed JSON response to client
    res.json(parsedResponse);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * Detect crop disease — GitHub version is PRIMARY
 * Uses multipart, Gemini Flash, and structured JSON output
 */
const detectCropDisease = async (req, res) => {
  try {
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
        text: `Analyze the crop image and return result ONLY in pure JSON (no text, no backticks):

{
  "disease": "Disease Name",
  "confidence": 80,
  "severity": "Low/Moderate/High",
  "treatment": ["Step 1", "Step 2"],
  "prevention": ["Tip 1", "Tip 2"]
}

Return only valid JSON.`
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

    res.json(parsed);

  } catch (error) {
    console.error("Error detecting disease:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { generate, detectCropDisease };
