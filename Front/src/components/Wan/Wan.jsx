import { getWan } from "../../utils/Api-candelaria/api";
import { useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { WanDashboard } from "./WanDashboard/WanDashboard";
import { useWanDates } from "../../hooks/useWanDates";
import { Spinner } from "../Spinner/Spinner";
import "./wan.css";

export function Wan() {
  const [wan, setWan] = useState([]);
  const [wanAdmin, setWanAdmin] = useState([]);
  const [wanDates, setWanDates] = useState("");
  const [showAdditionalRows, setShowAdditionalRows] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wanList = await getWan();
        const dates = useWanDates();

        const ipWanAdmin = wanList.filter((wanItem) =>
          wanItem.ip.startsWith("10.224.126")
        );
        const otherIpWan = wanList.filter(
          (wanItem) => !wanItem.ip.startsWith("10.224.126")
        );

        setWanAdmin(ipWanAdmin);
        setWan(otherIpWan);
        setWanDates(dates);
        setShowSpinner(false);
      } catch (error) {
        console.error("Error al obtener el listado de WAN:", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const toggleAdditionalRows = () => {
    setShowAdditionalRows(!showAdditionalRows);
  };

  const currentMonthName = wanDates.currentMonthName;
  const previousMonthName = wanDates.previousMonthName;
  const today = wanDates.today;

  let adminUptimePorcentLastMonth = 0;
  let adminDowntimePorcentLastMonth = 0;
  let adminUptimePorcentCurrentMonth = 0;
  let adminUptimePorcentToday = 0;

  if (wanAdmin.length > 0) {
    const toNumberUptimePorcentLastMonth = wanAdmin.map((e) => parseFloat(e.last_uptime_percent));
    const toNumberDowntimePorcentLastMonth = wanAdmin.map((e) => parseFloat(e.last_down_percent));
    const toNumberUptimePorcentCurrentMonth = wanAdmin.map((e) => parseFloat(e.current_uptime_percent));
    const toNumberUptimePorcentToday = wanAdmin.map((e) => parseFloat(e.today_uptime_percent));

    adminUptimePorcentLastMonth = Math.max(...toNumberUptimePorcentLastMonth);
    adminDowntimePorcentLastMonth = Math.min(...toNumberDowntimePorcentLastMonth);
    adminUptimePorcentCurrentMonth = Math.max(...toNumberUptimePorcentCurrentMonth);
    adminUptimePorcentToday = Math.max(...toNumberUptimePorcentToday);
  }
  if (showSpinner) {
    return (
      <div>
        <Navbar title={"WAN"} />
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar title={"WAN"} />
      <Status_System tableToShow={"wan"} />
      <WanDashboard previousMonthName={previousMonthName} />
      <table className="wan-table">
        <thead>
          <tr>
            <th>IP</th>
            <th>SENSOR</th>
            <th>
              UPTIME(%) MES ANTERIOR
              <br /> ({previousMonthName}){" "}
            </th>
            <th>
              UPTIME(s) MES ANTERIOR
              <br /> ({previousMonthName})
            </th>
            <th>
              DOWNTIME(%) MES ANTERIOR
              <br /> ({previousMonthName})
            </th>
            <th>
              DOWNTIME(s) MES ANTERIOR
              <br /> ({previousMonthName})
            </th>
            <th>
              UPTIME(%) MES ACTUAL
              <br /> ({currentMonthName})
            </th>
            <th>
              UPTIME(%) HOY <br /> ({today} de {currentMonthName})
            </th>
          </tr>
        </thead>
        <tbody>
          {wan.map((wan) => (
            <tr key={wan.id}>
              <td>{wan.ip}</td>
              <td>{wan.sensor}</td>
              <td
                className={
                  wan.last_uptime_percent >= 99.85 ? "kpi-green" : "kpi-red"
                }
              >
                {wan.last_uptime_percent} %
              </td>
              <td>{wan.last_uptime_days}</td>
              <td>{wan.last_down_percent} %</td>
              <td>{wan.last_down_days}</td>
              <td
                className={
                  wan.current_uptime_percent >= 99.85 ? "kpi-green" : "kpi-red"
                }
              >
                {wan.current_uptime_percent} %
              </td>
              <td
                className={
                  wan.today_uptime_percent >= 99.85 ? "kpi-green" : "kpi-red"
                }
              >
                {wan.today_uptime_percent} %
              </td>
            </tr>
          ))}
          <tr style={{ cursor: "pointer" }} onClick={toggleAdditionalRows}>
            <td>Candelaria🔻</td>
            <td>Candelaria</td>
            <td
              className={
                
                adminUptimePorcentLastMonth >= 99.85
                  ? "kpi-green"
                  : "kpi-red"
              }
            >
              {adminUptimePorcentLastMonth} %
            </td>
            <td>Más detalles</td>
            <td>{adminDowntimePorcentLastMonth} %</td>
            <td>Más detalles</td>
            <td
              className={
                adminUptimePorcentCurrentMonth &&
                adminUptimePorcentCurrentMonth >= 99.85
                  ? "kpi-green"
                  : "kpi-red"
              }
            >
              {adminUptimePorcentCurrentMonth} %
            </td>
            <td
              className={
                adminUptimePorcentToday && adminUptimePorcentToday >= 99.85
                  ? "kpi-green"
                  : "kpi-red"
              }
            >
              {adminUptimePorcentToday} %
            </td>
          </tr>
          {showAdditionalRows &&
            wanAdmin.map((adminWan) => (
              <tr key={adminWan.id}>
                <td>{adminWan.ip}</td>
                <td>{adminWan.sensor}</td>
                <td
                  className={
                    adminWan.last_uptime_percent >= 99.85
                      ? "kpi-green"
                      : "kpi-red"
                  }
                >
                  {adminWan.last_uptime_percent} %
                </td>
                <td>{adminWan.last_uptime_days}</td>
                <td>{adminWan.last_down_percent} %</td>
                <td>{adminWan.last_down_days}</td>
                <td
                  className={
                    adminWan.current_uptime_percent >= 99.85
                      ? "kpi-green"
                      : "kpi-red"
                  }
                >
                  {adminWan.current_uptime_percent} %
                </td>
                <td
                  className={
                    adminWan.today_uptime_percent >= 99.85
                      ? "kpi-green"
                      : "kpi-red"
                  }
                >
                  {adminWan.today_uptime_percent} %
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
