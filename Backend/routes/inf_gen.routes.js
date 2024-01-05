const express = require("express");
const router = express.Router();
const { getInfGenData } = require("../controllers/inf_gen");

router.get("/", async (req, res, next) => {
  try {
    const data = await getInfGenData();
    res.json(data);
    
  } catch (error) {
    console.error(error)
    next(error);
  }
});


module.exports = router;
