const { getApiData } = require("./getData");

const fetchDataUG = async () => {
  try {
    const data = await getApiData("anillo-ug/updown");

    const ug = `
    <div style="margin-top: 20px; font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="text-align: center; color: #111; font-size: 24px; margin: 0;">Redes Mina UG</h2>
      <div style="text-align: center; overflow-x: auto; margin-top: 20px;">
        <table style="width: 100%; max-width: 600px; display: inline-table; border-collapse: collapse; font-size: 10px; color: #333; table-layout: fixed; style="text-align: center;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="width: 33%; border: 1px solid #ddd; padding: 3px; text-align: center;">Sistema</th>
              <th style="width: 33%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: rgb(3, 186, 31); color: white; font-weight: bold">Up</th>
              <th style="width: 33%; border: 1px solid #ddd; padding: 3px; text-align: center; background-color: red; color: white; font-weight: bold">Down</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">Anillo UG	</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${data.data.upElements.length}</td>
              <td style="text-align: center; border: 1px solid #ddd; padding: 4px;">${data.data.downElements.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style=" max-width: 600px; margin: 20px auto; border: none; height: 1px; background-color: #ddd;">
    `;

    return ug;
  } catch (error) {
    console.error("Error fetching Mina UG data:", error);
    throw new Error("Failed to fetch device data");
  }
};

module.exports = {
  fetchDataUG,
};
