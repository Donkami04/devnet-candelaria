import { Navbar } from "../../Navbar/Navbar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Asegúrate de importar Link desde react-router-dom
import {
  getInterfaces,
  getSystemHealth,
  getNeighbors,
  getDefaultRoute,
  getDataInfGen,
  getAp,
} from "../../../utils/Api-candelaria/api";
import { useDataInfGen } from "../../../hooks/useDataInfGen";
import { DataCore } from "../DataCore/DataCore";
import { Status_System } from "../../Status_System/Status_System";
import { Spinner } from "../../Spinner/Spinner";
import "./Categories.css";

export function Categories() {
  const [coresUp, setCoresUp] = useState([]);
  const [coresDown, setCoresDown] = useState([]);
  const [distUp, setDistUp] = useState([]);
  const [distDown, setDistDown] = useState([]);
  const [apUp, setApUp] = useState([]);
  const [apDown, setApDown] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataStatusInfGen = await useDataInfGen();

        const newCoresUp = [];
        const newDistUp = [];
        const newApUp = [];

        const newCoresDown = [];
        const newDistDown = [];
        const newApDown = [];

        dataStatusInfGen.upElements.forEach((e) => {
          if (e.name_switch && e.name_switch.includes("CORE")) {
            newCoresUp.push(e);
          }
          if (e.name_switch && e.name_switch.includes("DIST")) {
            newDistUp.push(e);
          }
          if (
            e.last_disconnect_reason &&
            e.status === "Joined"
          ) {
            newApUp.push(e);
          }
        });

        dataStatusInfGen.downElements.forEach((e) => {
          if (e.name_switch && e.name_switch.includes("CORE")) {
            newCoresDown.push(e);
          }
          if (e.name_switch && e.name_switch.includes("DIST")) {
            newDistDown.push(e);
          }
          if (
            e.last_disconnect_reason &&
            e.status !== "Joined"
          ) {
            newApDown.push(e);
          }
        });

        setCoresUp(newCoresUp);
        setDistUp(newDistUp);
        setCoresDown(newCoresDown);
        setDistDown(newDistDown);
        setApUp(newApUp);
        setApDown(newApDown);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar title={"Categorias Inf. Gen."} />
      <Status_System tableToShow={"ig"} />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="table-ig-categories-container">
          <table>
            <thead>
              <tr>
                <th style={{ backgroundColor: "#444444", color: "white" }}>
                  Categoria
                </th>
                <th className="kpi-green">Up</th>
                <th className="kpi-red">Down</th>
                <th style={{ backgroundColor: "#444444", color: "white" }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general?categoria=core">
                    CORE
                  </Link>
                </td>
                <td>{coresUp.length}</td>
                <td>{coresDown.length}</td>
                <td>{coresUp.length + coresDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general?categoria=dist">
                    DIST
                  </Link>
                </td>
                <td>{distUp.length}</td>
                <td>{distDown.length}</td>
                <td>{distUp.length + distDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general/detalles/ap">
                    AP
                  </Link>
                </td>
                <td>{apUp.length}</td>
                <td>{apDown.length}</td>
                <td>{apUp.length + apDown.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
