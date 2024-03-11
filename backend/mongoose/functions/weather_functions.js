const getWeatherSummaryForLatLng = async (lat, lng, daysAhead) => {
  if (!(lat && lng && daysAhead)) {
    return {
      error: "Latitude, longitude, and days ahead are required for a forecast.",
      code: 400
    }
  }

  if (daysAhead < 0) {
    return {
      error: "Cannot get forecast for prior days.",
      code: 400
    }
  }

  if (daysAhead > 6) {
    return {
      error: "Cannot get forecast more than 6 days in advance.",
      code: 400
    }
  }

  const weatherUri = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum&timezone=auto`;
  const weatherResponse = await fetch(weatherUri, {
    method: "GET"
  });
  const weather = await weatherResponse.json();
  if (weather.error) {
    console.error("Error" + weather.reason);
    return {
      error: `Failed to create weather summary for latitude: ${lat} and longitude: ${lng}`,
      code: 500
    };
  }

  let label = "Dry";
  if (weather.daily.rain_sum[daysAhead] > 0) {
    label = "Rain";
  } else if (weather.daily.snowfall_sum[daysAhead] > 0) {
    label = "Snow";
  }
  const summary = `${label} with a high of ${weather.daily.temperature_2m_max[0]} \u00B0C and low of ${weather.daily.temperature_2m_min[0]} \u00B0C`;

  return {
    success: true,
    summary: summary,
    code: 200
  };
}

module.exports = {
  getWeatherSummaryForLatLng
}