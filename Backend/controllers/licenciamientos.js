const { Licenciamientos } = require("../models/licenciamientos");

class LicenciamientosService {
  async getLicenciamientos() {
    try {
      const data = await Licenciamientos.findAll();
      data.forEach((element) => {
        element.dataValues.status = null;
      })
      return {
        statusCode: 200,
        message: "Información de los licenciamientos obtenida exitosamente",
        data: data,
      };
    } catch (error) {
      throw new Error("Error al obtener la información de los licenciamientos");
    }
  }
}

module.exports = { LicenciamientosService };
