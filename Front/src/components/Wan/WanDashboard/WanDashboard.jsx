import { useState, useEffect } from "react";
import { getWanIndicators } from "../../../utils/Api-candelaria/api";
import "./wandashboard.css";

export function WanDashboard({ previousMonthName }) {
  const [wanKpi, setWanKpi] = useState(0.0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpi = await getWanIndicators();
        setWanKpi(kpi);
      } catch (error) {
        console.error("Error al obtener el listado de firewalls:", error);
        return error;
      }
    };
    fetchData();
  }, []);

  const kpiMesAnterior = wanKpi ? wanKpi.kpiWan : "0.0";
  const claassNameKpi = wanKpi
    ? kpiMesAnterior >= 99.85
      ? "kpi-green"
      : "kpi-red"
    : "kpi-red";

  return (
    <div className="wan-kpi-container">
      <h2>
        KPI {previousMonthName}:{" "}
        <span className={claassNameKpi}>{kpiMesAnterior}%</span>
      </h2>
    </div>
  );
}
