import { useInfGenDash } from "../../../hooks/useInfGenDash";
import "./InfraGeneralDash.css";

const infGenDash = useInfGenDash();
const infGenDashUp = infGenDash.upElements;
const infGenDashDown = infGenDash.downElements;

export function InfraGeneralDash() {
  return (
    <>
      <table className="infra-dash-table">
        <thead>
          <tr>
            <th>ELEMENTO</th>
            <th className="kpi-green">UP</th>
            <th className="kpi-red">FAIL</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CORE</td>
            <td>{infGenDashUp}</td>
            <td>{infGenDashDown}</td>
            <td>{infGenDashUp+infGenDashDown}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
