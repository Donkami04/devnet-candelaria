import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { Status_System } from "../../Status_System/Status_System";
import { Spinner } from "../../Spinner/Spinner";
import { Link } from "react-router-dom";
import "./MainTopology.css";

export function MainTopology() {
  const location = useLocation();

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
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let dataInfraGeneral = await getDataInfGen();
        const dataStatusInfGen = await useDataInfGen();

        setStatusInfGen(dataStatusInfGen);
        setAllDataInfGen([
          ...dataStatusInfGen.upElements,
          ...dataStatusInfGen.downElements,
        ]);

        function sameNameSwitch(sw) {
          const match = dataStatusInfGen.downElements.some(
            (e) => e.name_switch === sw.name_switch
          );
          if (match) {
            sw.swStatus = "FAIL";
          } else {
            sw.swStatus = "OK";
          }
        }

        dataInfraGeneral = dataInfraGeneral.filter(
          (e) => e.name_switch !== "WLC 9800 NEGOCIO"
        );
        dataInfraGeneral.forEach((sw) => {
          sameNameSwitch(sw);
        });

        function sortByFailFirst(a, b) {
          if (a.swStatus === "FAIL" && b.swStatus === "OK") {
            return -1;
          }
          if (a.swStatus === "OK" && b.swStatus === "FAIL") {
            return 1;
          }
          return 0;
        }

        dataInfraGeneral.sort(sortByFailFirst);
        setInfraGeneral(dataInfraGeneral);
        setSearchTerm(getCategoriaQueryParam(location.search));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleRowClick = (index, event) => {
    setDataCoreVisible(selectedRow !== index);
    setSelectedRow(selectedRow === index ? null : index);
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const filteredInfraGeneral = infraGeneral.filter((e) => {
    const valuesToSearch = [e.name_switch, e.swStatus, e.rol, e.ip].map(String);
    return valuesToSearch.some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const noResults = filteredInfraGeneral.length === 0;

  return (
    <div>
      <Navbar title={"Infraestructura General"} />
      <Status_System tableToShow={"ig"} />

      {loading ? (
        <Spinner />
      ) : (
        <div className="table-topology-ig-container">
          <div className="search-container-ig">
            <label htmlFor="">Buscar por palabra clave:</label>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm.toUpperCase()}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="table-names-sw-ig">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Rol Equipo</th>
                <th>Ip</th>
              </tr>
            </thead>
            <tbody>
              {noResults ? (
                <tr>
                  <td colSpan="4">No hay coincidencias</td>
                </tr>
              ) : (
                filteredInfraGeneral.map((e, index) => (
                  <tr key={e.id}>
                    <td className="td-category-ig">
                      <Link
                        style={{ color: "blue" }}
                        to={`/monitoreo/infraestrucura-general/detalles?nombre=${e.name_switch}`}
                      >
                        {e.name_switch}
                      </Link>
                      {/* <td onClick={(event) => handleRowClick(index, event)}> */}
                    </td>
                    <td
                      // onClick={(event) => handleRowClick(index, event)}
                      className={`row-ig-table ${
                        e.swStatus === "FAIL" ? "kpi-red" : "kpi-green"
                      }`}
                    >
                      {e.swStatus}
                    </td>
                    <td>{e.rol}</td>
                    <td>{e.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* {selectedRow !== null && dataCoreVisible && (
        <div
          className="dataCoreContainer"
          style={{ left: position.x, top: position.y }}
        >
          <div className="close-button-datacore">
            <p onClick={() => setDataCoreVisible(false)}>X</p>
          </div>

          <DataCore
            dataList={allDataInfGen}
            swName={infraGeneral[selectedRow].name_switch}
          />
        </div>
      )} */}
    </div>
  );

  function getCategoriaQueryParam(search) {
    const params = new URLSearchParams(search);
    return params.get("categoria") || "";
  }
}
