import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import {
  getInterfaces,
  getSystemHealth,
  getNeighbors,
  getDefaultRoute,
} from "../../utils/Api-candelaria/api";
import { ItCoreAdm } from "./Cores/ItCoreAdm";
import { ItCoreConce } from "./Cores/ItCoreConce";
import "./infrageneral.css";

export function InfraGeneral() {
  const [devicesInterfaces, setDevicesInterfaces] = useState([]);
  const [devicesHealth, setDevicesHealth] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [routeStatus, setRouteStatus] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataInterfaces = await getInterfaces();
        const dataDevicesHealth = await getSystemHealth();
        const dataRouteStatus = await getDefaultRoute();
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

  return (
    <div>
      <Navbar title={"Infraestructura General"} />
      {error && <div className="error-message">{error}</div>}
      <main className="main-infra-general-container">
        <div className="section-infra-general">
          <ItCoreAdm
            devicesInterfaces={devicesInterfaces}
            devicesHealth={devicesHealth}
            neighbors={neighbors}
            routeStatus={routeStatus}
          />
        </div>
        <div className="section-infra-general">
          <ItCoreConce
            devicesInterfaces={devicesInterfaces}
            devicesHealth={devicesHealth}
            neighbors={neighbors}
            routeStatus={routeStatus}
          />
        </div>
      </main>
    </div>
  );
}
