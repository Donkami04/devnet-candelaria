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

async function getDataAnilloUgUpDown() {
  const response = await AnilloUg.findAll();

  const upElements = [];
  const downElements = [];

  response.forEach((item) => {
    const status = item.status.toLowerCase();
    if (status.includes("up")) {
      upElements.push(item);
    } else if (status.includes("down")) {
      downElements.push(item);
    }
  });

  const totalElements = upElements.length + downElements.length;
  const upPorcent = totalElements ? (upElements.length / totalElements) * 100 : 0;

  return {
    upElements,
    downElements,
    upPorcent: parseFloat(upPorcent.toFixed(1)),
  };
}

module.exports = { getDataAnillo, getDataAnilloUg, getDataAnilloUgUpDown };
