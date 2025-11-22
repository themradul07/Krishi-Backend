const { getWeather } = require('../services/weather.service');
const { sendWhatsApp } = require("../services/whatsapp.service");

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


testWeatherAlert = async (req, res) => {
  try {
    const phone = "+919140395305"; // Farmer's WhatsApp number

    await sendWhatsApp(
      "മഴ വരാൻ സാധ്യത. ഇന്നത്തെ എല്ലാ സ്പ്രേയും ഒഴിവാക്കുക." ,
      phone
    );

    res.json({ message: "Weather test alert sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send" });
  }
};


module.exports = { weather  , testWeatherAlert };

