import { useState, useEffect } from "react";
// import { useInfGenDash } from '../../../hooks/useInfGenDash';
import { useDataInfGen } from "../../../hooks/useDataInfGen";
import PuffLoader from "react-spinners/PuffLoader";
import "./InfraGeneralDash.css";

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
            <th className="kpi-green">OK</th>
            <th className="kpi-red">FAIL</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{infGenDashUp}</td>
            <td>{infGenDashDown}</td>
            <td>{infGenDashUp + infGenDashDown}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
