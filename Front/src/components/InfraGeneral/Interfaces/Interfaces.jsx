import { useEffect, useState } from "react";
import { getInterfaces } from "../../../utils/Api-candelaria/api";
import { PRTG_URL } from "../../../utils/Api-candelaria/api";
import "./interfaces.css";

export function Interfaces() {
  const [interfaces, setInterfaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataInterfaces = await getInterfaces();
        setInterfaces(dataInterfaces);
      } catch (error) {
        const errorDataInterfaces = [
          {
            id: "Error",
            name: "Error",
            status: "Error",
            id_prtg: "Error",
            ip_switch: "Error",
          },
        ];
        setInterfaces(errorDataInterfaces);
        console.error("Error al obtener el listado de INTERFACES:", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const renderTableBody = () => {
    return interfaces.map((interfaz) => (
      <tr key={interfaz.id + interfaz.id_prtg}>
        <td>{interfaz.name}</td>
        <td>
          <a href={`${PRTG_URL}${interfaz.id_prtg}`} target="_blank">
            {interfaz.status}
          </a>
        </td>
        <td>{interfaz.name_switch}</td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="title-infra-general-section">
        <h2>INTERFACES</h2>
      </div>
      <div>
        <table className="table-infra-general-section">
          <thead>
            <tr>
              <th>INTERFAZ</th>
              <th>STATUS</th>
              <th>SWITCH</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </div>
  );
}
