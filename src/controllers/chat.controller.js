const Chat = require('../models/Chat');

const storeChat = async (req, res) => {
  try {
    const { farmerId, question, answer } = req.body;
    if (!farmerId) return res.status(400).json({ message: 'Missing farmerId' });
    const c = await Chat.create({ farmerId, question, answer });
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const history = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const items = await Chat.find({ farmerId }).sort({ timestamp: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { storeChat, history };
