import { useEffect, useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import {
  getFirewalls,
  getWan,
  getStatusCores,
} from "../../../utils/Api-candelaria/api";
import { Link } from "react-router-dom";
import { useDataInfGen } from "../../../hooks/useDataInfGen";
import { Spinner } from "../../Spinner/Spinner";
import { useCoreStatus } from "../../../hooks/useCoreStatus";
import "./Map.css";

export const Map = () => {
  const [firewalls, setFirewalls] = useState([]);
  const [wan, setWan] = useState([]);
  const [cores, setCores] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [infraGeneral, setInfraGeneral] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [coreStatus, setCoreStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFirewalls = await getFirewalls();
        const dataWan = await getWan();
        const dataCores = await getStatusCores();
        const dataInfGen = await useDataInfGen();
        const dataCoreStatus = await useCoreStatus();

        setFirewalls(dataFirewalls);
        setWan(dataWan);
        setCores(dataCores);
        setInfraGeneral(dataInfGen);
        setShowSpinner(false);
        setCoreStatus(dataCoreStatus);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const getDeadElements = (list, name) => {
    const filteredData = list.filter(
      (e) => e.fw === name && e.state === "dead"
    );
    return filteredData;
  };

  const handleZoomIn = () => {
    // Ajusta el nivel de zoom según sea necesario
    if (zoomLevel < 4) {
      setZoomLevel(zoomLevel + 1);
    }
  };

  const handleZoomOut = () => {
    // Ajusta el nivel de zoom según sea necesario
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 1);
    }
  };

  const getColorLightWan = (sensorName, wanlist) => {
    const filteredWan = wanlist.filter(
      (wanElement) => wanElement.sensor === sensorName
    );
    if (filteredWan.length > 0) {
      return filteredWan[0].status === "Up" ? "inf-gen-green" : "inf-gen-red";
    }
    return "";
  };

  const getColorLight = (list, number) => {
    let finalColor = "";
    if (list.length === number) {
      finalColor = "inf-gen-red";
      return finalColor;
    }
    if (list.length < number && list.length !== 0) {
      finalColor = "inf-gen-yellow";
      return finalColor;
    }
    finalColor = "inf-gen-green";
    return finalColor;
  };

  const getColorLightCores = (ipCore, red, cores) => {
    const filteredCores = cores.filter(
      (core) => core.ip === ipCore && core.red === red
    );
    if (filteredCores.length > 0) {
      return filteredCores[0].status === "Up" ? "inf-gen-green" : "inf-gen-red";
    }
    return "";
  };

  // Filtro de elementos Dead
  const fwsSantiagoDead = getDeadElements(firewalls, "FW-Santiago");
  const fwsChamonateDead = getDeadElements(firewalls, "FW-Chamonate");
  const fwsRalunDead = getDeadElements(firewalls, "FW-Ralun");
  const fwsDptLegalDead = getDeadElements(firewalls, "FW-Dpto-Legal");
  const fwsCopiapoDead = getDeadElements(firewalls, "FW-Copiapo");
  const canalAdminDead = getDeadElements(firewalls, "FW-Admin");
  const canalConceDead = getDeadElements(firewalls, "FW-Conce");
  const canalOjosDead = getDeadElements(firewalls, "FW-Ojos");

  // Colores Firewalls
  const colorLightFwSantiago = getColorLight(fwsSantiagoDead, 2);
  const colorLightFwChamonate = getColorLight(fwsChamonateDead, 3);
  const colorLightFwRalun = getColorLight(fwsRalunDead, 1);
  const colorLightFwDptLegal = getColorLight(fwsDptLegalDead, 1);
  const colorLightFwCopiapo = getColorLight(fwsCopiapoDead, 1);
  let colorLightStarlink = canalAdminDead.some((fw) => fw.link === "STARLINK");
  !colorLightStarlink
    ? (colorLightStarlink = "inf-gen-green")
    : (colorLightStarlink = "inf-gen-red");

  // Colores Canales
  const colorLightCanalAdmin = getColorLight(canalAdminDead, 4);
  const colorLightCanalConce = getColorLight(canalConceDead, 3);
  const colorLightCanalOjos = getColorLight(canalOjosDead, 3);

  // Colores WAN
  const colorLightWanAzure = getColorLightWan("LAN_Azure", wan);
  const colorLightWanAdmin = getColorLightWan("FG-Admin", wan);
  const colorLightWanConce = getColorLightWan("FG-Conce", wan);
  const colorLightWanOjos = getColorLightWan("FG-Ojos", wan);

  // Colores Cores
  const colorLightCoreAdmIt = getColorLightCores("10.224.127.1", "it", cores);
  const colorLightCoreConceIt = getColorLightCores("10.224.127.2", "it", cores);
  const colorLightCoreOjosIt = getColorLightCores("10.230.127.1", "it", cores);

  if (showSpinner) {
    return (
      <div>
        <Navbar title={"Mapa Infra General"} />
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar title={"Mapa Infra General"} />
      <div className="button-zoom-container">
        <button className="button-zoom zoom-in" onClick={handleZoomIn}>
          +
        </button>
        <button
          title={"Disminuir Zoom"}
          className="button-zoom zoom-out"
          onClick={handleZoomOut}
        >
          -
        </button>
      </div>
      <main className={`background-infra-general zoom-${zoomLevel}`}>
        <div className="main-map-container">
          <img src="/mapa-horizontal.png" alt="mapa-infra-general" />

          <div className="main-lights-container">
            <div className="status-light-map-container fw-santiago">
              <Link to="/monitoreo/firewalls">
                <p
                  className={`status-light-inf-gen ${colorLightFwSantiago}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container fw-chamonate">
              <Link to="/monitoreo/firewalls">
                <p
                  className={`status-light-inf-gen ${colorLightFwChamonate}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container fw-ralun">
              <Link to="/monitoreo/firewalls">
                <p className={`status-light-inf-gen ${colorLightFwRalun}`}></p>
              </Link>
            </div>

            <div className="status-light-map-container fw-dpto-legal">
              <Link to="/monitoreo/firewalls">
                <p
                  className={`status-light-inf-gen ${colorLightFwDptLegal}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container fw-copiapo">
              <Link to="/monitoreo/firewalls">
                <p
                  className={`status-light-inf-gen ${colorLightFwCopiapo}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container fw-azure">
              <Link to="/monitoreo/firewalls">
                <p className={`status-light-inf-gen ${colorLightWanAzure}`}></p>
              </Link>
            </div>

            <div className="status-light-map-container internet">
              <Link to="/monitoreo/firewalls">
                <p className="status-light-inf-gen inf-gen-green"></p>
              </Link>
            </div>

            <div className="status-light-map-container canal-starlink">
              <Link to="/monitoreo/firewalls">
                <p className={`status-light-inf-gen ${colorLightStarlink}`}></p>
              </Link>
            </div>

            <div className="status-light-map-container canal-admin">
              <Link to="/monitoreo/firewalls">
                <p
                  className={`status-light-inf-gen ${colorLightCanalAdmin}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container canal-conce">
              <Link to="/monitoreo/firewalls">
                <p
                  className={`status-light-inf-gen ${colorLightCanalConce}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container canal-ojos">
              <Link to="/monitoreo/firewalls">
                <p
                  className={`status-light-inf-gen ${colorLightCanalOjos}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container fw-admin">
              <Link to="/monitoreo/wan">
                <p className={`status-light-inf-gen ${colorLightWanAdmin}`}></p>
              </Link>
            </div>

            <div className="status-light-map-container fw-conce">
              <Link to="/monitoreo/wan">
                <p className={`status-light-inf-gen ${colorLightWanConce}`}></p>
              </Link>
            </div>

            <div className="status-light-map-container fw-ojos">
              <Link to="/monitoreo/wan">
                <p className={`status-light-inf-gen ${colorLightWanOjos}`}></p>
              </Link>
            </div>

            <div className="status-light-map-container core-admin-it">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=SW%20CORE%20ADMIN">
                <p
                  title={`El ${coreStatus.coreAdminUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorAdminCore}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container core-conce-it">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=SW%20CORE%20CONCE">
                <p
                  title={`El ${coreStatus.coreConceUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorConceCore}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container core-ojos-it">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=SW%20CORE%20OJOS">
                <p
                  title={`El ${coreStatus.coreOjosUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorOjosCore}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container status-wlc-negocio">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=WLC">
                <p
                  title={`El ${coreStatus.wlcNegocioUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorWlcNegocio}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container status-wlc-mesh">
              <Link to="/monitoreo/infraestrucura-general?categoria=WLC%209800%20MESH">
                <p
                  title={`El ${coreStatus.wlcMeshUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorWlcMesh}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container fw-ot">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=WLC">
                <p
                  title={`El ${coreStatus.fwOtUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorFwOt}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container cucm-pub">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=WLC">
                <p
                  title={`El ${coreStatus.telefoniaUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorTelefonia}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container dist-adm">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=WLC">
                <p
                  title={`El ${coreStatus.swDistAdmPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorSwDistAdm}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container dist-conce">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=WLC">
                <p
                  title={`El ${coreStatus.swDistConceUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorSwDistConce}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container swCoreOtAdmin">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=WLC">
                <p
                  title={`El ${coreStatus.swCoreOtAdminUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorSwCoreOtAdmin}`}
                ></p>
              </Link>
            </div>

            <div className="status-light-map-container swCoreOtConce">
              <Link to="/monitoreo/infraestrucura-general/detalles?nombre=WLC">
                <p
                  title={`El ${coreStatus.swCoreOtConceUpPercent}% de los elementos está Up`}
                  className={`status-light-inf-gen inf-gen-${coreStatus.colorSwCoreOtConce}`}
                ></p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
