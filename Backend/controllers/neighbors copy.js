const { Neighbors } = require("../models/neighbors");
const { DataNeighbors } = require("../models/data_neighbors");

async function getNeighbors() {
  const totalNeighbors = await DataNeighbors.findAll();
  const switchCoreAdmin = [];
  const switchCoreConce = [];

  totalNeighbors.forEach((element) => {
    if (element.ip_switch === "10.224.127.1") {
      switchCoreAdmin.push(element);
    }
    if (element.ip_switch === "10.224.127.2") {
      switchCoreConce.push(element);
    }
  });

  const neighbors = await Neighbors.findAll();
  const currentSwitchCoreAdmin = [];
  const currentSwitchCoreConce = [];

  neighbors.forEach((element) => {
    if (element.ip_switch === "10.224.127.1") {
      currentSwitchCoreAdmin.push(element);
    }
    if (element.ip_switch === "10.224.127.2") {
      currentSwitchCoreConce.push(element);
    }
  });

  switchCoreAdmin.forEach((item) => {
    const foundItem = currentSwitchCoreAdmin.find(
      (currentItem) => currentItem.ip_neighbor === item.ip_neighbor
    );
    if (foundItem) {
      item.dataValues.status = "Up";
    } else {
      item.dataValues.status = "Down";
    }
  });

  switchCoreConce.forEach((item) => {
    const foundItem = currentSwitchCoreConce.find(
      (currentItem) => currentItem.ip_neighbor === item.ip_neighbor
    );
    if (foundItem) {
      item.dataValues.status = "Up";
    } else {
      item.dataValues.status = "Down";
    }
  });

  const data = {
    switchCoreAdmin: switchCoreAdmin,
    switchCoreConce: switchCoreConce,
  };

  return data;
}

module.exports = { getNeighbors };
