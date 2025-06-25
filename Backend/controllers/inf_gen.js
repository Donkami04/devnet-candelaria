const { DataInfGen } = require("../models/data_infra_general");
const { Ap } = require("../models/ap");
const { DataAp } = require("../models/data_ap");
const axios = require("axios");
const https = require("https");
const { extractInfraestructuraData } = require("./dashboards/InfraGeneralKpi.js/kpi");
require("dotenv").config();

class DataInfGenService {
  async getInfGenData() {
    try {
      const data = await DataInfGen.findAll();
      return {
        statusCode: 200,
        message:
          "Información de los Switches de Infraestructura General obtenida exitosamente",
        data: data,
      };
    } catch (error) {
      throw new Error(
        "Error al obtener la información de los Switches de Infraestructura General"
      );
    }
  }

  getPercentUpDevices = async () => {
    try {
      const data = await extractInfraestructuraData();
      const respData = {
        infraestructura_general: [],
        grupos_prtg: []
      };

      data.infraestructura_general.forEach((element) => {
        const upElem = element.upElem.length
        const downElem = element.downElem.length
        const total = downElem + upElem
        const percentUp = ((upElem / total).toFixed(2) * 100)
        // console.log(element.name_switch, percentUp);
        respData.infraestructura_general.push({name: element.name_switch, percentUp});
      });


      data.grupos_prtg.data.forEach((element) => {
        const upElem = element.up
        const downElem = element.down
        const total = downElem + upElem
        const percentUp = ((upElem / total).toFixed(2) * 100)
        // console.log(element.device, percentUp);
        respData.grupos_prtg.push({ name: element.device, percentUp });
      });
      console.log(respData);

      return {
        statusCode: 200,
        message: "Calculo del KPI por Equipo de I. General obtenido exitosamente.",
        data: respData
      }

    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: "Error en el Calculo del KPI por Equipo de I. General.",
        data: null
      }
    }

  };

}


module.exports = {
  DataInfGenService,
};
