import { useEffect, useState } from "react";
import { Navbar } from "../../../components/Navbar/Navbar";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dataInterfaces = await getInterfaces();
        dataInterfaces.sort((a, b) => (a.status === "Up") ? 1 : -1);

        let dataDevicesHealth = await getSystemHealth();
        dataDevicesHealth.sort((a, b) => (a.status === "Up") ? 1 : -1);

        let dataNeighbors = await getNeighbors();
        dataNeighbors.sort((a, b) => (a.status === "Up") ? 1 : -1);

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
  return (
    <div>
      <Navbar title={"Infraestructura General"} />
      <main className="table-details-inf-gen-container">
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
              {devicesInterfaces.map((interfaceDevice) => (
                <tr key={interfaceDevice.id + interfaceDevice.id_prtg}>
                  <td>{interfaceDevice.name}</td>
                  <td>{interfaceDevice.status}</td>
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
              {devicesHealth.map((healthDevice) => (
                <tr key={healthDevice.id + healthDevice.id_prtg}>
                  <td>{healthDevice.name}</td>
                  <td>{healthDevice.status}</td>
                  <td>{healthDevice.lastvalue}</td>
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
                <th>Neighbor</th>
                <th>Interface</th>
                <th>Estado</th>
                <th>Switch</th>
              </tr>
            </thead>
            <tbody>
              {neighbors.map((neighbor) => (
                <tr key={neighbor.id + neighbor.ip_neighbor}>
                  <td>{neighbor.ip_neighbor}</td>
                  <td>{neighbor.neighbor.toUpperCase()}</td>
                  <td>{neighbor.interface}</td>
                  <td>{neighbor.status}</td>
                  <td>{neighbor.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
