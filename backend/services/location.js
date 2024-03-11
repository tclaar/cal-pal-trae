// Import express router for HTTP requests.
const router = require("express").Router();

const { getLatLng } = require('../mongoose/functions/location_functions');
const { processRequest } = require('../service_functions');

router.get("/:query", async (req, res) => {
  processRequest(
    res,
    () => getLatLng(req.params.query),
    "Unable to find location for query."
  )
});

module.exports = router;