const { getWeather } = require('../services/weather.service');

const weather = async (req, res) => {
  try {
    const { location } = req.params;
    if (!location) return res.status(400).json({ message: 'Missing location' });
    const data = await getWeather(location, process.env.WEATHER_API_KEY);
    res.json(data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Weather fetch error' });
  }
};

module.exports = { weather };
