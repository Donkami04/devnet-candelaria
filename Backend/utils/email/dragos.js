const { getApiData } = require("./getData");

const fetchDataDragos = async () => {
  try {
    const data = await getApiData("dragos");
    const upElem = data.data.filter((elem) => elem.status.toLowerCase().includes("up"));
    const downElem = data.data.filter((elem) => elem.status.toLowerCase().includes("down"));

    const dragos = `
    <div style="margin-top: 20px; font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="text-align: center; color: #111; font-size: 24px; margin: 0;">Dragos</h2>
      <div style="text-align: center; overflow-x: auto; margin-top: 20px;">
        <table style="width: 100%; max-width: 600px; display: inline-table; border-collapse: collapse; font-size: 10px; color: #333; table-layout: fixed; style="text-align: center;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="width: 30%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: rgb(3, 186, 31); color: white; font-weight: bold">Up</th>
              <th style="width: 30%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: red; color: white; font-weight: bold">Down</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${upElem.length}</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${downElem.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    `;

    return dragos;
  } catch (error) {
    console.error("Error fetching Dragos data:", error);
    throw new Error("Failed to fetch device data");
  }
};

module.exports = {
  fetchDataDragos,
};
