const { Firewalls } = require("../models/firewalls");
const { DataFirewalls } = require("../models/data_firewalls");

async function getFirewalls() {
  const numFw = await getNumberFw();
  const firewalls = await Firewalls.findAll({
    order: [["id", "DESC"]],
    limit: numFw,
  });
  firewalls.reverse();
  return firewalls;
}

async function getNumberFw() {
  const listFw = await DataFirewalls.findAll();
  const numFw = listFw.length;
  return numFw;
}

async function getOneFirewall(ip) {
  const firewall = await DataFirewalls.findOne({ where: { ip: ip } });
  if (firewall !== null) {
    return {
      status: 200,
      data: firewall,
    };
  }
  return {
    status: 404,
    message: "El Firewall - Canal de Internet no existe en la base de datos.",
  };
}

async function createFirewall(data) {
  try {
    const newFirewall = await DataFirewalls.create({
      name: data.name,
      channel: data.channel,
      ip: data.ip,
      link: data.link,
      vdom: data.vdom,
      gateway: data.gateway,
      ubication: data.ubication,
    });
    return {
      status: 201,
      message:
        "El Firewall - Canal de Internet ha sido creado exitosamente, espere unos minutos para que el sistema actualice los datos.",
      data: newFirewall,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function editOneFirewall(id, changes) {
  try {
    const firewall = await DataFirewalls.findByPk(id);
    if (firewall !== null) {
      await DataFirewalls.update(
        {
          name: changes.name,
          channel: changes.channel,
          ip: changes.ip,
          link: changes.link,
          vdom: changes.vdom,
          gateway: changes.gateway,
          ubication: changes.ubication,
        },
        { where: { id: id } }
      );
      const firewallUpdated = await DataFirewalls.findByPk(id);
      return {
        status: 200,
        message:
          "El Firewall - Canal de Internet ha sido modificado exitosamente.",
        data: firewallUpdated,
      };
    }
    return {
      status: 404,
      message: "El Firewall - Canal de Internet no existe en la base de datos.",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteFirewall(ip) {
  try {
    const firewall = await DataFirewalls.findOne({ where: { ip: ip } });
    if (firewall !== null) {
      await DataFirewalls.destroy({ where: { id: firewall.id } });
      const checkFirewallIsDeleted = await DataFirewalls.findByPk(firewall.id);
      if (checkFirewallIsDeleted === null) {
        return {
          status: 200,
          message:
            "El Firewalll - Canal de Internet ha sido eliminado exitosamente",
        };
      } else {
        throw error;
      }
    }
    return {
      status: 404,
      message: "El Firewalll - Canal de Internet no existe en la base de datos",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getFirewalls,
  createFirewall,
  editOneFirewall,
  deleteFirewall,
  getOneFirewall,
};
