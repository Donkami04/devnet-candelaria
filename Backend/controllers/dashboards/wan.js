const { getWan } = require("../wan");

// async function dashboardWan() {
//   const wan = await getWan();
//   const totalWan = wan.length;
//   let totalUptimePercentLasthMonth = 0;
//   wan.forEach((wan) => {
//     totalUptimePercentLasthMonth += wan.last_uptime_percent;
//   });

//   let kpiWan = (totalUptimePercentLasthMonth / totalWan);
//   kpiWan = parseFloat(kpiWan.toFixed(2))

//   return kpiWan;
// };

async function dashboardWan() {
  let wan = await getWan();

  wan = wan.map((wanElement) => wanElement.toJSON());

  const adminsWan = [];
  const othersWan = [];

  wan.forEach((wanElement) => {
    if (wanElement.ip.startsWith("10.224.126")) {
      adminsWan.push(wanElement);
    } else {
      othersWan.push(wanElement);
    }
  });

  let othersWanUptimePercentLasthMonth = 0;
  othersWan.forEach(
    (wanElement) =>
      (othersWanUptimePercentLasthMonth += wanElement.last_uptime_percent)
  );
  const totalElementsOthersWan = othersWan.length;
  let otherPercentUptime = othersWanUptimePercentLasthMonth / totalElementsOthersWan;
  otherPercentUptime = parseFloat(otherPercentUptime.toFixed(2));

  const adminPercentUptime = adminWanCalculate(adminsWan);

  const data = {
    kpiAdminWans: adminPercentUptime,
    kpiOtherWans: otherPercentUptime,
  };
  return data;

}

function adminWanCalculate(adminWans) {
  const toNumber = adminWans.map((e) => parseFloat(e.last_uptime_percent));
  const maxValue = Math.max(...toNumber);
  return maxValue;
}

module.exports = { dashboardWan };
