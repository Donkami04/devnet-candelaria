import { Navbar } from "../../Navbar/Navbar";
import { Link } from "react-router-dom";
import "./adminhome.css";

export const AdminHome = () => {
  const linksTables = [
    "/admin/clients",
    "/admin/switches",
    "/admin/ups",
    "/admin/devices",
    "/admin/wan",
    "/admin/mesh",
    "/admin/firewalls",
    "/admin/users"
  ];
  const titles = [
    "DCS Clientes Candelaria",
    "DCS Switches Candelaria",
    "UPS",
    "Dispositivos",
    "WAN",
    "MESH",
    "Firewalls - Canales Internet",
    "Usuarios"
  ];

  return (
    <>
      <Navbar title={"Admin Home"} />
      <div className="main-admin-home">
        <div className="info-admin-home">
          <h3>Seleccione uno de los sistemas que desea administrar.</h3>
        </div>
        <div className="admin-panel">
          <div className="buttons-admin-home-container">
            {titles.map((title, index) => (
              <Link to={linksTables[index]} style={{ textDecoration: "none" }} key={index}>
                <div className="buttons-admin-home">
                  <h2>{title}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
