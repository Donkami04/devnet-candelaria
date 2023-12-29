const { DataInfGen } = require("../models/data_infra_general");

async function getInfGenData() {
  const data = await DataInfGen.findAll();
  return data;
}

module.exports = { getInfGenData };
