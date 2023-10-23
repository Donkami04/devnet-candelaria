const express = require("express");
const router = express.Router();
const { getSystemHealth } = require("../controllers/system_health");

router.get("/", async (req, res, next) => {
  try {
    const dataSystemHealthDevices = await getSystemHealth();
    res.json(dataSystemHealthDevices);
    
  } catch (error) {
    console.error(error)
    next(error);
  }
});


module.exports = router;
