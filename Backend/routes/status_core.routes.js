const express = require("express");
const router = express.Router();
const { getStatusCores } = require("../controllers/status_cores");

router.get("/", async (req, res, next) => {
  try {
    const data = await getStatusCores();
    res.json(data);
  } catch (error) {
    console.error(error)
    next(error);
  }
});


module.exports = router;
