import { useState, useEffect } from "react";
import { Navbar } from "../../Navbar/Navbar";
import { getDataDockers } from "../../../utils/Api-candelaria/api";
import { Spinner } from "../../Spinner/Spinner";
import { DatetimeModules } from "../../DatetimeModules/DatetimeModules";
import "./Dockers.css";

export function Dockers() {
  const [totalCpu, setTotalCpu] = useState(0.0);
  const [totalMemory, setTotalMemory] = useState(0.0);
  const [dockers, setDockers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getDataDockers();
      setTotalCpu(data.totalCpuPercent);
      setTotalMemory(data.totalMemoryPercent);
      setDockers(data.dataContainers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Navbar title={"Dockers DevNet"} />
      <DatetimeModules module={"devnet"} name={"devnet"} />
      {loading ? (
        <Spinner />
      ) : (
        <main className="container-table-dockers">
          <table className="table-dockers">
            <thead>
              <tr className="row-dockers-devnet">
                <th>Contenedor</th>
                <th>Estado</th>
                <th>CPU</th>
                <th>RAM</th>
              </tr>
            </thead>
            <tbody>
              {dockers.map((docker) => (
                <tr className="row-dockers-devnet" key={docker.id}>
                  <td>{docker.name.replace("devnet-candelaria-", "")}</td>
                  <td
                    className={
                      docker.status.includes("running")
                        ? "kpi-green"
                        : "kpi-red"
                    }
                  >
                    {docker.status}
                  </td>
                  <td
                    className={
                      docker.cpu_usage_percent <= 50
                        ? ""
                        : docker.cpu_usage_percent > 50 &&
                          docker.cpu_usage_percent < 70
                        ? "kpi-yellow"
                        : docker.cpu_usage_percent >= 70
                        ? "kpi-red"
                        : ""
                    }
                  >
                    {docker.cpu_usage_percent} %
                  </td>
                  <td
                    className={
                      docker.memory_usage_percent <= 50
                        ? ""
                        : docker.memory_usage_percent > 50 &&
                          docker.memory_usage_percent < 70
                        ? "kpi-yellow"
                        : docker.memory_usage_percent >= 70
                        ? "kpi-red"
                        : ""
                    }
                  >
                    {docker.memory_usage_percent} %
                  </td>
                </tr>
              ))}
              <tr className="row-dockers-devnet">
                <td>Total</td>
                <td></td>
                <td
                  className={
                    totalCpu <= 50
                      ? ""
                      : totalCpu > 50 && totalCpu < 70
                      ? "kpi-yellow"
                      : totalCpu >= 70
                      ? "kpi-red"
                      : ""
                  }
                >
                  {totalCpu} %
                </td>
                <td
                  className={
                    totalMemory <= 50
                      ? ""
                      : totalMemory > 50 && totalMemory < 70
                      ? "kpi-yellow"
                      : totalMemory >= 70
                      ? "kpi-red"
                      : ""
                  }
                >
                  {totalMemory} %
                </td>
              </tr>
            </tbody>
          </table>
        </main>
      )}
    </div>
  );
}
