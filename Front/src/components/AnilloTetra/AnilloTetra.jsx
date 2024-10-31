import { useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { DatetimeModules } from "../DatetimeModules/DatetimeModules";
import { getDataAnilloTetra } from "../../utils/Api-candelaria/api";
import "./AnilloTetra.css";

export function AnilloTetra() {
  const [anilloData, setAnilloData] = useState([]);
  const PRTG_URL = "https://10.224.241.25/sensor.htm?id=";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDataAnilloTetra();
        setAnilloData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const statusLight = (idInterface) => {
    // Verifica si hay datos en anilloData
    if (anilloData.length === 0) {
      return ""; // O cualquier otro valor que desees para indicar que no hay datos disponibles
    }

    // Busca la interfaz en anilloData
    const interfaceData = anilloData.find(
      (data) => data.id_prtg === idInterface
    );

    // Verifica si se encontró la interfaz y si su estado incluye "Up" o "Down"
    if (interfaceData && interfaceData.status) {
      if (interfaceData.status.toLowerCase().includes("up")) {
        return "anillo-green";
      }
      if (interfaceData.status.toLowerCase().includes("down")) {
        return "anillo-red";
      }
      if (interfaceData.status.toLowerCase().includes("unusual")) {
        return "anillo-orange";
      }
      if (interfaceData.status.toLowerCase().includes("paused")) {
        return "anillo-blue";
      }
    }

    return "anillo-white";
  };

  const statusTitle = (idInterface) => {
    // Verifica si hay datos en anilloData
    if (anilloData.length === 0) {
      return ""; // O cualquier otro valor que desees para indicar que no hay datos disponibles
    }

    // Busca la interfaz en anilloData
    const interfaceData = anilloData.find((e) => e.id_prtg === idInterface);

    // Verifica si se encontró la interfaz y si su estado incluye "Up" o "Down"
    if (interfaceData && interfaceData.status) {
      return interfaceData.status;
    }

    // En caso de no encontrar datos o que el estado no incluya "Up" o "Down"
    return "Not Found"; // O cualquier otro valor que desees para indicar un estado no válido
  };

  return (
    <main className="main-container-anillotetra">
      <Navbar title={"Sistema Tetra"} />
      <DatetimeModules module={"anillo_tetra"} name={"Sistema Tetra"} />
      <div className="anillotetra-image-container">
        <img className="anillotetra-image" src="/mapa_tetra.webp" alt="" />
        <div className="main-lights-anillotetra-container">
          <div className="status-light-anillo-container">
            <p // Taller electronico
              title={statusTitle(19118)}
              className={`status-light-tetra id19118 ${statusLight(19118)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19118&tabid=1`}
                target="_blank"
              >
                Gi1/0/27
              </a>
            </p>
          </div>

          <div className="status-light-anillo-container">
            <p // Taller electronico
              title={statusTitle(19115)}
              className={`status-light-tetra id19115 ${statusLight(19115)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19115&tabid=1`}
                target="_blank"
              >
                Gi1/0/22
              </a>
            </p>
          </div>

          <div className="status-light-anillo-container">
            <p // Taller electronico
              title={statusTitle(19116)}
              className={`status-light-tetra id19116 ${statusLight(19116)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19116&tabid=1`}
                target="_blank"
              >
                Gi1/0/25
              </a>
            </p>
          </div>

          <div className="status-light-anillo-container">
            <p // Taller electronico
              title={statusTitle(19117)}
              className={`status-light-tetra id19117 ${statusLight(19117)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19117&tabid=1`}
                target="_blank"
              >
                Gi1/0/26
              </a>
            </p>
          </div>

          <div className="status-light-anillo-container">
            <p // Taller electronico
              title={statusTitle(19119)}
              className={`status-light-tetra id19119 ${statusLight(19119)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19119&tabid=1`}
                target="_blank"
              >
                Gi1/0/28
              </a>
            </p>
          </div>

          <div className="status-light-anillo-container">
            <p // El bronce
              title={statusTitle(19120)}
              className={`status-light-tetra id19120 ${statusLight(19120)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19120&tabid=1`}
                target="_blank"
              >
                Gi0/1
              </a>
            </p>
          </div>
          <div className="status-light-anillo-container">
            <p // El bronce
              title={statusTitle(19121)}
              className={`status-light-tetra id19121 ${statusLight(19121)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19121&tabid=1`}
                target="_blank"
              >
                Gi0/12
              </a>
            </p>
          </div>
          <div className="status-light-anillo-container">
            <p // El bronce
              title={statusTitle(19124)}
              className={`status-light-tetra id19124 ${statusLight(19124)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19124&tabid=1`}
                target="_blank"
              >
                Gi0/12
              </a>
            </p>
          </div>
          <div className="status-light-anillo-container">
            <p // El bronce
              title={statusTitle(19122)}
              className={`status-light-tetra id19122 ${statusLight(19122)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19122&tabid=1`}
                target="_blank"
              >
                Gi0/7
              </a>
            </p>
          </div>
          <div className="status-light-anillo-container">
            <p // El bronce
              title={statusTitle(19123)}
              className={`status-light-tetra id19123 ${statusLight(19123)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19123&tabid=1`}
                target="_blank"
              >
                Gi0/11
              </a>
            </p>
          </div>
          <div className="status-light-anillo-container">
            <p // El bronce
              title={statusTitle(19121)}
              className={`status-light-tetra id19121 ${statusLight(19121)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19121&tabid=1`}
                target="_blank"
              >
                Gi0/2
              </a>
            </p>
          </div>

          <div className="status-light-anillo-container">
            <p // Buitre
              title={statusTitle(19125)}
              className={`status-light-tetra id19125 ${statusLight(19125)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19125&tabid=1`}
                target="_blank"
              >
                Gi0/3
              </a>
            </p>
          </div>
          <div className="status-light-anillo-container">
            <p // Buitre
              title={statusTitle(19126)}
              className={`status-light-tetra id19126 ${statusLight(19126)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19126&tabid=1`}
                target="_blank"
              >
                Gi0/11
              </a>
            </p>
          </div>
          <div className="status-light-anillo-container">
            <p // Buitre
              title={statusTitle(19127)}
              className={`status-light-tetra id19127 ${statusLight(19127)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}19127&tabid=1`}
                target="_blank"
              >
                Gi0/12
              </a>
            </p>
          </div>

          {/* Core OT CONCENTRADORA */}
          <div className="status-light-anillo-container">
            <p // Buitre
              title={statusTitle(17507)}
              className={`status-light-tetra id17507 ${statusLight(17507)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}17507&tabid=1`}
                target="_blank"
              >
                Te1/15
              </a>
            </p>
          </div>
          {/* Core OT ADM */}
          <div className="status-light-anillo-container">
            <p // Buitre
              title={statusTitle(17468)}
              className={`status-light-tetra id17468 ${statusLight(17468)}`}
            >
              <a
                style={{ color: "black" }}
                href={`${PRTG_URL}17468&tabid=1`}
                target="_blank"
              >
                Te1/6
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
