const express = require("express");
const router = express.Router();
const { LicenciamientosService } = require("../controllers/licenciamientos");

const Licenciamiento = new LicenciamientosService();

router.get("/", async (req, res, next) => {
  try {
    const response = await Licenciamiento.getLicenciamientos();
    res.status(response.statusCode).json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
