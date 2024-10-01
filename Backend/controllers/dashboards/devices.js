const { getDevices } = require("../devices");
const { DevicesService } = require("../devices");	

const Devices = new DevicesService();

const dashboardDevices = async () => {
  try {
    let devices = await Devices.getDevices();
    devices = devices.data.map((device) => device.toJSON());

    const numCamerasUp = devices.filter(
      (device) =>
        device.type.toLowerCase() === "camara" &&
        device.prtg_status && device.prtg_status.includes("Up")
    );
    const numCamerasDown = devices.filter(
      (device) =>
        device.type.toLowerCase() === "camara" &&
        device.prtg_status && device.prtg_status.includes("Down")
    );

    const numTotalCameras = numCamerasUp.length + numCamerasDown.length;
    
    const numApUp = devices.filter(
      (device) =>
        device.type.toLowerCase().includes("access point") &&
        device.prtg_status && device.prtg_status.includes("Up")
    );
    const numApDown = devices.filter(
      (device) =>
        device.type.toLowerCase().includes("access point") &&
        device.prtg_status && device.prtg_status.includes("Down")
    );

    const numTotalAp = numApUp.length + numApDown.length;
    
    const numOthersUp = devices.filter(
      (device) =>
        device.type.toLowerCase() !== "camara" &&
        device.type.toLowerCase() !== "access point" &&
        device.type.toLowerCase() !== "access point red negocio" &&
        device.type.toLowerCase() !== "impresora" &&
        device.prtg_status && device.prtg_status.includes("Up")
    );
    const numOthersDown = devices.filter(
      (device) =>
        device.type.toLowerCase() !== "camara" &&
        device.type.toLowerCase() !== "access point" &&
        device.type.toLowerCase() !== "impresora" &&
        device.type.toLowerCase() !== "access point red negocio" &&
        device.prtg_status && device.prtg_status.includes("Down")
    );

    const numTotalOthers = numOthersUp.length + numOthersDown.length;

    const numImpresorasUp = devices.filter(
      (device) =>
        device.type.toLowerCase() === "impresora" && 
        device.prtg_status && device.prtg_status.includes("Up")
    );    

    const numImpresorasDown = devices.filter(
      (device) =>
        device.type.toLowerCase() === "impresora" && 
        device.prtg_status && device.prtg_status.includes("Down")
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
    return {
      statusCode: 200,
      message: "Calculos de dispositivos obtenido exitosamente",
      data: dataDevices
    }
    
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Error generando los calculos de los dispositivos",
      data: null,
      error: error.message
    };
  }
};


module.exports = { dashboardDevices };
