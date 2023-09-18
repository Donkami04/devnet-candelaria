const express = require("express");
const router = express.Router();
const { overall } = require("../controllers/dashboards/Candelaria-DCS/overallKpi");
const { getClients } = require("../controllers/clients");
const { getSwitches } = require("../controllers/switches");
const { getDisponibilidad } = require("../controllers/dashboards/Candelaria-DCS/disponibilidad");
const { getInfraSolucion } = require("../controllers/dashboards/Candelaria-DCS/infra_solucion");
const { dashboardMesh } = require("../controllers/dashboards/mesh");
const { dashboardDevices } = require("../controllers/dashboards/devices");
const { dashboardFirewalls } = require("../controllers/dashboards/firewalls");
const { dashboardWan } = require("../controllers/dashboards/wan");


router.get("/dcs-candelaria", async (req, res, next) => {
  try {
    let clients = await getClients();
    clients = clients.map((client) => client.toJSON());
    let switches = await getSwitches();
    switches = switches.map((switch_) => switch_.toJSON());

    const overallKpi = overall(clients);
    const disponibilidad = getDisponibilidad(clients);
    const infraSolucion = getInfraSolucion(switches);

    res.json({ overallKpi, disponibilidad, infraSolucion });
  } catch (error) {
    console.error("Error con dashboard DCS Candelaria");
    console.error(error);
    next(error);
  }
});

router.get("/mesh", async (req, res, next) => {
  try {
    const dataMesh = await dashboardMesh();
    const meshIndicators = {
      palasTotales: dataMesh.totalPalas,
      palasStatus2: dataMesh.palasStatus2,
      palasFailed: dataMesh.palasFailed,
      palasWarnings: dataMesh.palasWarnings,
      palasOk: dataMesh.palasOk,
      caexTotales: dataMesh.totalCaex,
      caexStatus2: dataMesh.caexStatus2,
      caexFailed: dataMesh.caexFailed,
      caexWarnings: dataMesh.caexWarnings,
      caexOk: dataMesh.caexOk,
    };
    res.json(meshIndicators);
  } catch (error) {
    console.error("Error con dashboard MESH");
    console.error(error);
    next(error);
  }
});

router.get("/devices", async (req, res, next) => {
  try {
    const dataDevices = await dashboardDevices();
    const devicesIndicators = {
      numTotalDevices: dataDevices.numTotalDevices,
      numTotalCameras: dataDevices.numTotalCameras,
      numTotalAp: dataDevices.numTotalAp,
      numTotalOthers: dataDevices.numTotalOthers,
      numCamerasUp: dataDevices.numCamerasUp,
      numCamerasDown: dataDevices.numCamerasDown,
      numApUp: dataDevices.numApUp,
      numApDown: dataDevices.numApDown,
      numApDown: dataDevices.numApDown,
      numOthersUp: dataDevices.numOthersUp,
      numOthersDown: dataDevices.numOthersDown,
    };
    res.json(devicesIndicators);
  } catch (error) {
    console.error("Error con dashboard Camaras");
    console.error(error);
    next(error);
  }
});

router.get("/firewalls", async (req, res, next) => {
  try {
    const dataFirewalls = await dashboardFirewalls();
    const firewallsIndicators = {
      numFwCorpAlive: dataFirewalls.numFwCorpAlive,
      numFwCorpDown: dataFirewalls.numFwCorpDown,
      numFwCommuniAlive: dataFirewalls.numFwCommuniAlive,
      numFwCommuniDown: dataFirewalls.numFwCommuniDown,
    };
    res.json(firewallsIndicators);
  } catch (error) {
    console.error("Error con dashboard Firewalls - Canales Internet");
    console.error(error);
    next(error);
  }
});

router.get("/wan", async (req, res, next) => {
  try {
    const dataWan = await dashboardWan();
    const wanIndicators = {
      kpiWan: dataWan,
    };
    res.json(wanIndicators);
  } catch (error) {
    console.error("Error con dashboard Wan");
    console.error(error);
    next(error);
  }
});

module.exports = router;
