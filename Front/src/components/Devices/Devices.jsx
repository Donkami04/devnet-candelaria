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
import { MdOnlinePrediction } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { FaQuestion } from "react-icons/fa";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { StatusColor } from "../StatusColor/StatusColor";
import { MdOutlineInfo } from "react-icons/md";
import { useDeviceIcons } from "../../hooks/useDeviceIcons";

import "./devices.css";

export function Devices() {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDownPaused, setFilterDownPaused] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showColorMeans, setShowColorMeans] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [filterNotFound, setFilterNotFound] = useState(false);

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

  // Utilizado para filtrar por el atributo status_cisco_device === "Not Found"
  const handleNotFoundChange = (e) => {
    setFilterNotFound(e.target.checked);
  };

  const filteredDevices = devices.filter((device) => {
    const searchValues = Object.values(device)
      .map((value) => value.toString().toLowerCase())
      .join(" ");
    const hasDownPaused = searchValues.includes("down");
    return !filterDownPaused || (filterDownPaused && hasDownPaused);
  });

  const filteredSearchDevices = filteredDevices.filter(
    (device) =>
      Object.values(device)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (!filterNotFound ||
        (device.cisco_status_device === "Not Found" &&
          device.cisco_device_ip !== "Not Found"))
  );

  const colorTitle = (status) => {
    if (status.includes("Up")) {
      return "IP Cisco en PRTG: Up";
    }
    if (status.includes("Down")) {
      return "IP Cisco en PRTG: Down";
    }
    if (status.includes("Paused")) {
      return "IP Cisco en PRTG: Pausado";
    }
    if (status.includes("Not Found")) {
      return "IP Cisco en PRTG: Not Found";
    }
  };

  const toggleContent = () => {
    setExpanded(!expanded);
  };

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
        <td style={{ width: "1%" }}>
          {device.data_backup === "true" ? (
            <p
              className="warning-icon"
              title={
                "Data Not Found, información extraida de registros antiguos."
              }
            >
              ⚠️ {device.cisco_device_ip}
            </p>
          ) : (
            <p>{device.cisco_device_ip}</p>
          )}
        </td>
        <td
          className={`${
            device.cisco_status_device.includes("Up")
              ? "kpi-green"
              : device.cisco_status_device.includes("Down")
              ? "kpi-red"
              : device.cisco_status_device.includes("Paused")
              ? "kpi-blue"
              : device.cisco_status_device.includes("Not Found") &&
                device.cisco_device_ip !== "Not Found"
              ? "kpi-grey"
              : ""
          } td-name-cisco`}
        >
          {device.data_backup === "true" ? (
            <div>
              <p
                className="warning-icon"
                title="Data Not Found, información extraida de registros antiguos."
              >
                ⚠️
              </p>{" "}
              <p
                style={{ cursor: "help" }}
                title={colorTitle(device.cisco_status_device)}
              >
                {device.cisco_device_name}
              </p>
            </div>
          ) : (
            <div
              style={{ cursor: "help" }}
              title={colorTitle(device.cisco_status_device)}
            >
              {device.cisco_device_name}
            </div>
          )}
        </td>
        <td>
          <a
            href={`${device.red === "OT" ? CISCO_URL : CISCO_URL_IT}${
              device.host
            }&forceLoad=true`}
            target="_blank"
          >
            {device.data_backup === "true" ? (
              <p
                className="warning-icon"
                title="Data Not Found, información extraida de registros antiguos."
              >
                ⚠️ {device.cisco_port}
              </p>
            ) : (
              device.cisco_port
            )}
          </a>
        </td>
        <td>
          {device.data_backup === "true" ? (
            <p
              className="warning-icon"
              title="Data Not Found, información extraida de registros antiguos."
            >
              ⚠️ {device.cisco_status}
            </p>
          ) : (
            device.cisco_status
          )}
        </td>
        <td>{useDeviceIcons(device)}</td>
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

      <label style={{ marginRight: "10px" }}>
        <input
          className="checkbox-filter"
          type="checkbox"
          checked={filterDownPaused}
          onChange={handleCheckboxChange}
        />
        Down
      </label>
      <label>
        <input
          className="checkbox-filter"
          type="checkbox"
          checked={filterNotFound}
          onChange={handleNotFoundChange}
        />
        PRTG Estado Cisco IP: Not Found
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
              <th title="Iconos de Información">
                <MdOutlineInfo size={"1.1rem"} style={{ cursor: "help" }} />
              </th>
            </tr>
          </thead>
          <tbody className="data-table-devices">{renderTableBody()}</tbody>
        </table>
        {renderRowCount()}
      </div>
    </>
  );
}
