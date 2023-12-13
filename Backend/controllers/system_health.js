const { SystemHealth } = require("../models/system_health");

async function getSystemHealth() {
  const dataSystemHealthDevices = await SystemHealth.findAll();
  return dataSystemHealthDevices;
}

module.exports = { getSystemHealth };
