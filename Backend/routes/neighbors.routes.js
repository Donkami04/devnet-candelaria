const express = require("express");
const router = express.Router();
const { getNeighbors } = require("../controllers/neighbors");

router.get("/", async (req, res, next) => {
  try {
    const neighbors = await getNeighbors();
    // const kaka = neighbors.switchCoreAdmin;
    // kaka.forEach(e => console.log(e))
    res.json(neighbors);
  } catch (error) {
    console.error(error)
    next(error);
  }
});


module.exports = router;
