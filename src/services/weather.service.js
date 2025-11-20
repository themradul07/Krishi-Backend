const axios = require('axios');

const getWeather = async (location, apiKey) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
  const res = await axios.get(url);
  return res.data;
};

module.exports = { getWeather };
