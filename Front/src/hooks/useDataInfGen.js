import { useEffect, useState } from "react";
import {
  getInterfaces,
  getSystemHealth,
  getNeighbors,
  getDefaultRoute,
  getDataInfGen,
} from "../utils/Api-candelaria/api";

export async function useDataInfGen() {
  const dataInterfaces = await getInterfaces();
  const dataDevicesHealth = await getSystemHealth();
  const dataNeighbors = await getNeighbors();
  const dataRouteStatus = await getDefaultRoute();
  const dataInfraGeneral = await getDataInfGen();

  const dataSwCoreAdmin = [];
  const dataSwCoreConce = [];
  const dataSwCoreOjos = [];
  const dataSwCoreDistAdmin = [];
  const dataSwCoreDistConce = [];
  const dataSwCoreAdminDna = [];
  const dataSwCoreConceDna = [];

  const upElements = {
    swCoreAdminUp: [],
    swCoreConceUp: [],
    swCoreOjosUp: [],
    swDistAdmUp: [],
    swDistConceUp: [],
    coreAdminDnaUp: [],
    coreConceDnaUp: [],
  };

  const downElements = {
    swCoreAdminDown: [],
    swCoreConceDown: [],
    swCoreOjosDown: [],
    swDistAdmDown: [],
    swDistConceDown: [],
    coreAdminDnaDown: [],
    coreConceDnaDown: [],
  };

  //   dataInterfaces.forEach((e) => {
  //     if (
  //       (e.name_switch === "ADMIN" && e.status === "Up") ||
  //       (e.name_switch === "ADMIN" &&
  //         e.status.toLowerCase().includes("Paused") &&
  //         e.red === "it")
  //     ) {
  //       swCoreAdminUp.push(e);
  //     }
  //     if (e.name_switch === "CONCE") {
  //       swCoreConceUp.push(e);
  //     }
  //     if (e.name_switch === "OJOS") {
  //       swCoreOjosUp.push(e);
  //     }
  //     if (e.name_switch === "DIST-ADM") {
  //       swDistAdmUp.push(e);
  //     }
  //     if (e.name_switch === "DIST-CONC") {
  //       swDistConceUp.push(e);
  //     }
  //     if (e.name_switch === "ADMIN-DNA") {
  //       coreAdminDnaUp.push(e);
  //     }
  //     if (e.name_switch === "CONCE-DNA") {
  //       coreConceDnaUp.push(e);
  //     }
  //   });

  //   dataDevicesHealth.forEach((e) => {
  //     if (e.name_switch === "ADMIN") {
  //       swCoreAdminUp.push(e);
  //     }
  //     if (e.name_switch === "CONCE") {
  //       swCoreConceUp.push(e);
  //     }
  //     if (e.name_switch === "OJOS") {
  //       swCoreOjosUp.push(e);
  //     }
  //     if (e.name_switch === "DIST-ADM") {
  //       swDistAdmUp.push(e);
  //     }
  //     if (e.name_switch === "DIST-CONC") {
  //       swDistConceUp.push(e);
  //     }
  //     if (e.name_switch === "ADMIN-DNA") {
  //       coreAdminDnaUp.push(e);
  //     }
  //     if (e.name_switch === "CONCE-DNA") {
  //       coreConceDnaUp.push(e);
  //     }
  //   });

  //   dataNeighbors.forEach((e) => {
  //     if (e.name_switch === "ADMIN") {
  //       swCoreAdminUp.push(e);
  //     }
  //     if (e.name_switch === "CONCE") {
  //       swCoreConceUp.push(e);
  //     }
  //     if (e.name_switch === "OJOS") {
  //       swCoreOjosUp.push(e);
  //     }
  //     if (e.name_switch === "DIST-ADM") {
  //       swDistAdmUp.push(e);
  //     }
  //     if (e.name_switch === "DIST-CONC") {
  //       swDistConceUp.push(e);
  //     }
  //     if (e.name_switch === "ADMIN-DNA") {
  //       coreAdminDnaUp.push(e);
  //     }
  //     if (e.name_switch === "CONCE-DNA") {
  //       coreConceDnaUp.push(e);
  //     }
  //   });
  // }

  // dataInterfaces.forEach((e) => {
  //   if (e.name_switch === "SW CORE ADMIN") {
  //     dataSwCoreAdmin.push(e);
  //   };

  //   if (e.name_switch === "SW CORE CONCE") {
  //     dataSwCoreConce.push(e);
  //   };
  //   if (e.name_switch === "SW CORE OJOS") {
  //     dataSwCoreOjos.push(e);
  //   };
  //   if (e.name_switch === "SW DIST ADM") {
  //     dataSwCoreDistAdmin.push(e);
  //   };
  //   if (e.name_switch === "SW DIST CONCE") {
  //     dataSwCoreDistConce.push(e);
  //   };
  //   if (e.name_switch === "CORE ADMIN DNA") {
  //     dataSwCoreAdminDna.push(e);
  //   };
  //   if (e.name_switch === "CORE CONCE DNA") {
  //     dataSwCoreConceDna.push(e);
  //   };

  // })

  const classifyElement = (dataList) => {
    dataList.forEach((element) => {
      if (element.name_switch === "SW CORE ADMIN") {
        element.upArray = "swCoreAdminUp";
        element.downArray = "swCoreAdminDown";
        dataSwCoreAdmin.push(element);
      }

      if (element.name_switch === "SW CORE CONCE") {
        element.upArray = "swCoreConceUp";
        element.downArray = "swCoreConceDown";
        dataSwCoreConce.push(element);
      }

      if (element.name_switch === "SW CORE OJOS") {
        element.upArray = "swCoreOjosUp";
        element.downArray = "swCoreOjosDown";
        dataSwCoreOjos.push(element);
      }

      if (element.name_switch === "SW DIST ADM") {
        element.upArray = "swDistAdmUp";
        element.downArray = "swDistAdmDown";
        dataSwCoreDistAdmin.push(element);
      }

      if (element.name_switch === "SW DIST CONC") {
        element.upArray = "swDistConceUp";
        element.downArray = "swDistConceDown";
        dataSwCoreDistConce.push(element);
      }

      if (element.name_switch === "CORE ADMIN DNA") {
        element.upArray = "coreAdminDnaUp";
        element.downArray = "coreAdminDnaDown";
        dataSwCoreAdminDna.push(element);
      }

      if (element.name_switch === "CORE CONCE DNA") {
        element.upArray = "coreConceDnaUp";
        element.downArray = "coreConceDnaDown";
        dataSwCoreConceDna.push(element);
      }
    });
  };

  const upOrDownInterface = (dataList, nameSw) => {
    dataList.forEach((element) => {
      if (element.name && element.name.includes("Traffic")) {
        if (
          (element.name_switch === nameSw && element.status === "Up") ||
          (element.name_switch === nameSw &&
            element.status.toLowerCase().includes("paused"))
        ) {
          const upArrayDestiny = element.upArray;
          upElements[upArrayDestiny].push(element);
        }

        if (element.name_switch === nameSw && element.status.includes("Down")) {
          const downArrayDestiny = element.downArray;
          downElements[downArrayDestiny].push(element);
        }
      }
    });
  };

  const upOrDownNeighbors = (dataList, nameSw) => {
    dataList.forEach((element) => {
      if (element.neighbor) {
        if (element.name_switch === nameSw && element.status === "Up") {
          const upArrayDestiny = element.upArray;
          upElements[upArrayDestiny].push(element);
        }
        if (element.name_switch === nameSw && element.status === "Down") {
          const downArrayDestiny = element.downArray;
          downElements[downArrayDestiny].push(element);
        }
      }
    });
  };

  const upOrDownSysHealth = (dataList, nameSw) => {
    dataList.forEach((element) => {
      // Primer If es porque los neighbors no tienen `name`
      if (element.name && element.name.includes("System Health")) {
        if (
          element.name_switch === nameSw &&
          element.status === "Up" &&
          element.name.includes("CPU") &&
          parseInt(element.lastvalue) <= 90
        ) {
          const upArrayDestiny = element.upArray;
          upElements[upArrayDestiny].push(element);
        }
        if (
          (element.name_switch === nameSw &&
            element.name.includes("CPU") &&
            parseInt(element.lastvalue) > 90) ||
          (element.name_switch === nameSw &&
            element.name.includes("CPU") &&
            element.status.includes("Down"))
        ) {
          const downArrayDestiny = element.downArray;
          downElements[downArrayDestiny].push(element);
        }
        if (
          element.name_switch === nameSw &&
          element.status === "Up" &&
          element.name.includes("Power Supplies") &&
          element.lastvalue === "Normal"
        ) {
          const upArrayDestiny = element.upArray;
          upElements[upArrayDestiny].push(element);
        }
        if (
          (element.name_switch === nameSw &&
            element.name.includes("Power Supplies") &&
            element.lastvalue !== "Normal") ||
          (element.name_switch === nameSw &&
            element.name.includes("Power Supplies") &&
            element.status.includes("Down"))
        ) {
          const downArrayDestiny = element.downArray;
          downElements[downArrayDestiny].push(element);
        }
        if (
          element.name_switch === nameSw &&
          element.status === "Up" &&
          element.name.includes("Temperatures") &&
          parseInt(element.lastvalue) < 50
        ) {
          const upArrayDestiny = element.upArray;
          upElements[upArrayDestiny].push(element);
        }
        if (
          (element.name_switch === nameSw &&
            element.name.includes("Temperatures") &&
            parseInt(element.lastvalue) >= 50) ||
          (element.name_switch === nameSw &&
            element.name.includes("Temperatures") &&
            element.status.includes("Down"))
        ) {
          const downArrayDestiny = element.downArray;
          downElements[downArrayDestiny].push(element);
        }
      }
    });
  };


  classifyElement(dataInterfaces);
  classifyElement(dataDevicesHealth);
  classifyElement(dataNeighbors);

  upOrDownInterface(dataSwCoreAdmin, "SW CORE ADMIN");
  upOrDownInterface(dataSwCoreConce, "SW CORE CONCE");
  upOrDownInterface(dataSwCoreOjos, "SW CORE OJOS");
  upOrDownInterface(dataSwCoreDistAdmin, "SW DIST ADM");
  upOrDownInterface(dataSwCoreDistConce, "SW DIST CONC");
  upOrDownInterface(dataSwCoreAdminDna, "CORE ADMIN DNA");
  upOrDownInterface(dataSwCoreConceDna, "CORE CONCE DNA");

  upOrDownNeighbors(dataSwCoreAdmin, "SW CORE ADMIN");
  upOrDownNeighbors(dataSwCoreConce, "SW CORE CONCE");
  upOrDownNeighbors(dataSwCoreOjos, "SW CORE OJOS");
  upOrDownNeighbors(dataSwCoreDistAdmin, "SW DIST ADM");
  upOrDownNeighbors(dataSwCoreDistConce, "SW DIST CONC");
  upOrDownNeighbors(dataSwCoreAdminDna, "CORE ADMIN DNA");
  upOrDownNeighbors(dataSwCoreConceDna, "CORE CONCE DNA");

  upOrDownSysHealth(dataSwCoreAdmin, "SW CORE ADMIN");
  upOrDownSysHealth(dataSwCoreConce, "SW CORE CONCE");
  upOrDownSysHealth(dataSwCoreOjos, "SW CORE OJOS");
  upOrDownSysHealth(dataSwCoreDistAdmin, "SW DIST ADM");
  upOrDownSysHealth(dataSwCoreDistConce, "SW DIST CONC");
  upOrDownSysHealth(dataSwCoreAdminDna, "CORE ADMIN DNA");
  upOrDownSysHealth(dataSwCoreConceDna, "CORE CONCE DNA");

  const totalUpElements = [
    ...upElements.coreAdminDnaUp,
    ...upElements.coreConceDnaUp,
    ...upElements.swCoreAdminUp,
    ...upElements.swCoreConceUp,
    ...upElements.swCoreOjosUp,
    ...upElements.swDistAdmUp,
    ...upElements.swDistConceUp,
  ];

  const totalDownElements = [
    ...downElements.coreAdminDnaDown,
    ...downElements.coreConceDnaDown,
    ...downElements.swCoreAdminDown,
    ...downElements.swCoreConceDown,
    ...downElements.swCoreOjosDown,
    ...downElements.swDistAdmDown,
    ...downElements.swDistConceDown,
  ];

  dataRouteStatus.forEach(e => totalUpElements.push(e))

  const data = {
    totalUpElements: totalUpElements,
    totalDownElements: totalDownElements,
    upElements: upElements,
    downElements: downElements
  };

  return data;
}
