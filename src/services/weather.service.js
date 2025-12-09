const axios = require("axios");

const getWeather = async (location) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Step 1: Convert city -> coordinates
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
  const geoRes = await axios.get(geoURL);

  if (!geoRes.data.length) throw new Error("City not found");

  const { lat, lon } = geoRes.data[0];

  // Step 2: Get full weather + forecast
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await axios.get(url);

  return {
    location: {
      name: location,
      lat,
      lon
    },
    current: res.data.current,
    forecast: res.data.daily.slice(0, 4) // 4 day forecast
  };
};

module.exports = { getWeather };
