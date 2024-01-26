import { Navbar } from "../../Navbar/Navbar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // Asegúrate de importar Link desde react-router-dom
import {
  getInterfaces,
  getSystemHealth,
  getNeighbors,
  getDefaultRoute,
  getDataInfGen,
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataStatusInfGen = await useDataInfGen();
        const newCoresUp = [];
        const newDistUp = [];
        const newCoresDown = [];
        const newDistDown = [];

        dataStatusInfGen.upElements.forEach((e) => {
          if (e.name_switch.includes("CORE")) {
            newCoresUp.push(e);
          }
          if (e.name_switch.includes("DIST")) {
            newDistUp.push(e);
          }
        });

        dataStatusInfGen.downElements.forEach((e) => {
          if (e.name_switch.includes("CORE")) {
            newCoresDown.push(e);
          }
          if (e.name_switch.includes("DIST")) {
            newDistDown.push(e);
          }
        });

        setCoresUp(newCoresUp);
        setDistUp(newDistUp);
        setCoresDown(newCoresDown);
        setDistDown(newDistDown);
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
                <th style={{backgroundColor: "#444444", color: "white"}}>Categoria</th>
                <th className="kpi-green">Up</th>
                <th className="kpi-red">Down</th>
                <th style={{backgroundColor: "#444444", color: "white"}}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link to="/monitoreo/infraestrucura-general?categoria=core">CORE</Link>
                </td>
                <td>{coresUp.length}</td>
                <td>{coresDown.length}</td>
                <td>{coresUp.length + coresDown.length}</td>
              </tr>
              <tr>
                <td>
                  <Link to="/monitoreo/infraestrucura-general?categoria=dist">DIST</Link>
                </td>
                <td>{distUp.length}</td>
                <td>{distDown.length}</td>
                <td>{distUp.length + distDown.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
