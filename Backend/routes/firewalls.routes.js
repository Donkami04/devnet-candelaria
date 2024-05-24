const express = require("express");
const router = express.Router();
const { validateData } = require("../middlewares/validator.handler");
const passport = require("passport");
const { checkRoles } = require("../middlewares/auth.handler");
const {
  createFirewallSchema,
  editFirewallSchema,
} = require("../schemas/firewalls.schema");
const {
  getFirewalls,
  createFirewall,
  editOneFirewall,
  deleteFirewall,
  getOneFirewall,
  getHistoryFail,
} = require("../controllers/firewalls");

router.get("/", async (req, res, next) => {
  try {
    const allFirewalls = await getFirewalls();
    res.json(allFirewalls);
  } catch (error) {
    next(error);
  }
});

router.get("/:ip/:ubication", async (req, res, next) => {
  try {
    const ip = req.params.ip;
    const ubication = req.params.ubication;
    const firewall = await getOneFirewall(ip, ubication);
    res.status(firewall.status).json({
      status: firewall.status,
      message: firewall.message,
      error: firewall.error,
      data: firewall.data,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "staff"),
  validateData(createFirewallSchema),
  async (req, res, next) => {
    try {
      const data = req.body;
      const newFirewall = await createFirewall(data);
      res.status(newFirewall.status).json({
        status: newFirewall.status,
        message: newFirewall.message,
        error: newFirewall.error,
        data: newFirewall.data,
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
  checkRoles("admin", "staff"),
  validateData(editFirewallSchema),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const changes = req.body;
      const firewallEdit = await editOneFirewall(id, changes);
      res.status(firewallEdit.status).json({
        status: firewallEdit.status,
        message: firewallEdit.message,
        error: firewallEdit.error,
        data: firewallEdit.data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.delete(
  "/remove/:ip/:ubication",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "staff"),
  async (req, res, next) => {
    try {
      const ip = req.params.ip;
      const ubication = req.params.ubication;
      const firewallDeleted = await deleteFirewall(ip, ubication);
      res.status(firewallDeleted.status).json({
        status: firewallDeleted.status,
        message: firewallDeleted.message,
        error: firewallDeleted.error,
        data: firewallDeleted.data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post(
  "/history-fail",
  // passport.authenticate("jwt", { session: false }),
  // checkRoles("admin", "staff"),
  async (req, res, next) => {
    try {
      const { fw, canal } = req.body;
      const data = await getHistoryFail(fw, canal);
      res.status(data.status).json({
        status: data.status,
        message: data.message,
        error: data.error,
        data: data.data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;
