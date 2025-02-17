import { useEffect, useState } from "react";
import { getDataBaseFim } from "../../utils/Api-candelaria/api";
import { DatesReset } from "./DatesReset";
import { Spinner } from "../Spinner/Spinner";
import { Navbar } from "../Navbar/Navbar";
import { DatetimeModules } from "../DatetimeModules/DatetimeModules";
import { FaEye } from "react-icons/fa6";
import { PRTG_URL } from "../../utils/Api-candelaria/api";
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
        const response = await getDataBaseFim();
        const fimStatus = response.data.fimStatus;
        const datesResets = response.data.datesResets;
        fimStatus.forEach((e) => {
          e.showDetails = false; // Agregar una propiedad showDetails a cada elemento de baseFim
          e.listDown = datesResets
            .reverse()
            .filter((elem) => elem.base_name === e.base_name)
            .map((elem) => elem);
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
      <DatetimeModules module={"base_fim"} name={"bases fim"} />
      <div className="main-container-basefim">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ip</th>
              <th>Estado PING</th>
              <th>Estado HTTP</th>
              <th>Num. de Reinicios</th>
              <th>Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {baseFim.map((fim) => (
              <tr key={fim.id}>
                <td>{fim.base_name}</td>
                <td>
                  {" "}
                  <a href={`${PRTG_URL}${fim?.id_prtg || ""}`} target="_blank">
                    {fim.base_ip}
                  </a>{" "}
                </td>
                <td
                  style={{ cursor: "help" }}
                  title={fim.message.toUpperCase()}
                  className={
                    fim.status_ping.includes("Down")
                      ? "kpi-red"
                      : fim.status_ping.includes("Paused")
                      ? "kpi-blue"
                      : fim.status_ping.includes("Unusual")
                      ? "kpi-orange"
                      : fim.status_ping.includes("Up")
                      ? "kpi-green"
                      : "kpi-grey"
                  }
                >
                  {fim.status_ping}
                </td>
                <td
                  style={{ cursor: "help" }}
                  title={fim.message.toUpperCase()}
                  className={
                    fim.status_http.includes("Down")
                      ? "kpi-red"
                      : fim.status_http.includes("Paused")
                      ? "kpi-blue"
                      : fim.status_http.includes("Unusual")
                      ? "kpi-ornage"
                      : fim.status_http.includes("Up")
                      ? "kpi-green"
                      : "kpi-grey"
                  }
                >
                  {fim.status_http}
                </td>
                <td>
                  <div className="counter-reset-td">
                    {fim.counterDown}{" "}
                    <FaEye
                      title={"Ver historial de intento de reinicios"}
                      style={{ cursor: "pointer" }}
                      onClick={() => fimData(fim)}
                    />
                  </div>
                </td>
                <td>{fim.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDatesReset && (
        <div className="dates-reset-container-fim">
          <DatesReset
            dataDownSelected={listDownSelected}
            baseName={baseName}
            setShowDatesReset={setShowDatesReset}
          />
        </div>
      )}
    </div>
  );
}
