const { geocoding_api_key } = require('../../config/api_keys.json');

const getLatLng = async (query) => {
  if (!query) {
    return {
      error: "Query is required",
      code: 400
    }
  }

  const locUri = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${geocoding_api_key}`;
  const locResponse = await fetch(locUri, {
    method: "GET"
  });
  const locData = await locResponse.json();

  if (locData.length === 0) {
    return {
      error: `Could not find location for query ${query}.`,
      code: 404
    }
  }
  const lat = locData.results[0].geometry.location.lat;
  const lng = locData.results[0].geometry.location.lng;

  return {
    success: true,
    location: {
      lat: lat,
      lng: lng
    },
    code: 200
  }
}

module.exports = {
  getLatLng
}