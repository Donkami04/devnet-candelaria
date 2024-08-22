// Se encarga de clasificar todos los elementos de la Infraestructura General
// en dos arrays, Up o Down.

import {
  getInterfaces,
  getSystemHealth,
  getNeighbors,
  getDefaultRoute,
  getDataInfGen,
  getAp,
  getDataPrtgGroups,
} from "../utils/Api-candelaria/api";

export async function useDataInfGen() {
  const dataInterfaces = await getInterfaces();
  const dataDevicesHealth = await getSystemHealth();
  const dataNeighbors = await getNeighbors();
  const dataRouteStatus = await getDefaultRoute();
  // const dataAp = await getAp();
  const dataPrtgGroups = await getDataPrtgGroups();

  const allData = [
    ...dataInterfaces,
    ...dataDevicesHealth,
    ...dataNeighbors,
    ...dataRouteStatus,
    ...dataPrtgGroups,
  ];

  const upElements = [];
  const downElements = [];

  const upOrDownInterface = (dataList) => {
    dataList.forEach((element) => {
      if (element.name && element.name.includes("Traffic")) {
        if (
          element.status === "Up" ||
          element.status.toLowerCase().includes("paused")
        ) {
          upElements.push(element);
        }

        if (element.status.includes("Down")) {
          downElements.push(element);
        }
      }
    });
  };

  const upOrDownNeighbors = (dataList) => {
    dataList.forEach((element) => {
      if (element.neighbor) {
        if (element.status === "Up") {
          upElements.push(element);
        }
        if (element.status === "Down") {
          downElements.push(element);
        }
      }
    });
  };

  const upOrDownSysHealth = (dataList) => {
    dataList.forEach((element) => {
      // Primer If es porque los neighbors no tienen `name`
      if (element.name && element.name.includes("System Health")) {
        if (
          element.status === "Up" &&
          element.name.includes("CPU") &&
          parseInt(element.lastvalue) <= 90
        ) {
          upElements.push(element);
        }
        if (
          (element.name.includes("CPU") && parseInt(element.lastvalue) > 90) ||
          (element.name.includes("CPU") && element.status.includes("Down"))
        ) {
          downElements.push(element);
        }
        if (
          (element.status === "Up" &&
            element.name.includes("Power Supplies") &&
            element.lastvalue === "Normal") ||
          (element.status.toLowerCase().includes("paused") &&
            element.name.includes("Power Supplies") &&
            element.lastvalue === "-")
        ) {
          upElements.push(element);
        }
        if (
          (element.name.includes("Power Supplies") &&
            element.lastvalue !== "Normal" && 
            element.lastvalue !== "-") ||
          (element.name.includes("Power Supplies") &&
            element.status.includes("down"))
        ) {
          downElements.push(element);
        }
        if (element.status.includes("Down")) {
          downElements.push(element);
        }
        if (
          element.status === "Up" &&
          element.name.includes("Temperatures") &&
          parseInt(element.lastvalue) < 50
        ) {
          upElements.push(element);
        }
        if (
          (element.name.includes("Temperatures") &&
            parseInt(element.lastvalue) >= 50) ||
          (element.name.includes("Temperatures") &&
            element.status.includes("Down"))
        ) {
          downElements.push(element);
        }

        if (
          (element.name.includes("Memory") &&
            element.name_switch === "WLC 9800 NEGOCIO" &&
            parseInt(element.lastvalue.replace(".", "")) <= 1000) ||
          (element.name.includes("Memory") &&
            element.name_switch === "WLC 9800 NEGOCIO" &&
            element.status.includes("Down"))
        ) {
          downElements.push(element);
        }
      }
    });
  };

  const upOrDownRouteDefault = (dataList) => {
    dataList.forEach((element) => {
      if (element.via_bgp) {
        if (element.via_bpg === "true") {
          upElements.push(element);
        }
        if (element.via_bgp === "false") {
          downElements.push(element);
        }
      }
    });
  };

  // Clasificacion de AP
  dataPrtgGroups.forEach((element) => {
    if (element.status.includes("Down")) {
      downElements.push(element);
    }
    if (element.status.includes("Up")) {
      upElements.push(element);
    }
  });

  upOrDownInterface(allData);
  upOrDownNeighbors(allData);
  upOrDownSysHealth(allData);
  upOrDownRouteDefault(allData);

  const data = {
    upElements: upElements,
    downElements: downElements,
  };

  return data;
}
