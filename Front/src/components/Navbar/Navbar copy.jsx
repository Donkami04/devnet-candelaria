import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

export function Navbar(props) {
  const [jwtToken, setJwtToken] = useState(null);

  const getJwtTokenFromLocalStorage = () => {
    const token = localStorage.getItem("jwtToken");
    setJwtToken(token || null);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setJwtToken(null);
  };

  useEffect(() => {
    getJwtTokenFromLocalStorage();
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/monitoreo/home">
          <img src="/candelaria.png" alt="Logo" />
        </Link>
      </div>
      <Link
        to="/monitoreo/home"
        className="home-link"
        style={{ color: "white" }}
      >
        Home
      </Link>
      <h1 className="main-title">{props.title}</h1>

      {jwtToken ? (
        <div className="box-buttons-navbar">
          <Link
            to="/admin/home"
            className="admin-link"
            style={{ color: "white" }}
          >
            Admin
          </Link>
          <Link
            onClick={logout}
            to="/monitoreo/home"
            className="admin-link"
            style={{ color: "white" }}
          >
            Log Out
          </Link>
        </div>
      ) : (
        <div className="box-buttons-navbar">
          <Link to="/login" className="admin-link login-link" style={{ color: "white" }}>
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
