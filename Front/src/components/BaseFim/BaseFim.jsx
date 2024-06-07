import { useEffect, useState } from "react";
import { getDataBaseFim } from "../../utils/Api-candelaria/api";
import { DatesReset } from "./DatesReset";
import { Spinner } from "../Spinner/Spinner";
import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import "./BaseFim.css";

export function BaseFim() {
  const [baseFim, setBaseFim] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [listDownSelected, setListDownSelected] = useState([]);
  const [baseName, setBaseName] = useState("");
  const [showDatesReset, setShowDatesReset] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { fimStatus, datesResets } = await getDataBaseFim();
        fimStatus.forEach((e) => {
          e.showDetails = false; // Agregar una propiedad showDetails a cada elemento de baseFim
          e.listDown = datesResets
            .reverse()
            .filter((date) => date.base_name === e.base_name)
            .map((date) => date.date);
          e.counterDown = e.listDown.length;
        });

        setBaseFim(fimStatus);
        setShowSpinner(false);
      } catch (error) {
        console.error("Error al obtener la data de las base FIM:", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const fimData = (fimData) => {
    setListDownSelected(fimData.listDown);
    setBaseName(fimData.base_name);
    setShowDatesReset(true);
  };

  if (showSpinner) {
    return (
      <div>
        <Navbar title={"Estaciones Base FiM"} />
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar title={"Estaciones Base FiM"} />
      <Status_System tableToShow={"fim"} />
      <div className="main-container-basefim">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ip</th>
              <th>Estado</th>
              <th>Contador Reset</th>
            </tr>
          </thead>
          <tbody>
            {baseFim.map((fim) => (
              <tr key={fim.id}>
                <td>{fim.base_name}</td>
                <td>{fim.base_ip}</td>
                <td
                  style={{ cursor: "help" }}
                  title={fim.error.toUpperCase()}
                  className={fim.status === "Down" ? "kpi-red" : "kpi-green"}
                >
                  {fim.status}
                </td>
                <td style={{ cursor: "pointer" }} onClick={() => fimData(fim)}>
                  {fim.counterDown}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDatesReset && (
        <div className="dates-reset-container-fim">
          <DatesReset
            listDownSelected={listDownSelected}
            baseName={baseName}
            setShowDatesReset={setShowDatesReset}
          />
        </div>
      )}
    </div>
  );
}
