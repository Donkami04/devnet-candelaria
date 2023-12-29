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
import { DataCore } from "../DataCore/DataCore";
import "./MainTopology.css";

export function MainTopology() {
  const [devicesInterfaces, setDevicesInterfaces] = useState([]);
  const [devicesHealth, setDevicesHealth] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [routeStatus, setRouteStatus] = useState([]);
  const [infraGeneral, setInfraGeneral] = useState([]);
  const [statusInfGen, setStatusInfGen] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dataCoreVisible, setDataCoreVisible] = useState(false);
  const [allDataInfGen, setAllDataInfGen] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
          const match = dataStatusInfGen.totalDownElements.some(
            (e) => e.name_switch === sw.name_switch
          );
          if (match) {
            sw.swStatus = "FAIL";
          } else {
            sw.swStatus = "OK";
          }
        }

        dataInfraGeneral.forEach((sw) => {
          sameNameSwitch(sw);
        });
        setInfraGeneral(dataInfraGeneral);

        const allData = [
          ...dataStatusInfGen.totalDownElements,
          ...dataStatusInfGen.totalUpElements,
        ];
        setAllDataInfGen(allData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (index, event) => {
    // Si haces clic en la misma fila, oculta el componente
    setSelectedRow(selectedRow === index ? null : index);
    setPosition({ x: event.clientX, y: event.clientY });
    setDataCoreVisible(true); // Puedes personalizar la lógica según tus necesidades
  };

  return (
    <div>
      <Navbar title={"Infra General"} />
      <div className="table-topology-ig-container">
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
              infraGeneral.map((e, index) => (
                <tr
                  key={e.id}
                  onClick={(event) => handleRowClick(index, event)}
                >
                  <td>{e.rol}</td>
                  <td>{e.name_switch}</td>
                  <td>{e.ip}</td>
                  <td>{e.swStatus}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedRow !== null && (
        <div
          className="dataCoreContainer"
          style={{ left: position.x, top: position.y }}
        >
          <p className="close-button-datacore">
            X
          </p>
          <DataCore
            dataList={allDataInfGen}
            swName={infraGeneral[selectedRow].name_switch}
          />
        </div>
      )}
    </div>
  );
}
