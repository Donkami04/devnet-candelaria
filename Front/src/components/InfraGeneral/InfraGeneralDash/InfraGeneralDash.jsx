import { useState, useEffect } from "react";
// import { useInfGenDash } from '../../../hooks/useInfGenDash';
import { useDataInfGen } from "../../../hooks/useDataInfGen";
import PuffLoader from "react-spinners/PuffLoader";
import "./InfraGeneralDash.css";
import { Link } from "react-router-dom";
import { FaNetworkWired } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

export function InfraGeneralDash() {
  const [infGenDashUp, setIinfGenDashUp] = useState({});
  const [infGenDashDown, setIinfGenDashDown] = useState({});
  const [spinnerInfra, setSpinnerInfra] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await useDataInfGen();
        setIinfGenDashUp(result.upElements.length);
        setIinfGenDashDown(result.downElements.length);
        setSpinnerInfra(false);
      } catch (error) {
        console.error("Error InfraGeneralDash:", error);
      }
    };

    fetchData();
  }, []);

  if (spinnerInfra) {
    return (
      <div>
        <PuffLoader color="red" />
      </div>
    );
  }

  return (
    <>
      <table className="infra-dash-table">
        <thead>
          <tr>
            <th className="kpi-green">Up</th>
            <th className="kpi-red">Down</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{infGenDashUp}</td>
            <td>{infGenDashDown}</td>
            <td>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Link
                  title={"Mapa"}
                  style={{ width: "20px" }}
                  className="link-open-pit"
                  to="/monitoreo/infraestrucura-general/map"
                >
                  <FaNetworkWired />
                </Link>
                <Link
                  title={"Ver detalles"}
                  style={{ width: "20px" }}
                  className="link-open-pit"
                  to="/monitoreo/infraestrucura-general/categorias"
                >
                  <FaEye />
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
