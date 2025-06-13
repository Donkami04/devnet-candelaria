const { getApiData } = require("./getData");

const fetchDataCanales = async () => {
  try {
    const data = await getApiData("indicators/firewalls");
    const totalAlive = data.numFwCorpAlive + data.numFwCommuniAlive;
    const totalDown = data.numFwCorpDown + data.numFwCommuniDown;

    const canales = `
    <div style="margin-top: 20px; font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="text-align: center; color: #111; font-size: 24px; margin: 0;">Canales Internet</h2>
      <div style="text-align: center; overflow-x: auto; margin-top: 20px;">
        <table style="width: 100%; max-width: 600px; display: inline-table; border-collapse: collapse; font-size: 10px; color: #333; table-layout: fixed; style="text-align: center;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="width: 40%; border: 1px solid #ddd; padding: 3px; text-align: center;">Canal</th>
              <th style="width: 30%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: rgb(3, 186, 31); color: white; font-weight: bold">Up</th>
              <th style="width: 30%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: red; color: white; font-weight: bold">Down</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">Corporativos</td>	
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${data.numFwCorpAlive}</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${data.numFwCorpDown}</td>
            </tr>
            <tr>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">Comunitarios</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${data.numFwCommuniAlive}</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${data.numFwCommuniDown}</td>
            </tr>
            <tr>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">Total</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${totalAlive}</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${totalDown}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    `;

    return canales;
  } catch (error) {
    console.error("Error fetching Canales data:", error);
    throw new Error("Failed to fetch device data");
  }
};

module.exports = {
  fetchDataCanales,
};
