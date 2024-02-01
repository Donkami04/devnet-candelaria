import { useEffect, useState } from "react";
import { getDevicesIndicators } from "../../../utils/Api-candelaria/api";
import PuffLoader from "react-spinners/PuffLoader";
import "./devicesdash.css";

export function DevicesDash() {
  const [indicatorsDevices, setIndicatorsDevices] = useState(null);
  const [spinnerDevices, setSpinnerDevices] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const indicators = await getDevicesIndicators();
        setIndicatorsDevices(indicators);
        setSpinnerDevices(false);
      } catch (error) {
        console.error(
          "Error al obtener el listado de indicadores MESH:",
          error
        );
      }
    };
    fetchData();
  }, []);

  // Obtén el nombre de la pestaña del navegador
  const currentTab = document.title;

  // Determina el nombre de la clase de la tabla basado en la pestaña actual
  const tableClassName =
    currentTab === "Home" ? "devices-dash-table-home" : "devices-dash-table";

  const totalDevicesFake =
    indicatorsDevices &&
    indicatorsDevices.numCamerasUp +
      indicatorsDevices.numApUp +
      indicatorsDevices.numOthersUp +
      indicatorsDevices.numImpresorasUp +
      indicatorsDevices.numCamerasDown +
      indicatorsDevices.numApDown +
      indicatorsDevices.numOthersDown +
      indicatorsDevices.numImpresorasDown;

  if (spinnerDevices) {
    return (
      <div>
        <PuffLoader color="red" />
      </div>
    );
  }

  return (
    <>
      <table className={tableClassName}>
        <thead>
          <tr>
            <th>DISPOSITIVOS</th>
            <th className="kpi-green">UP</th>
            <th className="kpi-red">DOWN</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CAMARAS</td>
            <td>{indicatorsDevices && indicatorsDevices.numCamerasUp}</td>
            <td>{indicatorsDevices && indicatorsDevices.numCamerasDown}</td>
            <td>{indicatorsDevices && indicatorsDevices.numTotalCameras}</td>
          </tr>
          <tr>
            <td>ACCESS POINTS</td>
            <td>{indicatorsDevices && indicatorsDevices.numApUp}</td>
            <td>{indicatorsDevices && indicatorsDevices.numApDown}</td>
            <td>{indicatorsDevices && indicatorsDevices.numTotalAp}</td>
          </tr>
          <tr>
            <td>IMPRESORAS</td>
            <td>{indicatorsDevices && indicatorsDevices.numImpresorasUp}</td>
            <td>{indicatorsDevices && indicatorsDevices.numImpresorasDown}</td>
            <td>{indicatorsDevices && indicatorsDevices.numTotalImpresoras}</td>
          </tr>
          <tr>
            <td>OTROS</td>
            <td>{indicatorsDevices && indicatorsDevices.numOthersUp}</td>
            <td>{indicatorsDevices && indicatorsDevices.numOthersDown}</td>
            <td>{indicatorsDevices && indicatorsDevices.numTotalOthers}</td>
          </tr>
          <tr>
            <td>TOTAL</td>
            <td>
              {indicatorsDevices &&
                indicatorsDevices.numCamerasUp +
                  indicatorsDevices.numApUp +
                  indicatorsDevices.numOthersUp +
                  indicatorsDevices.numImpresorasUp}
            </td>
            <td>
              {indicatorsDevices &&
                indicatorsDevices.numCamerasDown +
                  indicatorsDevices.numApDown +
                  indicatorsDevices.numOthersDown +
                  indicatorsDevices.numImpresorasDown}
            </td>
            <td>{totalDevicesFake}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
