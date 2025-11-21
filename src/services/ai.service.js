const axios = require('axios');

const generateAdvisory = async ({ prompt, openaiKey }) => {
  // Basic OpenAI API call (Chat Completions)
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' };
  const body = {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0.2
  };
  const res = await axios.post(url, body, { headers });
  const text = res.data.choices[0].message.content;
  return text;
};

module.exports = { generateAdvisory };
