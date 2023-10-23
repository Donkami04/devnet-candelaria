import { useEffect, useState } from "react";
import { getDefaultRoute } from "../../../utils/Api-candelaria/api";

export function DefaultRoute() {
    const [routeStatus, setRouteStatus] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const dataRouteDefault = await getDefaultRoute();
          setRouteStatus(dataRouteDefault);
        } catch (error) {
          const errorDataDevices = [
            {
              id: 1,
              via_bgp: "Error Devnet ",
              name: "Error Devnet",
              red: "Error Devnet",
              ip_switch: "Error Devnet",
            },
          ];
          setDevices(errorDataDevices);
          console.error("Error al obtener el listado de ROUTE DEFAULT:", error);
          return error;
        }
      };
      fetchData();
    }, []);

    const renderTableBody = () => {
        return routeStatus.map((element) => (
          <tr key={element.id + element.id_prtg}>
            <td>{element.name}</td>
            <td>{element.via_bgp === 'true' ? 'bgp 65001' : 'Unknown'}</td>
          </tr>
        ));
      };
    
      return (
        <div>
          <div className="title-infra-general-section">
            <h2>SYSTEM HEALTH</h2>
          </div>
          <div>
            <table className="table-infra-general-section">
              <thead>
                <tr>
                  <th>SWITCH</th>
                  <th>ROUTE</th>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </table>
          </div>
        </div>
      );
}