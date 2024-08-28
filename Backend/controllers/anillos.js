const { Anillo } = require("../models/anillo");
const { AnilloUg } = require("../models/anillo_ug");

async function getDataAnillo() {
  const data = await Anillo.findAll();
  return data;
}

async function getDataAnilloUg() {
  const data = await AnilloUg.findAll();
  return data;
}

module.exports = { getDataAnillo, getDataAnilloUg };
