import { useEffect, useState } from "react";
import {
  getInterfaces,
  getSystemHealth,
  getNeighbors,
  getDefaultRoute,
  getDataInfGen,
} from "../../../utils/Api-candelaria/api";
import { Navbar } from "../../Navbar/Navbar";
import { useDataInfGen } from "../../../hooks/useDataInfGen";
import "./MainTopology.css";

export function MainTopology() {
  const [devicesInterfaces, setDevicesInterfaces] = useState([]);
  const [devicesHealth, setDevicesHealth] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [routeStatus, setRouteStatus] = useState([]);
  const [infraGeneral, setInfraGeneral] = useState([]);
  const [statusInfGen, setStatusInfGen] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataInterfaces = await getInterfaces();
        const dataDevicesHealth = await getSystemHealth();
        const dataNeighbors = await getNeighbors();
        const dataRouteStatus = await getDefaultRoute();
        const dataInfraGeneral = await getDataInfGen();
        const dataStatusInfGen = await useDataInfGen();

        setStatusInfGen(dataStatusInfGen);
        setDevicesHealth(dataDevicesHealth);
        setRouteStatus(dataRouteStatus);
        setDevicesInterfaces(dataInterfaces);
        setNeighbors(dataNeighbors);

        // Agregar el estado a cada SW de Inf General
        function sameNameSwitch(sw) {
          const match = dataStatusInfGen.totalDownElements.some(e => e.name_switch === sw.name_switch);
          if (match) {
            sw.swStatus = "FAIL";
          } else {
            sw.swStatus = "OK";
          }
        };

        dataInfraGeneral.forEach(sw => {
          sameNameSwitch(sw)
        });
        setInfraGeneral(dataInfraGeneral)

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar title={"Infra General"} />
      <div>
        <table>
          <thead>
            <tr>
              <th>Rol Equipo</th>
              <th>Nombre</th>
              <th>Ip</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {infraGeneral &&
              infraGeneral.map((e) => (
                <tr key={e.id}>
                  <td>{e.rol}</td>
                  <td>{e.name_switch}</td>
                  <td>{e.ip}</td>
                  <td>{e.swStatus}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
