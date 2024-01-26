import { useEffect, useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import {
  getInterfaces,
  getSystemHealth,
  getNeighbors,
  getDefaultRoute,
  getAp,
} from "../../../utils/Api-candelaria/api";
import { Status_System } from "../../Status_System/Status_System";
import { useLocation } from "react-router-dom";
import { Spinner } from "../../Spinner/Spinner";
import "./DetailsCore.css";

export const DetailsCore = () => {
  const [devicesInterfaces, setDevicesInterfaces] = useState([]);
  const [devicesHealth, setDevicesHealth] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [routeStatus, setRouteStatus] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [apList, setApList] = useState([]);
  const [numApPrtg, setNumApPrtg] = useState("Cargando...");
  const [numApDb, setNumApDb] = useState("Cargando...");
  const [showOthers, setShowOthers] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dataInterfaces = await getInterfaces();
        dataInterfaces.sort((a, b) => (a.status === "Up" ? 1 : -1));
        dataInterfaces.sort((a, b) => (a.status === "Up" ? 1 : -1));

        let dataDevicesHealth = await getSystemHealth();
        dataDevicesHealth.sort((a, b) => (a.status === "Up" ? 1 : -1));
        dataDevicesHealth.sort((a, b) => (a.status === "Up" ? 1 : -1));

        let dataNeighbors = await getNeighbors();
        dataNeighbors.sort((a, b) => (a.status === "Up" ? 1 : -1));
        dataNeighbors.sort((a, b) => (a.status === "Up" ? 1 : -1));

        const dataRouteStatus = await getDefaultRoute();
        const dataAp = await getAp();

        setDevicesHealth(dataDevicesHealth);
        setRouteStatus(dataRouteStatus);
        setDevicesInterfaces(dataInterfaces);
        setNeighbors(dataNeighbors);
        setApList(dataAp.apList);
        setNumApPrtg(dataAp.numberApRegisteredPrtg);
        setNumApDb(dataAp.numberApRegisteredDb);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Obtener el parámetro "nombre" del URL
    const urlParams = new URLSearchParams(window.location.search);
    const nombreParam = urlParams.get("nombre");

    // Aplicar el valor al estado del filtro
    if (nombreParam) {
      setFilterValue(nombreParam);
    }
  }, []);

  const filterData = (data) => {
    // Filtrar los datos basados en el valor del filtro
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  };

  devicesHealth.forEach((element) => {
    // Primer If es porque los neighbors no tienen `name`
    if (element.name && element.name.includes("System Health")) {
      // if (element.status.includes("Paused") || element.status.includes("Unusual")) {
      //   element.color = "blue";
      // }
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
        element.name.includes("Power Supplies") &&
        element.lastvalue.includes("Down")
      ) {
        element.color = "red";
      }
      if (
        element.name.includes("Power Supplies") &&
        element.lastvalue.includes("Warning")
      ) {
        element.color = "yellow";
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
      if (
        (element.name.includes("Memory") &&
          element.name_switch === "WLC 9800 NEGOCIO" &&
          parseInt(element.lastvalue.replace(".", "")) <= 1000) ||
        (element.name.includes("Memory") &&
          element.name_switch === "WLC 9800 NEGOCIO" &&
          element.status.includes("Down"))
      ) {
        element.color = "red";
      }
    }
  });

  if (loading) {
    // Si la información está cargando, renderizar el Spinner
    return (
      <div>
        <Navbar title={"Detalles Inf. Gen."} />
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar title={"Detalles Inf. Gen."} />
      <Status_System tableToShow={"ig"} />
      
      <div className="search-container-details-ig">
        <label htmlFor="search">Buscar por palabre clave</label>
        <input
          id="search"
          type="text"
          placeholder="Filtrar datos"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>
      {showOthers && (
        <div>
          <div>
            <p>{`Numero de AP registrados en PRTG: ${numApPrtg}`}</p>
            <p>{`Numero de AP registrados en DevNet: ${numApDb}`}</p>
          </div>
          <div className="table-ap-container">
            <table className="table-ap">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Modelo</th>
                  <th>Estado</th>
                  <th>Ubicación</th>
                  <th>IP</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apList.map((ap) => (
                  <tr key={ap.id}>
                    <td>{ap.name}</td>
                    <td>{ap.model}</td>
                    <td>{ap.state}</td>
                    <td>{ap.location}</td>
                    <td>{ap.ip}</td>
                    <td>{ap.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table-ap table-route">
              <thead>
                <tr>
                  <th>Switch</th>
                  <th>Via BGP</th>
                </tr>
              </thead>
              <tbody>
                {routeStatus.map((route) => (
                  <tr key={route.id}>
                    <td>{route.via_bgp === "true" ? "Up" : "Down"}</td>
                    <td>{route.name_switch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <main className="table-details-inf-gen-container">
        <div className="div-details-inf-gen">
          <h3>Interfaces</h3>
          <table className="table-details-inf-gen">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Switch</th>
              </tr>
            </thead>
            <tbody>
              {filterData(devicesInterfaces).map((interfaceDevice) => (
                <tr key={interfaceDevice.id + interfaceDevice.id_prtg}>
                  <td>{interfaceDevice.name}</td>
                  <td
                    className={
                      interfaceDevice.status === "Up"
                        ? "kpi-green"
                        : interfaceDevice.status.includes("Down")
                        ? "kpi-red"
                        : interfaceDevice.status.includes("Warning")
                        ? "kpi-yellow"
                        : "kpi-blue"
                    }
                  >
                    {interfaceDevice.status}
                  </td>
                  <td>{interfaceDevice.name_switch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="div-details-inf-gen">
          <h3>System Health</h3>
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
                      healthDevice.status === "Up"
                        ? "kpi-green"
                        : healthDevice.status.includes("Down")
                        ? "kpi-red"
                        : healthDevice.status.includes("Warning")
                        ? "kpi-yellow"
                        : "kpi-blue"
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
          <h3>Neighbors</h3>
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
