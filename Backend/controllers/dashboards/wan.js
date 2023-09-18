const { getWan } = require("../wan");

async function dashboardWan() {
  const wan = await getWan();
  const totalWan = wan.length;
  let totalUptimePercentLasthMonth = 0;

  wan.forEach((wan) => {
    totalUptimePercentLasthMonth += wan.last_uptime_percent;
  });

  let kpiWan = (totalUptimePercentLasthMonth / totalWan);
  kpiWan = parseFloat(kpiWan.toFixed(2))
  
  return kpiWan;
};

module.exports = { dashboardWan };