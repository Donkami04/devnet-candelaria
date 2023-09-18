import { useState, useEffect } from "react";
import { getFirewallsIndicators } from "../../../utils/Api-candelaria/api";
import "./dashfirewalls.css";

export function DashFirewalls() {
  const [fwIndicators, setFwIndicators] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFirewalls = await getFirewallsIndicators();
        setFwIndicators(dataFirewalls);
      } catch (error) {
        console.error("Error al obtener el listado de firewalls:", error);
      }
    };
  
    fetchData();
  }, []);

  const numCorpoAlive = fwIndicators ? fwIndicators.numFwCorpAlive : 0;
  const numCommuniAlive = fwIndicators ? fwIndicators.numFwCommuniAlive : 0;
  const numCorpoDown = fwIndicators ? fwIndicators.numFwCorpDown : 0;
  const numCommuniDown = fwIndicators ? fwIndicators.numFwCommuniDown : 0;


  const currentTab = document.title;
  const tableClassName =
    currentTab === "Home" ? "fw-dash-table-home" : "fw-dash-table";

  return (
    <>
      <table className={tableClassName}>
        <thead>
          <tr>
            <th>CANAL</th>
            <th className="kpi-green">ALIVE</th>
            <th className="kpi-red">DOWN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Corporativos</td>
            <td>{numCorpoAlive}</td>
            <td>{numCorpoDown}</td>
          </tr>
          <tr>
            <td>Comunitarios</td>
            <td>{numCommuniAlive}</td>
            <td>{numCommuniDown}</td>
          </tr>
          <tr>
            <td>TOTAL</td>
            <td>{numCorpoAlive + numCommuniAlive }</td>
            <td>{numCorpoDown + numCommuniDown}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
