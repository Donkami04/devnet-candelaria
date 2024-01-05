const { ClientsOjos } = require("../models/dcs_ojos");

async function getOjosClients() {
  const clientsOjos = await ClientsOjos.findAll();
  return clientsOjos;
}

module.exports = { getOjosClients };
