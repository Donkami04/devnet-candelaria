const express = require("express");
const router = express.Router();
const { getInterfaces } = require("../controllers/interfaces");

router.get("/", async (req, res, next) => {
  try {
    const interfaces = await getInterfaces();
    res.json(interfaces);
    
  } catch (error) {
    console.error(error)
    next(error);
  }
});


module.exports = router;
