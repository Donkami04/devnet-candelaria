const { ClientsPac } = require("../models/dcs_pac");

async function getPacClients() {
  const clientsPac = await ClientsPac.findAll();
  return clientsPac;
}

module.exports = { getPacClients };
