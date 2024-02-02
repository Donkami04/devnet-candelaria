import { useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { DevicesDash } from "./DevicesDash/DevicesDash";
import { getDevices } from "../../utils/Api-candelaria/api";
import {
  PRTG_URL,
  CISCO_URL_IT,
  CISCO_URL,
} from "../../utils/Api-candelaria/api";
import { Spinner } from "../Spinner/Spinner";
import "./devices.css";

export function Devices() {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDownPaused, setFilterDownPaused] = useState(true);
  const [loading, setLoading] = useState(true);

  // Probar Spinner
  // useEffect(() => {
  //   const fakeLoading = setTimeout(() => {
  //     setLoading(false);
  //   }, 21000);
  //   return () => {
  //     clearTimeout(fakeLoading);
  //   };
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const devicesList = await getDevices();
        setDevices(devicesList);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el listado de Devices:", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (e) => {
    setFilterDownPaused(e.target.checked);
  };

  const filteredDevices = devices.filter((device) => {
    const searchValues = Object.values(device)
      .map((value) => value.toString().toLowerCase())
      .join(" ");
    const hasDownPaused = searchValues.includes("down");
    return !filterDownPaused || (filterDownPaused && hasDownPaused);
  });

  const filteredSearchDevices = filteredDevices.filter((device) =>
    Object.values(device)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <Navbar title={"Dispositivos"} />
        <Spinner />
      </div>
    );
  }

  const renderTableBody = () => {
    if (filteredSearchDevices.length === 0) {
      return (
        <tr>
          <td className="no-match" colSpan="14" style={{ fontSize: "13px" }}>
            No hay elementos
          </td>
        </tr>
      );
    }

    return filteredSearchDevices.map((device) => (
      <tr key={device.id}>
        <td>{device.host}</td>
        <td>{device.type}</td>
        <td>{device.site}</td>
        <td>{device.dpto}</td>
        <td>{device.prtg_name_device}</td>
        <td>{device.prtg_sensorname}</td>
        <td>
          <a href={`${PRTG_URL}${device.prtg_id}`} target="_blank">
            {device.prtg_status}
          </a>
        </td>
        <td>{device.prtg_lastup}</td>
        <td>{device.prtg_lastdown}</td>
        <td>
          {device.data_backup === "true"
            ? `⚠️ ${device.cisco_device_ip}`
            : device.cisco_device_ip}
        </td>
        <td
          className={
            device.cisco_status_device.includes("Up")
              ? "kpi-green"
              : device.cisco_status_device.includes("Down")
              ? "kpi-red"
              : device.cisco_status_device.includes("Paused")
              ? "kpi-blue"
              : ""
          }
        >
          {device.data_backup === "true"
            ? `⚠️ ${device.cisco_device_name}`
            : device.cisco_device_name}
        </td>
        <td>
          <a
            href={`${device.red === "OT" ? CISCO_URL : CISCO_URL_IT}${
              device.host
            }&forceLoad=true`}
            target="_blank"
          >
            {device.data_backup === "true"
              ? `⚠️ ${device.cisco_port}`
              : device.cisco_port}
          </a>
        </td>
        <td>
          {device.data_backup === "true"
            ? `⚠️ ${device.cisco_status}`
            : device.cisco_status}
        </td>
        <td>
          {device.data_backup === "true"
            ? `⚠️ ${device.cisco_reachability}`
            : device.cisco_reachability}
        </td>
      </tr>
    ));
  };

  const renderRowCount = () => {
    const rowCount = filteredSearchDevices.length;
    return (
      <div className="row-count" style={{ fontSize: "0.8rem" }}>
        Total de elementos: {rowCount}
      </div>
    );
  };

  return (
    <>
      <Navbar title={"Dispositivos"} />
      <Status_System tableToShow={"devices"} />
      <DevicesDash />
      <input
        className="filtro filtro-devices"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar..."
      />

      <label>
        <input
          className="checkbox-filter"
          type="checkbox"
          checked={filterDownPaused}
          onChange={handleCheckboxChange}
        />
        Down
      </label>

      <div className="devices-container">
        <table>
          <thead>
            <tr>
              <th>HOST</th>
              <th>TYPE</th>
              <th>SITE</th>
              <th>DPTO</th>
              <th>PRTG DEVICE</th>
              <th>PRTG SENSOR</th>
              <th>PRTG STATUS</th>
              <th>PRTG LASTUP</th>
              <th>PRTG LASTDOWN</th>
              <th>CISCO IP</th>
              <th>CISCO SW NAME</th>
              <th>CISCO PUERTO</th>
              <th>CISCO ESTADO</th>
              <th>CISCO REACHABILITY</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
        {renderRowCount()}
      </div>
    </>
  );
}
