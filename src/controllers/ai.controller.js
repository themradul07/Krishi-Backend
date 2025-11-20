const { generateAdvisory } = require('../services/ai.service');
const Chat = require('../models/Chat');
const Farmer = require('../models/Farmer');
const Activity = require('../models/Activity');

const generate = async (req, res) => {
  try {
    const { farmerId, question } = req.body;
    if (!farmerId || !question) return res.status(400).json({ message: 'Missing fields' });

    const farmer = await Farmer.findById(farmerId);
    const activities = await Activity.find({ farmerId }).sort({ timestamp: -1 }).limit(10);

    const promptParts = [];
    promptParts.push(`You are Krishi Sakhi, a helpful Malayalam farming assistant.`);
    promptParts.push(`Farmer details: name=${farmer.name}, crop=${farmer.crop}, soil=${farmer.soilType}, location=${farmer.location}.`);
    if (activities.length) {
      promptParts.push('Recent activities:');
      activities.forEach(a => promptParts.push(`${a.activity} at ${a.timestamp.toISOString()}`));
    }
    promptParts.push(`Question: ${question}`);
    promptParts.push('Answer concisely in Malayalam.');

    const prompt = promptParts.join('\n');

    const answer = await generateAdvisory({ prompt, openaiKey: process.env.OPENAI_API_KEY });
    await Chat.create({ farmerId, question, answer });

    res.json({ answer });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { generate };
