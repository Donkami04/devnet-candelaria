const { getApiData } = require("./getData");

const fetchDataDcs = async () => {
  try {
    const dataCandelaria = await getApiData("indicators/dcs-candelaria");
    const dataDesaladora = await getApiData("indicators/dcs-desaladora");

    const dcsTable = `
    <div style="margin-top: 20px; font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="text-align: center; color: #111; font-size: 24px; margin: 0;">Control Proceso</h2>
      <h3 style="text-align: center; color: #111; margin-top: 4px;">DCS</h3>
      <div style="text-align: center; overflow-x: auto;">
        <table style="width: 100%; max-width: 600px; display: inline-table; border-collapse: collapse; font-size: 10px; color: #333; table-layout: fixed; style="text-align: center;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="width: 25%; border: 1px solid #ddd; padding: 4px;">Ubicación</th>
              <th style="width: 25%; border: 1px solid #ddd; padding: 4px;">Overall</th>
              <th style="width: 25%; border: 1px solid #ddd; padding: 4px;">Disp</th>
              <th style="width: 25%; border: 1px solid #ddd; padding: 4px;">Inf Sol</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">Candelaria</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px; background-color: ${dataCandelaria.overallKpi.indicador < 99.95 ? "red" : "rgb(3, 186, 31)"}; color: white; font-weight: bold">${dataCandelaria.overallKpi.indicador}%</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px; background-color: ${dataCandelaria.disponibilidad.indicador < 99.95 ? "red" : "rgb(3, 186, 31)"}; color: white; font-weight: bold">
                ${dataCandelaria.disponibilidad.indicador}%
              </td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px; background-color: rgb(3, 186, 31); color: white; font-weight: bold">${dataCandelaria.infraSolucion.indicador}%</td>
            </tr>
            <tr>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">Desaladora</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px; background-color: ${dataDesaladora.overallKpi.indicador < 99.95 ? "red" : "rgb(3, 186, 31)"}; color: white; font-weight: bold">${dataDesaladora.overallKpi.indicador}%</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px; background-color: ${dataDesaladora.disponibilidad.indicador < 99.95 ? "red" : "rgb(3, 186, 31)"}; color: white; font-weight: bold">${dataDesaladora.disponibilidad.indicador}%</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">N/A</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    const otTable = `
      <h3 style="text-align: center; color: #111; margin-top: 24px;">Sistemas OT</h3>
      <div style="text-align: center; overflow-x: auto;">
        <table style="width: 100%; max-width: 600px; display: inline-table; border-collapse: collapse; font-size: 10px; color: #333; table-layout: fixed; style="text-align: center;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="width: 33%; border: 1px solid #ddd; padding: 4px;">Sistema</th>
              <th style="width: 17%; border: 1px solid #ddd; padding: 4px; background-color: rgb(3, 186, 31); color: white; font-weight: bold">Up</th>
              <th style="width: 17%; border: 1px solid #ddd; padding: 4px; background-color: red; color: white; font-weight: bold">Down</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">Red OT Flotación</td>
              <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">41</td>
              <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">0</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">MRA</td>
              <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">12</td>
              <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `;


    return dcsTable + otTable;
  } catch (error) {
    console.error("Error fetching DCS data:", error);
    throw new Error("Failed to fetch DCS data");
  }
};

module.exports = {
  fetchDataDcs,
};
