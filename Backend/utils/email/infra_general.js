const { getApiData } = require("./getData");
const { useDataInfGen } = require("../../controllers/dashboards/infra_general");
const { use } = require("react");

const fetchDataInfraGen = async () => {
  try {
    const data = await useDataInfGen();

    const elementsTempUp = data.upElements.filter((element) => element.name && element.name.includes("Temperatures"));
    const elementsTempDown = data.downElements.filter(
      (element) => element.name && element.name.includes("Temperatures")
    );

    const infraGen = `
    <div style="margin-top: 20px; font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="text-align: center; color: #111; font-size: 24px; margin: 0;">Infraestructura General</h2>
      <div style="text-align: center; overflow-x: auto; margin-top: 20px;">
        <table style="width: 100%; max-width: 600px; display: inline-table; border-collapse: collapse; font-size: 10px; color: #333; table-layout: fixed; style="text-align: center;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="width: 25%; border: 1px solid #ddd; padding: 3px; text-align: center;">Info</th>
              <th style="width: 25%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: rgb(3, 186, 31); color: white; font-weight: bold">Up</th>
              <th style="width: 25%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: red; color: white; font-weight: bold">Down</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">General</td>	
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${data.upElements.length}</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${data.downElements.length}</td>
            </tr>
            <tr>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">Temperaturas</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${elementsTempUp.length}</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${elementsTempDown.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    `;

    return infraGen;
  } catch (error) {
    console.error("Error fetching Infra General data:", error);
    throw new Error("Failed to fetch device data");
  }
};

module.exports = {
  fetchDataInfraGen,
};
