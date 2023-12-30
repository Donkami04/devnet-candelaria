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

        function sortByFailFirst(a, b) {
          if (a.swStatus === "FAIL" && b.swStatus === "OK") {
            return -1; // "FAIL" viene primero
          }
          if (a.swStatus === "OK" && b.swStatus === "FAIL") {
            return 1; // "FAIL" viene después de "OK"
          }
          return 0; // Sin cambios en la posición
        }
        
        dataInfraGeneral.sort(sortByFailFirst);

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
    setDataCoreVisible(selectedRow !== index);
    setSelectedRow(selectedRow === index ? null : index);
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div>
      <Navbar title={"Infraestructura General"} />
      <div className="table-topology-ig-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Rol Equipo</th>
              <th>Ip</th>
            </tr>
          </thead>
          <tbody>
            {infraGeneral &&
              infraGeneral.map((e, index) => (
                <tr
                  key={e.id}
                  onClick={(event) => handleRowClick(index, event)}
                  className="row-ig-table"
                >
                  <td>{e.rol}</td>
                  <td className={e.swStatus === "FAIL" ? "kpi-red" : "kpi-green"}>{e.swStatus}</td>
                  <td>{e.name_switch}</td>
                  <td>{e.ip}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedRow !== null && dataCoreVisible && (
        <div
          className="dataCoreContainer"
          style={{ left: position.x, top: position.y }}
        >
          <div className="close-button-datacore">
            <p
              
              onClick={() => setDataCoreVisible(false)}
            >
              X
            </p>
          </div>

          <DataCore
            dataList={allDataInfGen}
            swName={infraGeneral[selectedRow].name_switch}
          />
        </div>
      )}
    </div>
  );
}
