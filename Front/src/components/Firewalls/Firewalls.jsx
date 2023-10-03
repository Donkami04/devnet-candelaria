import { getFirewalls } from "../../utils/Api-candelaria/api";
import { useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { DashFirewalls } from "./DashFirewalls/DashFirewalls";
import "./firewalls.css";

export function Firewalls() {
  const [firewalls, setFirewalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDownPaused, setFilterDownPaused] = useState(true);
  const [fwCommunity, setFwCommunity] = useState([]);
  const [fwCorporate, setFwCorporate] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firewallsList = await getFirewalls();
        setFirewalls(firewallsList);

        // Filtrar los arreglos después de obtener los datos
        const corporateFirewalls = firewallsList.filter(
          (fw) => fw.ubication === "corporate"
        );
        const communityFirewalls = firewallsList.filter(
          (fw) => fw.ubication === "community"
        );
        setFwCorporate(corporateFirewalls);
        setFwCommunity(communityFirewalls);
      } catch (error) {
        console.error("Error al obtener el listado de firewalls:", error);
        return error;
      }
    };
    fetchData();
  }, []);

  // Función para renderizar el cuerpo de la tabla
  const renderTableBody = (firewallsArray) => {
    if (firewallsArray.length === 0) {
      return (
        <tr>
          <td className="no-match" colSpan="14" style={{ fontSize: "13px" }}>
            No hay elementos
          </td>
        </tr>
      );
    }

    return firewallsArray.map((fw) => (
      <tr key={fw.id}>
        <td>{fw.fw}</td>
        <td>{fw.canal}</td>
        <td>{fw.link}</td>
        <td>{fw.state}</td>
        <td
          className={
            fw.packet_loss === "Not Found"
              ? ""
              : parseFloat(fw.packet_loss) > 5
              ? "kpi-red"
              : parseFloat(fw.packet_loss) >= 2 &&
                parseFloat(fw.packet_loss) <= 5
              ? "kpi-yellow"
              : ""
          }
        >
          {fw.packet_loss === "Not Found" ? "Not Found" : fw.packet_loss + "%"}
        </td>
        <td
          className={
            fw.latency === "Not Found"
              ? ""
              : parseFloat(fw.latency) > 100
              ? "kpi-red"
              : parseFloat(fw.latency) >= 50 && parseFloat(fw.latency) <= 100
              ? "kpi-yellow"
              : ""
          }
        >
          {fw.latency === "Not Found" ? "Not Found" : fw.latency + " ms"}
        </td>
        <td
          className={
            fw.jitter === "Not Found"
              ? ""
              : parseFloat(fw.jitter) > 30
              ? "kpi-red"
              : parseFloat(fw.jitter) >= 10 && parseFloat(fw.jitter) <= 30
              ? "kpi-yellow"
              : ""
          }
        >
          {fw.jitter === "Not Found" ? "Not Found" : fw.jitter + " ms"}
        </td>
        <td
          className={
            fw.status_gateway.includes("Up")
              ? "kpi-green"
              : fw.gateway.includes("Paused")
              ? "kpi-yellow"
              : fw.gateway.includes("Down")
              ? "kpi-red"
              : ""
          }
        >
          {fw.gateway}
        </td>

        <td>{fw.failed_before}</td>
      </tr>
    ));
  };

  // Función para renderizar el contador de líneas
  const renderRowCount = (firewallsArray) => {
    const rowCount = firewallsArray.length;
    return (
      <div className="row-count" style={{ fontSize: "0.8rem" }}>
        Total de elementos: {rowCount}
      </div>
    );
  };

  return (
    <>
      <Navbar title={"Firewalls - Canales Internet"} />
      <Status_System tableToShow={"fw"} />
      <DashFirewalls />
      <div className="firewalls-container">
        <h2>FW - Canales Corporativos</h2>
        <table>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>CANAL</th>
              <th>DATOS ENLACE</th>
              <th>ESTADO</th>
              <th>PERDIDAS</th>
              <th>LATENCIA</th>
              <th>JITTER</th>
              <th>GATEWAY</th>
              <th>FALLO 24Hrs</th>
            </tr>
          </thead>
          <tbody>{renderTableBody(fwCorporate)}</tbody>
        </table>
        {renderRowCount(fwCorporate)}
      </div>

      <div className="firewalls-container">
        <h2>FW - Canales Comunitarios / Villa</h2>
        <table>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>CANAL</th>
              <th>DATOS ENLACE</th>
              <th>ESTADO</th>
              <th>PERDIDAS</th>
              <th>LATENCIA</th>
              <th>JITTER</th>
              <th>GATEWAY</th>
              <th>FALLO 24Hrs</th>
            </tr>
          </thead>
          <tbody>{renderTableBody(fwCommunity)}</tbody>
        </table>
        {renderRowCount(fwCommunity)}
      </div>
    </>
  );
}
