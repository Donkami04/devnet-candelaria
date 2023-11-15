const { Interfaces } = require("../models/interfaces");

async function getInterfaces() {
    const dataInterfaces = await Interfaces.findAll();
    return dataInterfaces
}

module.exports = { getInterfaces}