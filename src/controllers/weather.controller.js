const { getWeather, reverseGeoLookup } = require('../services/weather.service');
const { sendWhatsApp } = require("../services/whatsapp.service");



// MAIN WEATHER API
const weather = async (req, res) => {
  try {
    const { location } = req.params;
    if (!location) {
      return res.status(400).json({ message: 'Missing location' });
    }

    const data = await getWeather(location, process.env.WEATHER_API_KEY);

    // return full forecast so frontend can read rainChance, humidity etc.
    res.json({
      location: data.location,
      current: data.current,
      forecast: data.forecast
    });

  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Weather fetch error' });
  }
};

// REVERSE GEOLOCATION (lat, lon -> nearest city)
const reverseGeo = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Missing lat/lon" });
    }

    const city = await reverseGeoLookup(lat, lon, process.env.WEATHER_API_KEY);

    res.json({ location: city });

  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ message: "Reverse geo lookup failed" });
  }
};

// TEST WEATHER ALERT
const testWeatherAlert = async (req, res) => {
  try {
    const phone = "+919140395305";

    await sendWhatsApp(
      "മഴ വരാൻ സാധ്യത. ഇന്നത്തെ എല്ലാ സ്പ്രേയും ഒഴിവാക്കുക.",
      phone
    );

    res.json({ message: "Weather test alert sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send" });
  }
};

module.exports = { weather, reverseGeo, testWeatherAlert };
