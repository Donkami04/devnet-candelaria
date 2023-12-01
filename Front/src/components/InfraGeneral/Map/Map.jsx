import { useEffect, useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import { getFirewalls, getWan, getStatusCores } from "../../../utils/Api-candelaria/api";
import { Link } from "react-router-dom";
import "./Map.css";

export const Map = () => {
  const [firewalls, setFirewalls] = useState([]);
  const [wan, setWan] = useState([]);
  const [cores, setCores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFirewalls = await getFirewalls();
        const dataWan = await getWan();
        const dataCores = await getStatusCores();

        setFirewalls(dataFirewalls);
        setWan(dataWan);
        setCores(dataCores);

      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, []);


  const getColorLight = (firewallName, canal, firewalls) => {
    const filteredFirewalls = firewalls.filter(fw => fw.fw === firewallName && fw.canal === canal);

    if (filteredFirewalls.length > 0) {
      return filteredFirewalls[0].state === "alive" ? "inf-gen-green" : "inf-gen-red";
    }
    return "";
  };
  const getColorLightWan = (sensorName, wanlist) => {
    const filteredWan = wanlist.filter(wanElement => wanElement.sensor === sensorName);
    if (filteredWan.length > 0) {
      return filteredWan[0].status === "Up" ? "inf-gen-green" : "inf-gen-red";
    }
    return "";
  };
  const getColorLightCores = (ipCore, red, cores) => {
    const filteredCores = cores.filter(core => core.ip === ipCore && core.red === red);
    if (filteredCores.length > 0) {
      return filteredCores[0].status === "Up" ? "inf-gen-green" : "inf-gen-red";
    }
    return "";
  };

  const colorLightFwSantiago = getColorLight("FW-Santiago", "wan2", firewalls);
  const colorLightFwChamonate = getColorLight("FW-Chamonate", "wan1", firewalls);
  const colorLightFwRalun = getColorLight("FW-Ralun", "wan1", firewalls);
  const colorLightFwDptLegal = getColorLight("FW-Dpto-Legal", "wan1", firewalls);
  const colorLightFwCopiapo = getColorLight("FW-Copiapo", "wan2", firewalls);
  const colorLightStarlink = getColorLight("FW-Chamonate", "port5", firewalls);
  const colorLightCanalAdmin = getColorLight("FW-Admin", "port7", firewalls);
  const colorLightCanalConce = getColorLight("FW-Conce", "port7", firewalls);
  const colorLightCanalOjos = getColorLight("FW-Ojos", "port19", firewalls);
  const colorLightWanAzure = getColorLightWan("LAN_Azure", wan);
  const colorLightWanAdmin = getColorLightWan("FG-Admin", wan);
  const colorLightWanConce = getColorLightWan("FG-Conce", wan);
  const colorLightWanOjos = getColorLightWan("FG-Ojos", wan);
  const colorLightCoreAdmIt = getColorLightCores("10.224.127.1", "it", cores);
  const colorLightCoreConceIt = getColorLightCores("10.224.127.2", "it", cores);


  return (
    <main className="background-infra-general">
      <Navbar title={"Mapa Infra General"} />
      <div className="main-map-container">
        <img src="/mapa-infra-general.png" alt="mapa-infra-general" />
      </div>

      <div className="status-light-map-container fw-santiago">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightFwSantiago}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-chamonate">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightFwChamonate}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-ralun">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightFwRalun}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-dpto-legal">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightFwDptLegal}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-copiapo">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightFwCopiapo}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-azure">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightWanAzure}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container internet">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen"></p>
        </Link>
      </div>

      <div className="status-light-map-container canal-starlink">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightStarlink}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container canal-admin">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightCanalAdmin}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container canal-conce">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightCanalConce}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container canal-ojos">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightCanalOjos}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-admin">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightWanAdmin}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-conce">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightWanConce}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-ojos">
        <Link to="/monitoreo/firewalls">
          <p className={`status-light-inf-gen ${colorLightWanOjos}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container core-admin-it">
        <Link to="/monitoreo/infraestrucura-general">
          <p className={`status-light-inf-gen ${colorLightCoreAdmIt}`}></p>
        </Link>
      </div>

      <div className="status-light-map-container core-conce-it">
        <Link to="/monitoreo/infraestrucura-general">
          <p className={`status-light-inf-gen ${colorLightCoreConceIt}`}></p>
        </Link>
      </div>

    </main>
  );
};
