import apiKeys from "../../config/api_keys.json";

import React, { useState, useEffect } from 'react';

function Weather({ location, dayOffset }) {
  const [weather, setWeather] = useState(null);

  async function getWeather() {
    try {
      const locUri = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKeys.geocoding_api_key}`;
      const locResponse = await fetch(locUri, {
        method: "GET"
      });
      const locData = await locResponse.json();
      const lat = locData.results[0].geometry.location.lat;
      const lng = locData.results[0].geometry.location.lng;

      if (locData.length === 0) {
        console.error(`Could not find weather for query ${location}: location not found.`);
        return;
      }

      const weatherUri = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum&timezone=auto`;
      const weatherResponse = await fetch(weatherUri, {
        method: "GET"
      });
      const weatherData = await weatherResponse.json();
      if (!weatherData.error) {
        setWeather(weatherData);
      }
    } catch (error) {
      console.error(`Could not find weather for query ${location}: ${error}`);
    }
  }

  function weatherString() {
    let label = "Dry";
    if (weather.daily.rain_sum[dayOffset] > 0) {
      label = "Rain";
    } else if (weather.daily.snowfall_sum[dayOffset] > 0) {
      label = "Snow";
    }
    return `${label} with a high of ${weather.daily.temperature_2m_max[0]} \u00B0C and low of ${weather.daily.temperature_2m_min[0]} \u00B0C`
  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    // if we have weather data for the specified day, display the summary
    (weather && dayOffset >= 0 && dayOffset < 7) && 
    <p className="field-text text-body-secondary">Forecast: {weatherString()}</p>
  );
}
export default Weather;