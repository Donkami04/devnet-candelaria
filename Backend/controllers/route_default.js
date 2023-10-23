const { RouteDefault } = require("../models/route_default");

async function getRouteDefault() {
  const dataRouteDefault = await RouteDefault.findAll();
  return dataRouteDefault;
}

module.exports = { getRouteDefault };
