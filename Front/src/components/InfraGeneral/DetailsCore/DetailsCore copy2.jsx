import { useEffect, useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import {
  getInterfaces,
  getSystemHealth,
  getNeighbors,
  getDefaultRoute,
} from "../../../utils/Api-candelaria/api";
import "./DetailsCore.css";

export const DetailsCore = () => {
  const [devicesInterfaces, setDevicesInterfaces] = useState([]);
  const [devicesHealth, setDevicesHealth] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [routeStatus, setRouteStatus] = useState([]);
  const [filterValue, setFilterValue] = useState(""); // Nuevo estado para el filtro

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dataInterfaces = await getInterfaces();
        dataInterfaces.sort((a, b) => (a.status === "Up" ? 1 : -1));

        let dataDevicesHealth = await getSystemHealth();
        dataDevicesHealth.sort((a, b) => (a.status === "Up" ? 1 : -1));

        let dataNeighbors = await getNeighbors();
        dataNeighbors.sort((a, b) => (a.status === "Up" ? 1 : -1));

        const dataRouteStatus = await getDefaultRoute();

        setDevicesHealth(dataDevicesHealth);
        setRouteStatus(dataRouteStatus);
        setDevicesInterfaces(dataInterfaces);
        setNeighbors(dataNeighbors);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const filterData = (data) => {
    // Filtrar los datos basados en el valor del filtro
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  };

  devicesHealth.forEach((element) => {
    // Primer If es porque los neighbors no tienen `name`
    if (element.name && element.name.includes("System Health")) {
      if (
        element.status === "Up" &&
        element.name.includes("CPU") &&
        parseInt(element.lastvalue) <= 90
      ) {
        element.color = "";
      }
      if (
        (element.name.includes("CPU") && parseInt(element.lastvalue) > 90) ||
        (element.name.includes("CPU") && element.status.includes("Down"))
      ) {
        element.color = "red";
      }
      if (
        element.status === "Up" &&
        element.name.includes("Power Supplies") &&
        element.lastvalue === "Normal"
      ) {
        element.color = "";
      }
      if (
        (element.name.includes("Power Supplies") &&
          element.lastvalue !== "Normal") ||
        (element.name.includes("Power Supplies") &&
          element.status.includes("Down"))
      ) {
        element.color = "red";
      }
      if (
        element.status === "Up" &&
        element.name.includes("Temperatures") &&
        parseInt(element.lastvalue) < 50
      ) {
        element.color = "";
      }
      if (
        (element.name.includes("Temperatures") &&
          parseInt(element.lastvalue) >= 50) ||
        (element.name.includes("Temperatures") &&
          element.status.includes("Down"))
      ) {
        element.color = "red";
      }
    }
  });

  return (
    <div>
      <Navbar title={"Detalles Infra General"} />
      <p>dskasdjask</p>
      <p>dskasdjask</p>
      <p>dskasdjask</p>
      <p>dskasdjask</p>
      <p>dskasdjask</p>
      <input
        type="text"
        placeholder="Filtrar datos"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <main className="table-details-inf-gen-container">
      <p>dskasdjask</p>
      <p>dskasdjask</p>
      <p>dskasdjask</p>
      <p>dskasdjask</p>
      <p>dskasdjask</p>
        <div className="div-details-inf-gen">
          <table className="table-details-inf-gen">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Red</th>
                <th>Switch</th>
              </tr>
            </thead>
            <tbody>
              {filterData(devicesInterfaces).map((interfaceDevice) => (
                <tr key={interfaceDevice.id + interfaceDevice.id_prtg}>
                  <td>{interfaceDevice.name}</td>
                  <td
                    className={
                      interfaceDevice.status !== "Up" ? "kpi-red" : "kpi-green"
                    }
                  >
                    {interfaceDevice.status}
                  </td>
                  <td>{interfaceDevice.red.toUpperCase()}</td>
                  <td>{interfaceDevice.name_switch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="div-details-inf-gen">
          <table className="table-details-inf-gen">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Info</th>
                <th>Switch</th>
              </tr>
            </thead>
            <tbody>
              {filterData(devicesHealth).map((healthDevice) => (
                <tr key={healthDevice.id + healthDevice.id_prtg}>
                  <td>{healthDevice.name}</td>
                  <td
                    className={
                      healthDevice.status !== "Up" ? "kpi-red" : "kpi-green"
                    }
                  >
                    {healthDevice.status}
                  </td>
                  <td className={`kpi-${healthDevice.color}`}>
                    {healthDevice.lastvalue}
                  </td>
                  <td>{healthDevice.name_switch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="div-details-inf-gen">
          <table className="table-details-inf-gen">
            <thead>
              <tr>
                <th>IP</th>
                <th>Estado</th>
                <th>Neighbor</th>
                <th>Interface</th>
                <th>Switch</th>
              </tr>
            </thead>
            <tbody>
              {filterData(neighbors).map((neighbor) => (
                <tr key={neighbor.id + neighbor.ip_neighbor}>
                  <td>{neighbor.ip_neighbor}</td>
                  <td
                    className={
                      neighbor.status !== "Up" ? "kpi-red" : "kpi-green"
                    }
                  >
                    {neighbor.status}
                  </td>
                  <td>{neighbor.neighbor.toUpperCase()}</td>
                  <td>{neighbor.interface}</td>
                  <td>{neighbor.name_switch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
