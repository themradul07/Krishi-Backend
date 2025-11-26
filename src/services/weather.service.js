const axios = require('axios');

const getWeather = async (location) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Jhansi&units=metric&appid=0c0fdbaea0ed2ec1f0f82ad4b62eea1b`;
  const res = await axios.get(url);
  return res.data;
};

module.exports = { getWeather };
