// import { FiSettings } from "react-icons/fi";
import { Navbar } from "../../Navbar/Navbar";
import { Link } from "react-router-dom";
import "./adminhome.css";

export const AdminHome = () => {
  const iconos = ["", "", "", "", "", "", ""];
  const linksTables = [
    "/admin/clients",
    "/admin/switches",
    "/admin/ups",
    "/admin/devices",
    "/admin/wan",
    "/admin/mesh",
    "/admin/firewalls",
  ];
  const titles = [
    "DCS Clientes Candelaria",
    "DCS Switches Candelaria",
    "UPS",
    "Camaras",
    "WAN",
    "MESH",
    "Firewalls - Canales Internet",
  ];

  return (
    <>
      <Navbar title={'Admin Devnet'}/>
      <div className="main-admin-home">
        <div className="contenedor">
          {iconos.map((icono, index) => (
            <Link to={linksTables[index]} style={{ textDecoration: "none" }}>
              <div key={index} className="icono-contenedor">
                <h2>{titles[index]}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
