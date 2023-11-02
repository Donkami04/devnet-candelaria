const { getDevices } = require("../devices");

const dashboardDevices = async () => {
  try {
    let devices = await getDevices();
    devices = devices.map((device) => device.toJSON());

    const numCamerasUp = devices.filter(
      (device) =>
        device.type.toLowerCase() === "camara" &&
        device.prtg_status.includes("Up")
    );
    const numCamerasDown = devices.filter(
      (device) =>
        device.type.toLowerCase() === "camara" &&
        device.prtg_status.includes("Down")
    );
    // const numTotalCameras = devices.filter(
    //   (device) => device.type.toLowerCase() === "camara"
    // );

    const numTotalCameras = numCamerasUp.length + numCamerasDown.length;
    
    const numApUp = devices.filter(
      (device) =>
        device.type.toLowerCase() === "access point" && device.prtg_status.includes("Up")
    );
    const numApDown = devices.filter(
      (device) =>
        device.type.toLowerCase() === "access point" &&
        device.prtg_status.includes("Down")
    );

    const numTotalAp = numApUp.length + numApDown.length;
    
    const numOthersUp = devices.filter(
      (device) =>
        device.type.toLowerCase() !== "camara" &&
        device.type.toLowerCase() !== "access point" &&
        device.type.toLowerCase() !== "impresora" &&
        device.prtg_status.includes("Up")
    );
    const numOthersDown = devices.filter(
      (device) =>
        device.type.toLowerCase() !== "camara" &&
        device.type.toLowerCase() !== "access point" &&
        device.type.toLowerCase() !== "impresora" &&
        device.prtg_status.includes("Down")
    );

    const numTotalOthers = numOthersUp.length + numOthersDown.length;

    const numImpresorasUp = devices.filter(
      (device) =>
        device.type.toLowerCase() === "impresora" && device.prtg_status.includes("Up")
    );    

    const numImpresorasDown = devices.filter(
      (device) =>
        device.type.toLowerCase() === "impresora" && device.prtg_status.includes("Down")
    );   
    
    const numTotalImpresoras = numImpresorasUp.length + numImpresorasDown.length;

    const dataDevices = {
      numTotalDevices: devices.length,
      numTotalCameras: numTotalCameras,
      numTotalAp: numTotalAp,
      numTotalImpresoras: numTotalImpresoras,
      numTotalOthers: numTotalOthers,
      numCamerasUp: numCamerasUp.length,
      numCamerasDown: numCamerasDown.length,
      numApUp: numApUp.length,
      numApDown: numApDown.length,
      numOthersUp: numOthersUp.length,
      numOthersDown: numOthersDown.length,
      numImpresorasUp: numImpresorasUp.length,
      numImpresorasDown: numImpresorasDown.length
    };

    return dataDevices;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = { dashboardDevices };
