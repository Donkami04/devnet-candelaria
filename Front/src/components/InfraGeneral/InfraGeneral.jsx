import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import {
  getInterfaces,
  getSystemHealth,
  getNeighbors,
  getDefaultRoute,
} from "../../utils/Api-candelaria/api";

import "./infrageneral.css";

export function InfraGeneral() {
  const [devicesHealth, setDevicesHealth] = useState([]);
  const [routeStatus, setRouteStatus] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [devicesInterfaces, setDevicesInterfaces] = useState([]);
  // Dentro de tu componente
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataDevicesHealth = await getSystemHealth();
        const dataRouteStatus = await getDefaultRoute();
        const dataInterfaces = await getInterfaces();
        const dataNeighbors = await getNeighbors();

        setDevicesHealth(dataDevicesHealth);
        setRouteStatus(dataRouteStatus);
        setDevicesInterfaces(dataInterfaces);
        setNeighbors(dataNeighbors);
      } catch (error) {
        setError(
          "Hubo un error al cargar los datos. Por favor, inténtalo de nuevo."
        );
      }
    };

    fetchData();
  }, []);

  const devicesHealthUp = [];
  const devicesHealthDown = [];
  const interfacesUp = [];
  const interfacesDown = [];
  const neighborsUp = [];
  const neighborsDown = [];
  const routeUp = [];
  const routeDown = [];

  devicesInterfaces.forEach((element) => {
    if (element.status === "Up") {
      interfacesUp.push(element)
    } else {
      interfacesDown.push(element)
    }
  })

  
  return (
    <>
      <Navbar title={"Infraestructura General"} />
      <main className="main-infra-gen-container">
        {error && <div className="error-message">{error}</div>}
        <div className="section-infra-general-container">
          <table>
            <thead>
              <tr>
                <th>CORE ADM</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prueba</td>
                <td>Prueba</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
