const express = require("express");
const router = express.Router();
// const { validateData } = require("../middlewares/validator.handler");
// const {
//   createClientSchema,
//   editClientSchema,
// } = require("../schemas/clients.schema");
// const passport = require("passport");
// const { checkRoles } = require("../middlewares/auth.handler");
const { getPacClients } = require("../controllers/dcs_pac");

router.get("/", async (req, res, next) => {
  try {
    const allClients = await getPacClients();
    res.json(allClients);
  } catch (error) {
    next(error);
  }
});

module.exports = router;