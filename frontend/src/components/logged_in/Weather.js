import React, { useState, useEffect } from 'react';

function Weather({ location, dayOffset }) {
  const [weather, setWeather] = useState(null);

  async function getWeather() {
    try {
      const locUri = `http://localhost:2000/location/${location}`;
      const locResponse = await fetch(locUri, {
        method: "GET"
      });
      const locData = await locResponse.json();

      if (!locData.success) {
        console.error(`Could not find weather for query ${location}: location not found.`);
        return;
      }
      
      const lat = locData.location.lat;
      const lng = locData.location.lng;

      const weatherUri = "http://localhost:2000/weather/summary";
      const weatherResponse = await fetch(weatherUri, {
        method: "GET",
        headers: {
          "lat": lat,
          "lng": lng,
          "daysahead": dayOffset
        }
      });
      const weatherData = await weatherResponse.json();
      if (weatherData.success) {
        setWeather(weatherData.summary);
      }
    } catch (error) {
      console.error(`Could not find weather for query ${location}: ${error}`);
    }
  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    // if we have weather data for the specified day, display the summary
    (weather && dayOffset >= 0 && dayOffset < 7) && 
    <p className="field-text text-body-secondary">Forecast: {weather}</p>
  );
}
export default Weather;