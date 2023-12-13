const { StatusCores } = require("../models/status_cores");

async function getStatusCores() {
    try {
        const data = await StatusCores.findAll();
        return data;
    } catch(error) {
        return error.message;
    }
};

module.exports = { getStatusCores };