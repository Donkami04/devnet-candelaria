import React, { useState, useEffect } from "react";
import { Navbar } from "../Navbar/Navbar";
import { getDataMeshProcess } from "../../utils/Api-candelaria/api";
import { DatetimeModules } from "../DatetimeModules/DatetimeModules";
import "./MeshProcess.css";

export function MeshProcess() {
  const [processMesh, setProcessMesh] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDown, setFilterDown] = useState(false); // Estado para controlar el filtro "down"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDataMeshProcess();
        const meshData = await response.data;
        meshData.sort((a, b) => {
          if (a.status === "fail" && b.status !== "fail") {
            return -1; // a debe ir antes que b
          } else if (a.status !== "fail" && b.status === "fail") {
            return 1; // b debe ir antes que a
          } else {
            return 0; // no se cambia el orden
          }
        });
        setProcessMesh(meshData);
      } catch (error) {
        console.error("Error al obtener la data del process mesh", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Lógica para filtrar los dispositivos marcados como "down" si el filtro está activado
  const filteredProcessMesh = processMesh.filter((device) => {
    const includesSearchTerm =
      Object.values(device).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ) || searchTerm === "";

    return (
      includesSearchTerm &&
      (!filterDown || device.prtg_status.toLowerCase().includes("down"))
    );
  });

  const handleFilterDownChange = (event) => {
    setFilterDown(event.target.checked);
  };

  return (
    <div>
      <Navbar title={"Proceso Mesh"} />
      <DatetimeModules module={"mesh_process"} name={"Clientes Mesh"} />
      <div className="filtres-processmesh-container">
        <input
          className="input-mesh-process"
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <label className="label-mesh-process">
          <input
            type="checkbox"
            checked={filterDown}
            onChange={handleFilterDownChange}
            className="checkbox-mesh-process"
          />
          Dispositivos PRTG Down
        </label>
      </div>
      <div className="container-process-mesh-table">
        <table className="process-mesh-table">
          <thead>
            <tr>
              <th>Ubicación</th>
              <th>Dispositivo</th>
              <th>Cliente</th>
              <th>Mac Anterior</th>
              <th>Mac Actual</th>
              <th>Fecha Última Cambio MAC</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcessMesh.map((device) => (
              <tr key={device.id}>
                <td>{device.ubication}</td>
                <td
                  className={
                    device.device === "Cisco AP"
                      ? device.status_num_clients === "fail"
                        ? "kpi-red"
                        : device.status === "fail"
                        ? "kpi-red"
                        : ""
                      : ""
                  }
                  title={
                    device.device === "Cisco AP"
                      ? device.status_num_clients === "fail"
                        ? "Este AP reporta más de 12 clientes"
                        : device.status === "fail"
                        ? "Este AP reporta clientes pertenecientes a otra ubicación"
                        : ""
                      : ""
                  }
                >
                  {device.device}
                </td>
                <td
                  className={
                    device.prtg_status.toLowerCase().includes("up")
                      ? "kpi-green"
                      : device.prtg_status.toLowerCase().includes("down")
                      ? "kpi-red"
                      : device.prtg_status.toLowerCase().includes("paused")
                      ? "kpi-blue"
                      : device.prtg_status.toLowerCase().includes("warning")
                      ? "kpi-yelllow"
                      : device.prtg_status.toLowerCase().includes("unusual")
                      ? "kpi-orange"
                      : ""
                  }
                  title={
                    device.prtg_status.includes("operando")
                      ? "Pala no operativa"
                      : `PRTG: ${device.prtg_status}`
                  }
                  style={{ cursor: "help" }}
                >
                  {device.client}
                </td>
                <td>{device.last_mac}</td>
                <td
                  className={
                    device.status === "fail" && device.device !== "Cisco AP"
                      ? "kpi-red"
                      : ""
                  }
                  style={device.status === "fail" ? { cursor: "help" } : {}}
                  title={
                    device.status === "fail" && device.device !== "Cisco AP"
                      ? "El valor de esta MAC pertenece a otra Ubicación"
                      : ""
                  }
                >
                  {device.current_mac}
                </td>
                <td>{device.last_change_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
