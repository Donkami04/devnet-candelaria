const { getApiData } = require("./getData");

const fetchDataDevices = async () => {
  try {
    const data = await getApiData("indicators/devices");
    const d = data.data;

    const rows = [
      { name: "Camaras", up: d.numCamerasUp, down: d.numCamerasDown, total: d.numTotalCameras },
      { name: "Access Points", up: d.numApUp, down: d.numApDown, total: d.numTotalAp },
      { name: "Impresoras", up: d.numImpresorasUp, down: d.numImpresorasDown, total: d.numTotalImpresoras },
      { name: "Magic Info", up: d.numMagicUp, down: d.numMagicDown, total: d.numTotalMagic },
      { name: "Ctrl de Acceso", up: d.numBarreraUp, down: d.numBarreraDown, total: d.numTotalBarrera },
      { name: "Otros", up: d.numOthersUp, down: d.numOthersDown, total: d.numTotalOthers },
      {
        name: "Total",
        up: d.numOthersUp + d.numBarreraUp + d.numMagicUp + d.numImpresorasUp + d.numApUp + d.numCamerasUp,
        down:
          d.numOthersDown + d.numBarreraDown + d.numMagicDown + d.numImpresorasDown + d.numApDown + d.numCamerasDown,
        total: d.numTotalDevices,
      },
    ];

    const dashDevices = `
    <div style="margin-top: 20px; font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="text-align: center; color: #111;">Dispositivos Candelaria</h2>
        <div style="overflow-x: auto; text-align: center;">
        <table style="width: 100%; max-width: 600px; display: inline-table; border-collapse: collapse; font-size: 10px; color: #333;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="width: 25%; border: 1px solid #ddd; padding: 3px; text-align: center;">Dispositivos</th>
              <th style="width: 25%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: rgb(3, 186, 31); color: white; font-weight: bold">Up</th>
              <th style="width: 25%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: red; color: white; font-weight: bold">Down</th>
              <th style="width: 25%; border: 1px solid #ddd; padding: 3px; text-align: center; font-weight: bold">Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows
        .map(
          (row) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${row.name}</td>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${row.up}</td>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${row.down}</td>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${row.total}</td>
              </tr>
            `
        )
        .join("")}
          </tbody>
        </table>
      </div>
    </div>
    
  `;

    return dashDevices;
  } catch (error) {
    console.error("Error fetching device data:", error);
    throw new Error("Failed to fetch device data");
  }
};

module.exports = {
  fetchDataDevices,
};
