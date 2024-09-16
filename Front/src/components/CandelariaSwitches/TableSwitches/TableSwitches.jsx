import { useEffect, useState } from "react";
import { getSwitches } from "../../../utils/Api-candelaria/api";
import "./TableSwitches.css";

export function TableSwitches() {
  const [switches, setSwitches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDownPaused, setFilterDownPaused] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const switchesList = await getSwitches();
        setSwitches(switchesList);
      } catch (error) {
        console.error("Error al obtener el listado de Clientes: ", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (e) => {
    setFilterDownPaused(e.target.checked);
  };

  const filteredSwitches = switches.filter((switch_) => {
    const searchValues = Object.values(switch_)
      .map((value) => value.toString().toLowerCase())
      .join(" ");
    const hasDownPaused =
      searchValues.includes("down") || searchValues.includes("paused");
    return !filterDownPaused || (filterDownPaused && hasDownPaused);
  });

  const filteredSearchSwitches = filteredSwitches.filter((switch_) =>
    Object.values(switch_)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const renderTableBody = () => {
    if (filteredSearchSwitches.length === 0) {
      return (
        <tr>
          <td className="no-match" colSpan="11" style={{ fontSize: "13px" }}>
            No hay elementos
          </td>
        </tr>
      );
    }

    return filteredSearchSwitches.map((switch_) => (
      <tr key={switch_.id}>
        <td>
          {switch_.dispositivo} {switch_.group}
        </td>
        <td>{switch_.ip}</td>
        <td>{switch_.status_prtg}</td>
        <td>{switch_.reachability}</td>
        <td>{switch_.ups1}</td>
        <td>{switch_.ups2}</td>
        <td>{switch_.status_ups1}</td>
        <td>{switch_.status_ups2}</td>
      </tr>
    ));
  };

  const renderRowCount = () => {
    const rowCount = filteredSearchSwitches.length;
    return (
      <div className="row-count" style={{ fontSize: "0.8rem" }}>
        Total de elementos: {rowCount}
      </div>
    );
  };

  return (
    <div className="table-container-sw ">
      <input
        className="filtro"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar..."
      />

      <label>
        <input
          className="checkbox-filter"
          type="checkbox"
          checked={filterDownPaused}
          onChange={handleCheckboxChange}
        />
        Down / Paused
      </label>

      <table>
        <thead>
          <tr className="table-switches">
            <th>DISPOSITIVO</th>
            <th>IP</th>
            <th>ESTADO (PRTG)</th>
            <th>ESTADO (PRIME)</th>
            <th>UPS 1</th>
            <th>UPS 2</th>
            <th>ESTADO UPS 1</th>
            <th>ESTADO UPS 2</th>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>

      {renderRowCount()}
    </div>
  );
}
