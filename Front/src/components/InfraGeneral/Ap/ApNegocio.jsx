import { useEffect, useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import { Status_System } from "../../Status_System/Status_System";
import { Spinner } from "../../Spinner/Spinner";
import { getAp } from "../../../utils/Api-candelaria/api";
import "./Ap.css";

export function ApNegocio() {
  const [numApPrtg, setNumApPrtg] = useState("Cargando...");
  const [numApDb, setNumApDb] = useState("Cargando...");
  const [apList, setApList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataAp = await getAp();
        const apList = dataAp.apList;
        let apNegocio = apList.filter((e) => {
          return e.name_switch === "WLC 9800 NEGOCIO";
        });
        apNegocio = apNegocio.sort((a, b) => (a.status === "Joined" ? 1 : -1));

        setApList(apNegocio);
        setNumApPrtg(dataAp.numberApRegisteredPrtg);
        setNumApDb(apNegocio.length);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar title={"AP Inf. Gen."} />
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar title={"AP WLC 9800 NEGOCIO"} />
      <Status_System tableToShow={"ig"} />
      <div className="counter-ap-container">
        <p>{`AP registrados - PRTG: ${numApPrtg}`}</p>
        <p>{`AP reportados - DevNet: ${numApDb}`}</p>
      </div>
      <div className="table-ap-container">
        <table className="table-ap">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>IP</th>
              <th>Estado</th>
              <th>Last Disconnect Reason</th>
            </tr>
          </thead>
          <tbody>
            {apList.map((ap) => (
              <tr key={ap.id}>
                <td>{ap.name}</td>
                <td>{ap.ip}</td>
                <td
                  className={ap.status === "Joined" ? "kpi-green" : "kpi-red"}
                >
                  {ap.status}
                </td>
                <td>{ap.last_disconnect_reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
