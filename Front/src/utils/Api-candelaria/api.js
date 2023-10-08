import axios from "axios";

const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;
let envi;

if (ENVIRONMENT === "local") {
  envi = "localhost";
} else if (ENVIRONMENT === "development") {
  envi = "10.224.116.78";
} else if (ENVIRONMENT === "production") {
  envi = "10.224.116.14";
}


export const BASE_API_URL = `http://${envi}:3001/api/v1/candelaria`;

// Url para redirigir a PRTG y CISCO desde la tabla
export const PRTG_URL = 'https://10.224.241.25/device.htm?id='
export const CISCO_URL = 'https://10.224.241.14/webacs/loginAction.do?action=login&product=wcs&selectedCategory=en#pageId=full_search_pageId&query='
export const CISCO_URL_IT = 'https://10.224.116.90/webacs/loginAction.do?action=login&product=wcs&selectedCategory=en#pageId=full_search_pageId&query='

export const getStatusSystem = async () => {
  return axios
    .get(`${BASE_API_URL}/status`)
    .then((response) => response.data)
    .catch((error) => console.error('STATUS SYSTEM:Error del API REST Candealaria : ',error));
};

export const getIndicators = async () => {
  return axios
    .get(`${BASE_API_URL}/indicators/`)
    .then((response) => response.data)
    .catch((error) => console.error('INDICADORES: Error del API REST Candealaria : ',error));
};

export const getClients = async () => {
  return axios
    .get(`${BASE_API_URL}/clients`)
    .then((response) => response.data)
    .catch((error) => console.error('CLIENTES: Error del API REST Candealaria : ',error));
};

export const getSwitches = async () => {
  return axios
    .get(`${BASE_API_URL}/switches`)
    .then((response) => response.data)
    .catch((error) => console.error('SWITCHES: Error del API REST Candealaria : ',error));
};

export const getUps = async () => {
  return axios
    .get(`${BASE_API_URL}/ups`)
    .then((response) => response.data)
    .catch((error) => console.error('UPS: Error del API REST Candealaria : ',error));
};

export const getVpn = async () => {
  return axios
    .get(`${BASE_API_URL}/vpn`)
    .then((response) => response.data)
    .catch((error) => console.error('VPN: Error del API REST Candealaria : ',error));
};

export const getMesh = async () => {
  return axios
    .get(`${BASE_API_URL}/mesh`)
    .then((response) => response.data)
    .catch((error) => console.error('MESH: Error del API REST Candealaria : ',error));
};

export const getDevices = async () => {
  return axios
    .get(`${BASE_API_URL}/devices`)
    .then((response) => response.data)
    .catch((error) => console.error('DEVICES: Error del API REST Candealaria : ',error));
};

export const getFirewalls = async () => {
  return axios
    .get(`${BASE_API_URL}/firewalls`)
    .then((response) => response.data)
    .catch((error) => console.error('FIREWALLS: Error del API REST Candealaria : ',error));
};

export const getWan = async () => {
  return axios
    .get(`${BASE_API_URL}/wan`)
    .then((response) => response.data)
    .catch((error) => console.error('WAN: Error del API REST Candealaria : ',error));
};

export const getDcsCandelariaIndicators = async () => {
  return axios
    .get(`${BASE_API_URL}/indicators/dcs-candelaria`)
    .then((response) => response.data)
    .catch((error) => console.error('INDICADOR DCS CANDELARIA: Error del API REST Candealaria : ',error));
};

export const getDevicesIndicators = async () => {
  return axios
    .get(`${BASE_API_URL}/indicators/devices`)
    .then((response) => response.data)
    .catch((error) => console.error('INDICADOR DEVICES: Error del API REST Candealaria : ',error));
};

export const getFirewallsIndicators = async () => {
  return axios
    .get(`${BASE_API_URL}/indicators/firewalls`)
    .then((response) => response.data)
    .catch((error) => console.error('INDICADOR FIREWALLS: Error del API REST Candealaria : ',error));
};

export const getWanIndicators = async () => {
  return axios
    .get(`${BASE_API_URL}/indicators/wan`)
    .then((response) => response.data)
    .catch((error) => console.error('INDICADOR WAN: Error del API REST Candealaria : ',error));
};

export const getMeshIndicators = async () => {
  return axios
    .get(`${BASE_API_URL}/indicators/mesh`)
    .then((response) => response.data)
    .catch((error) => console.error('INDICADOR MESH: Error del API REST Candealaria : ',error));
};

export const getUsers = async () => {
  return axios
    .get(`${BASE_API_URL}/users`)
    .then((response) => response.data)
    .catch((error) => console.error('USUAROS: Error del API REST Candealaria : ',error));
};
