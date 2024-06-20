const { DataInfGen } = require("../models/data_infra_general");
const { Ap } = require("../models/ap");
const { DataAp } = require("../models/data_ap");
const axios = require("axios");
const https = require("https");
require("dotenv").config();

async function getInfGenData() {
  const data = await DataInfGen.findAll();
  return data;
}

// async function getApRegistered() {
//   const data = await Ap.findAll();
//   return data;
// }

// async function getNumberApRegistered() {
//   try {
//     const agent = new https.Agent({ rejectUnauthorized: false });
//     const idPrtgUrl = process.env.URL_PRTG_GET_ID;
//     const numberApUrl = process.env.URL_PRTG_AP_REGISTERED;
//     const apRegisteredInDb = await DataAp.findAll();
//     const response = await axios.get(idPrtgUrl, {
//       httpsAgent: agent,
//     });

//     if (response.status === 200) {
//       const idControllerPrtg = response.data.devices[0].objid;
//       const fullNumberApUrl = numberApUrl.replace(
//         "${ID_SWITCH}",
//         idControllerPrtg
//       );
//       const responseNumberAp = await axios.get(fullNumberApUrl, {
//         httpsAgent: agent,
//       });

//       if (responseNumberAp.status === 200) {
//         const numTotalApPrtg = responseNumberAp.data.sensors[0].lastvalue_raw;
//         return {
//           numTotalApPrtg: numTotalApPrtg,
//           numTotalApDb: apRegisteredInDb.length,
//         };
//       }
//     }
//   } catch (error) {
//     console.error(
//       "Error al obtener el numero de AP registrados desde PRTG:",
//       error
//     );
//     throw error;
//   }
// }

// async function registerAp(data) {
//   try {
//     const apDoesExist = await DataAp.findOne({
//       where: { ip: data.ip },
//     });
//     if (!apDoesExist) {
//       const newAp = await DataAp.create({
//         name: data.name,
//         model: data.model,
//         ip: data.ip,
//         state: data.state,
//         location: data.location,
//       });
//       return {
//         status: 201,
//         message:
//           "El Ap ha sido registrado exitosamente, espere unos minutos para que el sistema actualice los datos.",
//         data: newAp,
//       };
//     }
//     return {
//       status: 409,
//       message: "El AP ya existe en la base de datos.",
//     };
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// async function getOneAp(ip) {
//   const ap = await DataAp.findOne({ where: { ip: ip } });
//   if (ap) {
//     return {
//       status: 200,
//       data: ap,
//     };
//   }
//   return {
//     status: 404,
//     message: "El AP no existe en la base de datos.",
//   };
// }

// async function editOneAp(id, changes) {
//   try {
//     const ap = await DataAp.findByPk(id);
//     if (ap) {
//       await DataAp.update(
//         {
//           name: changes.name,
//           model: changes.model,
//           ip: changes.ip,
//           state: changes.state,
//           location: changes.location,
//         },
//         { where: { id: id } }
//       );
//       const apUpdated = await DataAp.findByPk(id);
//       return {
//         status: 200,
//         message: "El AP ha sido modificado exitosamente.",
//         data: apUpdated,
//       };
//     }
//     return {
//       status: 404,
//       message: "El AP no existe en la base de datos.",
//     };
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// async function deleteAp(ip) {
//   try {
//     const ap = await DataAp.findOne({ where: { ip: ip } });
//     if (ap) {
//       await DataAp.destroy({ where: { id: ap.id } });
//       const checkApIsDeleted = await DataAp.findByPk(ap.id);
//       if (!checkApIsDeleted) {
//         return {
//           status: 200,
//           message: "El AP ha sido eliminado exitosamente",
//         };
//       } else {
//         throw error;
//       }
//     }
//     return {
//       status: 404,
//       message: "El AP no existe en la base de datos",
//     };
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }



module.exports = {
  getInfGenData,
  // getNumberApRegistered,
  // getApRegistered,
  // registerAp,
  // getOneAp,
  // editOneAp,
  // deleteAp,
};
