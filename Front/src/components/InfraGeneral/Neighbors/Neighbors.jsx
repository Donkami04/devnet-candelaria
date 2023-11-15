import { useEffect, useState } from "react";
import { getNeighbors } from "../../../utils/Api-candelaria/api";

export function Neighbors() {
  const [neighbors, setNeighbors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataNeighbors = await getNeighbors();
        // Combina los datos de ambos atributos en una sola matriz
        const combinedNeighbors = [
          ...dataNeighbors.switchCoreAdmin,
          ...dataNeighbors.switchCoreConce
        ];
        setNeighbors(combinedNeighbors);
      } catch (error) {
        const errorDataNeighbors = [
          {
            id: 0,
            ip_neighbor: "Error",
            neighbor: "Error",
            red: "Error",
            name: "SW-CORE-ADMIN",
            ip_switch: "Error",
            status: "Error",
          },
        ];
        setNeighbors(errorDataNeighbors);
        console.error("Error al obtener el listado de Neighbors:", error);
      }
    };
    fetchData();
  }, []);

  const renderTableBody = () => {
    return neighbors.map((element) => (
      <tr key={element.id + element.ip_neighbor}>
        <td>{element.ip_neighbor}</td>
        <td>{element.neighbor.toUpperCase()}</td>
        <td>{element.status}</td>
        <td>{element.interface}</td>
        <td>{element.name}</td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="title-infra-general-section">
        <h2>NEIGHBORS</h2>
      </div>
      <div>
        <table className="table-infra-general-section">
          <thead>
            <tr>
              <th>IP</th>
              <th>NEIGHBOR</th>
              <th>STATUS</th>
              <th>INTERFACE</th>
              <th>SWITCH</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </div>
  );
}
