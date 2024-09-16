const express = require("express");
const router = express.Router();
const { getDockersData } = require("../controllers/dockers");

router.get("/", async (req, res, next) => {
  try {
    const data = await getDockersData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
