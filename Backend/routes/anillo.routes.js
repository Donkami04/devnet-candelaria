const express = require("express");
const router = express.Router();
const { getDataAnillo, getDataAnilloUg, getDataAnilloUgUpDown } = require("../controllers/anillos");

router.get("/", async (req, res, next) => {
  try {
    const data = await getDataAnillo();
    res.json(data);
    
  } catch (error) {
    console.error(error)
    next(error);
  }
});

router.get("/ug", async (req, res, next) => {
  try {
    const data = await getDataAnilloUg();
    res.json(data);
    
  } catch (error) {
    console.error(error)
    next(error);
  }
});

router.get("/ug/updown", async (req, res, next) => {
  try {
    const data = await getDataAnilloUgUpDown();
    res.json(data);
    
  } catch (error) {
    console.error(error)
    next(error);
  }
});


module.exports = router;
