import { useEffect, useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import { Status_System } from "../../Status_System/Status_System";
import { Spinner } from "../../Spinner/Spinner";
import { getAp } from "../../../utils/Api-candelaria/api";
import "./Ap.css";

export function ApMesh() {
  const [numApPrtg, setNumApPrtg] = useState("Cargando...");
  const [numApDb, setNumApDb] = useState("Cargando...");
  const [apList, setApList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataAp = await getAp();
        const apList = dataAp.apList;
        let apMesh = apList.filter((e) => {
          return e.name_switch === "WLC - MESH";
        });
        apMesh = apMesh.sort((a, b) => (a.status === "Joined" ? 1 : -1));

        setApList(apMesh);
        setNumApPrtg(dataAp.numberApRegisteredPrtg);
        setNumApDb(apMesh.length);
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
      <Navbar title={"AP WLC - MESH"} />
      <Status_System tableToShow={"ig"} />
      <div className="counter-ap-container">
        <p>{`AP reportados - DevNet: ${apList.length}`}</p>
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
