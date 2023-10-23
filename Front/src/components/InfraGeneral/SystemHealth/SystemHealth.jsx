import { useEffect, useState } from "react";
import { getSystemHealth } from "../../../utils/Api-candelaria/api";
import { PRTG_URL } from "../../../utils/Api-candelaria/api";
// import "./devices.css";

export function SystemHealth() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataDevices = await getSystemHealth();
        setDevices(dataDevices);

      } catch (error) {
        const errorDataDevices = [
          {
            id: 0,
            name: "ERROR",
            status: "ERROR",
            lastvalue: "ERROR",
            id_prtg: "ERROR",
            ip_switch: "ERROR",
            name_switch: "SW-CORE-ADMIN",
          },
        ];
        setDevices(errorDataDevices);
        console.error("Error al obtener el listado de SYSTEM HEALTH:", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const renderTableBody = () => {
    return devices.map((device) => (
      <tr key={device.id + device.id_prtg}>
        <td>{device.name}</td>
        <td>{device.lastvalue}</td>
        <td>
          <a href={`${PRTG_URL}${device.id_prtg}`} target="_blank">
            {device.status}
          </a>
        </td>

        <td>{device.name_switch}</td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="title-infra-general-section">
        <h2>SYSTEM HEALTH</h2>
      </div>
      <div>
        <table className="table-infra-general-section">
          <thead>
            <tr>
              <th>DISPOSITIVO</th>
              <th>STATUS</th>
              <th>INFO</th>
              <th>SWITCH</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </div>
  );
}
