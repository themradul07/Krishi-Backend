// const { generateAdvisory } = require('../services/ai.service');
// const Chat = require('../models/Chat');
// const Farmer = require('../models/Farmer');
// const Activity = require('../models/Activity');

// const generate = async (req, res) => {
//   try {
//     const { farmerId, question } = req.body;
//     if (!farmerId || !question) return res.status(400).json({ message: 'Missing fields' });

//     const farmer = await Farmer.findById(farmerId);
//     const activities = await Activity.find({ farmerId }).sort({ timestamp: -1 }).limit(10);

//     const promptParts = [];
//     promptParts.push(`You are Krishi Sakhi, a helpful Malayalam farming assistant.`);
//     promptParts.push(`Farmer details: name=${farmer.name}, crop=${farmer.crop}, soil=${farmer.soilType}, location=${farmer.location}.`);
//     if (activities.length) {
//       promptParts.push('Recent activities:');
//       activities.forEach(a => promptParts.push(`${a.activity} at ${a.timestamp.toISOString()}`));
//     }
//     promptParts.push(`Question: ${question}`);
//     promptParts.push('Answer concisely in Malayalam.');

//     const prompt = promptParts.join('\n');

//     const answer = await generateAdvisory({ prompt, openaiKey: process.env.OPENAI_API_KEY });
//     await Chat.create({ farmerId, question, answer });

//     res.json({ answer });
//   } catch (err) {
//     console.error(err.response ? err.response.data : err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { generate };


const { GoogleGenAI } = require("@google/genai");
const Chat = require('../models/Chat');
const Farmer = require('../models/Farmer');
const Activity = require('../models/Activity');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generate = async (req, res) => {
  try {
    const farmerId = req.farmerId;1
    const { question } = req.body;
    if (!farmerId || !question) return res.status(400).json({ message: 'Missing fields' });

    const farmer = await Farmer.findById(farmerId);
    const activities = await Activity.find({ farmerId }).sort({ timestamp: -1 }).limit(10);


    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    // Build the prompt history for context
    const history = [
      {
        role: "user",
        parts: [
          {
            // text: `You are Krishi Sakhi, a helpful Malayalam farming assistant.
            text: `You are Krishi Sakhi, a helpful farming assistant.
Farmer details: name=${farmer.name}, crop=${farmer.crop ?? "Paddy"}, soil=${farmer.soilType ?? "Clay"}, location=${farmer.location}.
${activities.length ? 'Recent activities:\n' + activities.map(a => `${a.activity} at ${a.timestamp.toISOString()}`).join('\n') : ''}
Question: ${question}
Answer concisely in M`
          }
        ],
      }
    ];

    // Create a Gemini chat session
    const chat = ai.chats.create({
      model: "gemini-2.5-pro",
      history,
    });

    // Send the current question as a chat message
    const response = await chat.sendMessage({
      message: question,
    });

    const answer = response.text;

    // Save chat with question and answer
    await Chat.create({ farmerId, question, answer });

    // Return AI-generated answer
    res.json({ answer });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const detectCropDisease = async (req, res) => {
   try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Get file buffer and mime type
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Convert file buffer to base64 string
    const base64Image = fileBuffer.toString('base64');

    // Build contents array with inline image data and prompt
    const contents = [
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
      {
        text: `Analyze the following crop image and provide the result strictly in this JSON format without extra text:

{
        "disease": "Disease Name",
        "confidence": 0 - 100(percentage),
        "severity": "Low/Moderate/High",
        "treatment": [
          "Treatment step 1",
          "Treatment step 2",
          ...
  ],
        "prevention": [
          "Prevention tip 1",
          "Prevention tip 2",
          ...
  ]
      }
this is very important:
Only return valid JSON as the answer. starting with { and ending with } also remove backticks from the response.
`},
    ];

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });
    console.log("AI response:", response.text);
    let parsedResult;

    if (typeof response.text === 'string') {
      try {
        
        parsedResult = JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch (parseError) {
        // Handle parse error
        return res.status(500).json({
          error: 'Failed to parse JSON response from AI',
          rawResponse: response.text,
        });
      }
    } else if (typeof response.text === 'object') {
      // Already an object, use it directly
      parsedResult = response.text;
    } else {
      // Unexpected type
      return res.status(500).json({ error: 'Unexpected AI response format' });
    }
    res.json(parsedResult);




  } catch (error) {
    console.error('Error in crop disease detection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { generate, detectCropDisease };
