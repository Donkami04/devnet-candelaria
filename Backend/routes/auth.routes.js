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
        return res.status(user.status).json({
          status: user.status,
          message: user.message,
          error: user.error,
          data: user.data,
        });
      }
      const rta = signToken(user.data.dataValues);
      // const decodedToken = jwt.verify(rta.token, SECRET);
      // console.log(decodedToken)
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
