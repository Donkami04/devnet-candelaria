const { Neighbors } = require("../models/neighbors");

async function getNeighbors() {
  const neighbors = await Neighbors.findAll();
  return neighbors;
}

module.exports = { getNeighbors };
