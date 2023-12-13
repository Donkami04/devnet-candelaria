const express = require("express");
const router = express.Router();
const { getRouteDefault } = require("../controllers/route_default");

router.get("/", async (req, res, next) => {
  try {
    const routeDefault = await getRouteDefault();
    res.json(routeDefault);
  } catch (error) {
    console.error(error)
    next(error);
  }
});


module.exports = router;
