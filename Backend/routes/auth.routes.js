const express = require("express");
const router = express.Router();
const { loginSchema } = require("../schemas/auth.schema")
const { validateData } = require("../middlewares/validator.handler");
const passport = require("passport");
const { signToken } = require("../controllers/auth");

// const jwt = require('jsonwebtoken');
// const SECRET = process.env.JWT_SECRET;

router.post(
  "/login",
  validateData(loginSchema),
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      if (user.status === 401) {
        res.status(user.status).json({
          status: user.status,
          message: user.message,
          error: user.error,
          data: user.data,
        });
      } else {
        const tokenData = signToken(user.data.dataValues); // Genera el token
        res.status(user.status).json({
          status: user.status,
          message: user.message,
          error: user.error,
          data: {
            user: user.data,
            token: tokenData.token // Agrega el token generado
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
