const express = require("express");
const router = express.Router();
const { validateData } = require("../middlewares/validator.handler");
const { createWanSchema, editWanSchema } = require("../schemas/wan.schema");
const passport = require("passport");
const { checkRoles } = require("../middlewares/auth.handler");
const {
  getWan,
  createWan,
  editOneWan,
  deleteWan,
  getOneWan,
} = require("../controllers/wan");

router.get("/", async (req, res, next) => {
  try {
    const wanList = await getWan();
    res.json(wanList);
  } catch (error) {
    next(error);
  }
});

router.get("/:ip", async (req, res, next) => {
  try {
    const ip = req.params.ip;
    const wan = await getOneWan(ip);
    res.status(wan.status).json({
      status: wan.status,
      message: wan.message,
      error: wan.error,
      data: wan.data,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "staff", "staff"),
  validateData(createWanSchema),
  async (req, res, next) => {
    try {
      const data = req.body;
      const newWan = await createWan(data);
      res.status(newWan.status).json({
        status: newWan.status,
        message: newWan.message,
        error: newWan.error,
        data: newWan.data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.put(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "staff", "staff"),
  validateData(editWanSchema),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const changes = req.body;
      const wanEdit = await editOneWan(id, changes);
      res.status(wanEdit.status).json({
        status: wanEdit.status,
        message: wanEdit.message,
        error: wanEdit.error,
        data: wanEdit.data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.delete(
  "/remove/:ip",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "staff", "staff"),
  async (req, res, next) => {
    try {
      const ip = req.params.ip;
      const wanDeleted = await deleteWan(ip);
      res.status(wanDeleted.status).json({
        status: wanDeleted.status,
        message: wanDeleted.message,
        error: wanDeleted.error,
        data: wanDeleted.data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;
