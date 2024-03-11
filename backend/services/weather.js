// Import express router for HTTP requests.
const router = require("express").Router();

const { getWeatherSummaryForLatLng } = require('../mongoose/functions/weather_functions');
const { processRequest } = require('../service_functions');

router.get("/summary", async (req, res) => {
  processRequest(
    res,
    () => getWeatherSummaryForLatLng(req.headers.lat, req.headers.lng, req.headers.daysahead),
    "Unable to generate summary for specified location."
  )
});

module.exports = router;