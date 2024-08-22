const { GroupPrtg } = require("../models/group_prtg");

async function getPrtgGroupData() {
  const data = await GroupPrtg.findAll();
  getPrtgGroupUpDown()
  return data;
}

async function getPrtgGroupUpDown() {
  const data = await GroupPrtg.findAll();
  const dataUpDown = countStatus(data);
  return dataUpDown;
}

function countStatus(data) {
  const result = data.reduce((acc, curr) => {
      // Si el grupo es "certificados candelaria", omitir el dispositivo
      if (curr.group && curr.group.toLowerCase() === "certificados candelaria") {
          return acc;
      }

      const existingItem = acc.find(item => item.device === curr.device);
      if (existingItem) {
          if (curr.status === "Up") {
              existingItem.up++;
          } else if (curr.status.toLowerCase().includes("down")) {
              existingItem.down++;
          }
      } else {
          const newItem = {
              device: curr.device,
              group: curr.rol,
              up: curr.status === "Up" ? 1 : 0,
              down: curr.status === "Down" ? 1 : 0
          };
          acc.push(newItem);
      }
      return acc;
  }, []);

  return result;
}

module.exports = { getPrtgGroupData, getPrtgGroupUpDown };
