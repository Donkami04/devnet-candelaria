const { getFirewalls } = require("../firewalls");


async function dashboardFirewalls() {
  let numFwCorpAlive = 0;
  let numFwCorpDown = 0;
  let numFwCommuniAlive = 0;
  let numFwCommuniDown = 0;

  const firewalls = await getFirewalls();
  firewalls.forEach((firewall) => {
    if (firewall.state === "alive" && firewall.ubication === "corporate") {
      numFwCorpAlive += 1;
    };
    if (firewall.state.toLowerCase() === "down" && firewall.ubication === "corporate") {
      numFwCorpDown += 1;
    };
    if (firewall.state === "alive" && firewall.ubication === "community") {
      numFwCommuniAlive += 1;
    };
    if (firewall.state.toLowerCase() === "down" && firewall.ubication === "community") {
      numFwCommuniDown += 1;
    };
  });

  data = {
    numFwCorpAlive,
    numFwCorpDown,
    numFwCommuniAlive,
    numFwCommuniDown
  };

  return data;
};

module.exports = {dashboardFirewalls};