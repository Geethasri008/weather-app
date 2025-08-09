export default async function handler(req, res) {
  const { city, lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  let currentUrl, forecastUrl;

  if (city) {
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  } else if (lat && lon) {
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    return res.status(400).json({ error: "Missing city or coordinates" });
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    if (currentData.cod !== 200) {
      return res.status(currentData.cod).json(currentData);
    }

    res.status(200).json({
      current: currentData,
      forecast: forecastData
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
