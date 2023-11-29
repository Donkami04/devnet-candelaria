import { useEffect, useState } from "react";
import { Navbar } from "../../Navbar/Navbar";
import { getFirewalls } from "../../../utils/Api-candelaria/api";
import { Link } from "react-router-dom";
import "./Map.css";

export const Map = () => {
  const [firewalls, setFirewalls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFirewalls = await getFirewalls();
        setFirewalls(dataFirewalls);
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, []);

  const fwSantiago = "";

  return (
    <main className="background-infra-general">
      <Navbar title={"Mapa Infra General"} />
      <div className="main-map-container">
        <img src="/mapa-infra-general.png" alt="mapa-infra-general" />
      </div>

      <div className="status-light-map-container fw-santiago">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen status-light-fw-santiago"></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-chamonate">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-fw-chamonate"></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-ralun">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-fw-ralun"></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-dpto-legal">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-fw-dpto-legal"></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-copiapo">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-fw-copiapo"></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-azure">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-fw-azure"></p>
        </Link>
      </div>

      <div className="status-light-map-container internet">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-internet"></p>
        </Link>
      </div>

      <div className="status-light-map-container canal-starlink">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-canal-starlink"></p>
        </Link>
      </div>

      <div className="status-light-map-container canal-admin">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-canal-admin"></p>
        </Link>
      </div>

      <div className="status-light-map-container canal-conce">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-canal-conce"></p>
        </Link>
      </div>

      <div className="status-light-map-container canal-ojos">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-canal-ojos"></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-admin">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-fw-admin"></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-conce">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-canal-ojos"></p>
        </Link>
      </div>

      <div className="status-light-map-container fw-ojos">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-canal-ojos"></p>
        </Link>
      </div>

      <div className="status-light-map-container core-admin-it">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-canal-ojos"></p>
        </Link>
      </div>

      <div className="status-light-map-container core-conce-it">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen  status-light-canal-ojos"></p>
        </Link>
      </div>

    </main>
  );
};
