const { GoogleGenAI } = require("@google/genai");
const Chat = require('../models/Chat');
const Farmer = require('../models/Farmer');
const Activity = require('../models/Activity');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate AI answer for farmer queries
 * GitHub version is PRIMARY — Gemini chat implementation
 */
const generate = async (req, res) => {
  try {
<<<<<<< HEAD
    const { farmerId, question } = req.body;
    if (!farmerId || !question) {
      return res.status(400).json({ message: 'Missing fields' });
    }
=======
    const farmerId = req.farmerId;1
    const { question } = req.body;
    if (!farmerId || !question) return res.status(400).json({ message: 'Missing fields' });
>>>>>>> recovered-work-1

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const activities = await Activity.find({ farmerId })
      .sort({ timestamp: -1 })
      .limit(10);

    // Build context prompt (GitHub version)
    const basePrompt = `You are Krishi Sakhi, a helpful farming assistant.

Farmer details:
name=${farmer.name},
crop=${farmer.crop ?? "Paddy"},
soil=${farmer.soilType ?? "Clay"},
location=${farmer.location}.

${activities.length
        ? "Recent activities:\n" +
          activities
            .map(a => `${a.type || a.activity} at ${a.timestamp.toISOString()}`)
            .join("\n")
        : ""
      }

Question: ${question}

Answer concisely in English.`;

    const history = [
      {
        role: "user",
        parts: [
          {
<<<<<<< HEAD
            text: basePrompt
=======
            // text: `You are Krishi Sakhi, a helpful Malayalam farming assistant.
            text: `You are Krishi Sakhi, a helpful farming assistant.
Farmer details: name=${farmer.name}, crop=${farmer.crop ?? "Paddy"}, soil=${farmer.soilType ?? "Clay"}, location=${farmer.location}.
${activities.length ? 'Recent activities:\n' + activities.map(a => `${a.activity} at ${a.timestamp.toISOString()}`).join('\n') : ''}
Question: ${question}
Answer concisely in M`
>>>>>>> recovered-work-1
          }
        ],
      }
    ];

    // Create Gemini chat session
    const chat = ai.chats.create({
      model: "gemini-2.5-pro",
      history
    });

    // Ask the model the question
    const response = await chat.sendMessage({ message: question });
    const answer = response.text;

    await Chat.create({ farmerId, question, answer });

    res.json({ answer });

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
