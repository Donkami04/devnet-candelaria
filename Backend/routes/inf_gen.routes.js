const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkRoles } = require("../middlewares/auth.handler");
const { createApSchema, editApSchema } = require("../schemas/ap.schema");
const { validateData } = require("../middlewares/validator.handler");
const {
  getInfGenData,
  getNumberApRegistered,
  getApRegistered,
  registerAp,
  getOneAp,
  editOneAp,
  deleteAp,
} = require("../controllers/inf_gen");

router.get("/", async (req, res, next) => {
  try {
    const data = await getInfGenData();
    res.json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/ap", async (req, res, next) => {
  try {
    const dataAp = await getNumberApRegistered();
    const listApRegistered = await getApRegistered();
    res.status(200).json({
      numberApRegisteredPrtg: dataAp.numTotalApPrtg,
      numberApRegisteredDb: dataAp.numTotalApDb,
      apList: listApRegistered,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/ap/:ip", async (req, res, next) => {
  try {
    const ip = req.params.ip;
    const ap = await getOneAp(ip);
    res.status(ap.status).json({
      status: ap.status,
      message: ap.message,
      error: ap.error,
      data: ap.data,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/ap/new",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "staff"),
  validateData(createApSchema),
  async (req, res, next) => {
    try {
      const data = req.body;
      const newAp = await registerAp(data);
      res.status(newAp.status).json({
        status: newAp.status,
        message: newAp.message,
        error: newAp.error,
        data: newAp.data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.put(
  "/ap/edit/:id",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "staff"),
  validateData(editApSchema),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const changes = req.body;
      const apEdit = await editOneAp(id, changes);
      res.status(apEdit.status).json({
        status: apEdit.status,
        message: apEdit.message,
        error: apEdit.error,
        data: apEdit.data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.delete(
  "/ap/remove/:ip",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "staff"),
  async (req, res, next) => {
    try {
      const ip = req.params.ip;
      const apDeleted = await deleteAp(ip);
      res.status(apDeleted.status).json({
        status: apDeleted.status,
        message: apDeleted.message,
        error: apDeleted.error,
        data: apDeleted.data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);
module.exports = router;
