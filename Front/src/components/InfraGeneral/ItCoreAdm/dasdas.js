const a = [
  {
    id: 702,
    name: "System Health CPU",
    status: "Up",
    lastvalue: "27 %",
    id_prtg: "4314",
    ip_switch: "10.224.127.1",
    name_switch: "ADMIN",
    red: "it",
  },
  {
    id: 703,
    name: "System Health Memory",
    status: "Up",
    lastvalue: "532 MB",
    id_prtg: "4315",
    ip_switch: "10.224.127.1",
    name_switch: "ADMIN",
    red: "it",
  },
  {
    id: 704,
    name: "System Health Fans",
    status: "Up",
    lastvalue: "Normal",
    id_prtg: "4316",
    ip_switch: "10.224.127.1",
    name_switch: "ADMIN",
    red: "it",
  },
  {
    id: 705,
    name: "System Health Power Supplies",
    status: "Up",
    lastvalue: "Normal",
    id_prtg: "4317",
    ip_switch: "10.224.127.1",
    name_switch: "ADMIN",
    red: "it",
  },
  {
    id: 706,
    name: "System Health Temperatures",
    status: "Up",
    lastvalue: "37 °C",
    id_prtg: "4318",
    ip_switch: "10.224.127.1",
    name_switch: "ADMIN",
    red: "it",
  },
  {
    id: 707,
    name: "System Health CPU",
    status: "Up",
    lastvalue: "39 %",
    id_prtg: "4332",
    ip_switch: "10.224.127.2",
    name_switch: "CONCE",
    red: "it",
  },
  {
    id: 708,
    name: "System Health Memory",
    status: "Up",
    lastvalue: "536 MB",
    id_prtg: "4333",
    ip_switch: "10.224.127.2",
    name_switch: "CONCE",
    red: "it",
  },
  {
    id: 709,
    name: "System Health Fans",
    status: "Up",
    lastvalue: "Normal",
    id_prtg: "4334",
    ip_switch: "10.224.127.2",
    name_switch: "CONCE",
    red: "it",
  },
  {
    id: 710,
    name: "System Health Power Supplies",
    status: "Up",
    lastvalue: "Normal",
    id_prtg: "4335",
    ip_switch: "10.224.127.2",
    name_switch: "CONCE",
    red: "it",
  },
  {
    id: 711,
    name: "System Health Temperatures",
    status: "Up",
    lastvalue: "37 °C",
    id_prtg: "4336",
    ip_switch: "10.224.127.2",
    name_switch: "CONCE",
    red: "it",
  },
  {
    id: 712,
    name: "System Health Other",
    status: "Up",
    lastvalue: "1",
    id_prtg: "4337",
    ip_switch: "10.224.127.2",
    name_switch: "CONCE",
    red: "it",
  },
];

const listDevicesHealthFail = [];

a.forEach((element) => {
  if (
    (element.name_switch === "ADMIN" &&
      element.red === "it" &&
      element.name.includes("CPU") &&
      element.status.includes("Down")) ||
    parseInt(element.lastvalue) > 90
  ) {
    listDevicesHealthFail.push(element);
  }
});

console.log(listDevicesHealthFail);
