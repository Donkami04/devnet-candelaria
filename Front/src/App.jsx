import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

// Custom Hooks
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { useTabsName } from "./hooks/useTabsName";

// Components
import { Home } from "./components/Home/Home";
import { CandelariaClients } from "./components/CandelariaClients/CandelariaClients";
import { Switches } from "./components/CandelariaSwitches/CandelariaSwitches";
import { Ups } from "./components/Ups/Ups";
import { Vpn } from "./components/Vpn/Vpn";
import { Mesh } from "./components/Mesh/Mesh";
import { Devices } from "./components/Devices/Devices";
import { Firewalls } from "./components/Firewalls/Firewalls";
import { Wan } from "./components/Wan/Wan";
import { AdminUps } from "./components/AdminPanel/AdminViews/AdminUps";
import { AdminClients } from "./components/AdminPanel/AdminViews/AdminClients";
import { AdminDevices } from "./components/AdminPanel/AdminViews/AdminDevices";
import { AdminWan } from "./components/AdminPanel/AdminViews/AdminWan";
import { AdminSwitches } from "./components/AdminPanel/AdminViews/AdminSwitches";
import { AdminMesh } from "./components/AdminPanel/AdminViews/AdminMesh";
import { AdminFirewalls } from "./components/AdminPanel/AdminViews/AdminFirewalls";
import { AdminUsers } from "./components/AdminPanel/AdminViews/AdminUsers";
import { AdminAp } from "./components/AdminPanel/AdminViews/AdminAp";
import { AdminHome } from "./components/AdminPanel/AdminHome/AdminHome";
import { Login } from "./components/Login/Logins";
import { InfraGeneral } from "./components/InfraGeneral/InfraGeneral";
import { DetailsCore } from "./components/InfraGeneral/DetailsCore/DetailsCore";
import { Map } from "./components/InfraGeneral/Map/Map";
import { MainTopology } from "./components/InfraGeneral/MainTopology/MainTopology";
import { Categories } from "./components/InfraGeneral/Categories/Categories";
import { DcsPac } from "./components/DcsPac/DcsPac";
import { DcsOjos } from "./components/DcsOjos/DcsOjos";
import "./app.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { timerActive, toggleTimer } = useAutoRefresh();
  const pageTitle = useTabsName(location.pathname);

  const isAuthenticated = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    return jwtToken !== null;
  };

  useEffect(() => {
    if (location.pathname.includes("admin") && !isAuthenticated()) {
      navigate(`/login?error=401&from=${location.pathname}`);
    }
  }, [location.pathname, isAuthenticated]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <div className="MainContainer">
      <Helmet>
        <title>{useTabsName(location.pathname)}</title>
      </Helmet>
      <Routes location={location}>
        <Route path="/monitoreo/home" element={<Home />} />
        <Route
          path="/monitoreo/candelaria/clients"
          element={<CandelariaClients />}
        />
        <Route path="/monitoreo/candelaria/switches" element={<Switches />} />
        <Route path="/monitoreo/ups" element={<Ups />} />
        <Route path="/monitoreo/candelaria/mesh" element={<Mesh />} />
        <Route path="/monitoreo/vpn" element={<Vpn />} />
        <Route path="/monitoreo/devices" element={<Devices />} />
        <Route path="/monitoreo/firewalls" element={<Firewalls />} />
        <Route path="/monitoreo/wan" element={<Wan />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/ups" element={<AdminUps />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/devices" element={<AdminDevices />} />
        <Route path="/admin/wan" element={<AdminWan />} />
        <Route path="/admin/switches" element={<AdminSwitches />} />
        <Route path="/admin/mesh" element={<AdminMesh />} />
        <Route path="/admin/firewalls" element={<AdminFirewalls />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/infrageneral/ap" element={<AdminAp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/monitoreo/pac/clientes" element={<DcsPac />} />
        <Route path="/monitoreo/ojos/clientes" element={<DcsOjos />} />
        {/* <Route path="/monitoreo/infraestrucura-general" element={<InfraGeneral />} /> */}
        <Route
          path="/monitoreo/infraestrucura-general/detalles"
          element={<DetailsCore />}
        />
        <Route path="/monitoreo/infraestrucura-general/map" element={<Map />} />
        <Route
          path="/monitoreo/infraestrucura-general"
          element={<MainTopology />}
        />
        <Route
          path="/monitoreo/infraestrucura-general/categorias"
          element={<Categories />}
        />
      </Routes>

      <div className="refresh-button-container">
        <button
          className="refresh-button"
          onClick={toggleTimer}
          title={
            timerActive
              ? "Pausar Autorefresco de la página"
              : "Activar Autorefresco de la página"
          }
        >
          {timerActive ? (
            <FontAwesomeIcon icon={faPause} /> // Icono de Pause
          ) : (
            <FontAwesomeIcon icon={faPlay} /> // Icono de Play
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
