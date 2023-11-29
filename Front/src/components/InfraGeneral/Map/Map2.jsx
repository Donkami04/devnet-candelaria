import { Navbar } from "../../Navbar/Navbar";
import { Link } from "react-router-dom";
import "./Map2.css";

export const Map2 = () => {
  return (
    <main className="background-infra-general">
      <Navbar title={"Mapa Infra General"} />
      <div className="main-map-container">
        <img src="/mapa-infra-general.png" alt="mapa-infra-general" />
      </div>
      <div className="status-light-map-container core-ot-adm">
      <Link to="/monitoreo/infraestrucura-general">
          <p className="status-light-inf-gen"></p>
        </Link>
      </div>
      <div className="status-light-map-container core-ot-conce">
        <Link to="/monitoreo/infraestrucura-general">
          <p className="status-light-inf-gen"></p>
        </Link>
      </div>
      <div className="status-light-map-container fw-santiago">
        <Link to="/monitoreo/firewalls">
          <p className="status-light-inf-gen"></p>
        </Link>
      </div>
    </main>
  );
};
