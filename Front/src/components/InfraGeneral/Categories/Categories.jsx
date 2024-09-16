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
  const [fortigateAdminUp, setFortigateAdminUp] = useState([]);
  const [fortigateAdminDown, setFortigateAdminDown] = useState([]);
  const [fortigateConceUp, setFortigateConceUp] = useState([]);
  const [fortigateConceDown, setFortigateConceDown] = useState([]);
  const [sslUp, setSslUp] = useState([]);
  const [voiceUp, setVoiceUp] = useState([]);
  const [wirelessUp, setWirelessUp] = useState([]);
  const [iseUp, setIseUp] = useState([]);
  const [sslDown, setSslDown] = useState([]);
  const [voiceDown, setVoiceDown] = useState([]);
  const [wirelessDown, setWirelessDown] = useState([]);
  const [iseDown, setIseDown] = useState([]);
  const [lteUp, setLteUp] = useState([]);
  const [lteDown, setLteDown] = useState([]);
  const [cctvUp, setCctvUp] = useState([]);
  const [dockersUp, setDockersUp] = useState([]);
  const [fwItUp, setFwItUp] = useState([]);
  const [fwItDown, setFwItDown] = useState([]);
  const [fwOtUp, setFwOtUp] = useState([]);
  const [fwOtDown, setFwOtDown] = useState([]);
  const [cctvDown, setCctvDown] = useState([]);
  const [dockersDown, setDockersDownp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataStatusInfGen = await useDataInfGen();
        const newCoresUp = [];
        const newDistUp = [];
        const newFortigateAdminUp = [];
        const newFortigateConcenUp = [];
        const dataSslUp = [];
        const dataVoiceUp = [];
        const dataWirelessUp = [];
        const dataIseUp = [];
        const dataLteUp = [];
        const dataCctvUp = [];
        const dataFwItUp = [];
        const dataFwOtUp = [];
        const dataDockersUp = [];

        const newCoresDown = [];
        const newDistDown = [];
        const newFortigateAdminDown = [];
        const newFortigateConcenDown = [];
        const dataSslDown = [];
        const dataVoiceDown = [];
        const dataWirelessDown = [];
        const dataIseDown = [];
        const dataLteDown = [];
        const dataCctvDown = [];
        const dataFwItDown = [];
        const dataFwOtDown = [];
        const dataDockersDown = [];

        dataStatusInfGen.upElements.forEach((e) => {
          if (e.name_switch && e.name_switch.includes("CORE")) {
            newCoresUp.push(e);
          }
          if (
            (e.name_switch && e.name_switch.toLowerCase().includes("distri")) ||
            (e.rol && e.rol.toLowerCase().includes("distri"))
          ) {
            newDistUp.push(e);
          }
          if (e.name_switch === "FORTIGATE - ADMINISTRACIÓN") {
            newFortigateAdminUp.push(e);
          }
          if (e.name_switch === "FORTIGATE - CONCENTRADORA") {
            newFortigateConcenUp.push(e);
          }
          if (e.rol && e.rol.toLowerCase().includes("certificado")) {
            dataSslUp.push(e);
          }
          if (e.rol && e.rol.toLowerCase().includes("telefonia")) {
            dataVoiceUp.push(e);
          }
          if (e.rol && e.rol.toLowerCase().includes("ise")) {
            dataIseUp.push(e);
          }
          if (e.rol && e.rol.toLowerCase().includes("inalambricas")) {
            dataWirelessUp.push(e);
          }
          if (
            (e.rol && e.rol.toLowerCase().includes("lte")) ||
            (e.rol && e.rol.toLowerCase().includes("vmware"))
          ) {
            dataLteUp.push(e);
          }
          if (e.rol && e.rol.toLowerCase() === "cctv") {
            dataCctvUp.push(e);
          }
          if (e.rol && e.rol.toLowerCase() === "fw it") {
            dataFwItUp.push(e);
          }
          if (e.rol && e.rol.toLowerCase() === "fw ot") {
            dataFwOtUp.push(e);
          }
          if (e.type && e.type === "docker") {
            dataDockersUp.push(e);
          }
        });

        dataStatusInfGen.downElements.forEach((e) => {
          if (e.name_switch && e.name_switch.includes("CORE")) {
            newCoresDown.push(e);
          }
          if (
            (e.name_switch && e.name_switch.toLowerCase().includes("distri")) ||
            (e.rol && e.rol.toLowerCase().includes("distri"))
          ) {
            newDistDown.push(e);
          }
          if (e.name_switch === "FORTIGATE - ADMINISTRACIÓN") {
            newFortigateAdminDown.push(e);
          }
          if (e.name_switch === "FORTIGATE - CONCENTRADORA") {
            newFortigateConcenDown.push(e);
          }
          if (e.rol && e.rol.toLowerCase().includes("certificado")) {
            dataSslDown.push(e);
          }
          if (e.rol && e.rol.toLowerCase().includes("telefonia")) {
            dataVoiceDown.push(e);
          }
          if (e.rol && e.rol.toLowerCase().includes("ise")) {
            dataIseDown.push(e);
          }
          if (e.rol && e.rol.toLowerCase().includes("inalambricas")) {
            dataWirelessDown.push(e);
          }
          if (
            (e.rol && e.rol.toLowerCase().includes("lte")) ||
            (e.rol && e.rol.toLowerCase().includes("vmware"))
          ) {
            dataLteDown.push(e);
          }
          if (e.rol && e.rol.toLowerCase() === "cctv") {
            dataCctvDown.push(e);
          }
          if (e.rol && e.rol.toLowerCase() === "fw it") {
            dataFwItDown.push(e);
          }
          if (e.rol && e.rol.toLowerCase() === "fw ot") {
            dataFwOtDown.push(e);
          }
          if (e.type && e.type === "docker") {
            dataDockersDown.push(e);
          }
        });

        setCoresUp(newCoresUp);
        setDistUp(newDistUp);
        setCoresDown(newCoresDown);
        setDistDown(newDistDown);
        setFortigateAdminUp(newFortigateAdminUp);
        setFortigateAdminDown(newFortigateAdminDown);
        setFortigateConceUp(newFortigateConcenUp);
        setFortigateConceDown(newFortigateConcenDown);
        setSslUp(dataSslUp);
        setVoiceUp(dataVoiceUp);
        setWirelessUp(dataWirelessUp);
        setIseUp(dataIseUp);
        setSslDown(dataSslDown);
        setVoiceDown(dataVoiceDown);
        setWirelessDown(dataWirelessDown);
        setIseDown(dataIseDown);
        setIsLoading(false);
        setLteUp(dataLteUp);
        setLteDown(dataLteDown);
        setCctvUp(dataCctvUp);
        setCctvDown(dataCctvDown);
        setFwItUp(dataFwItUp);
        setFwItDown(dataFwItDown);
        setFwOtUp(dataFwOtUp);
        setFwOtDown(dataFwOtDown);
        setDockersUp(dataDockersUp);
        setDockersDownp(dataDockersDown);
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
                  <Link to="/monitoreo/infraestrucura-general?categoria=fortigate">
                    VPN SITE TO SITE
                  </Link>
                </td>
                <td>{fortigateAdminUp.length + fortigateConceUp.length}</td>
                <td>{fortigateAdminDown.length + fortigateConceDown.length}</td>
                <td>
                  {fortigateAdminUp.length +
                    fortigateAdminDown.length +
                    fortigateConceUp.length +
                    fortigateConceDown.length}
                </td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general/certificados">
                    Certificados Candelaria
                  </Link>
                </td>
                <td>{sslUp.length}</td>
                <td>{sslDown.length}</td>
                <td>{sslUp.length + sslDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general?categoria=telefonia">
                    Telefonia IP
                  </Link>
                </td>
                <td>{voiceUp.length}</td>
                <td>{voiceDown.length}</td>
                <td>{voiceUp.length + voiceDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general?categoria=ise">
                    Servidores ISE y PRIME
                  </Link>
                </td>
                <td>{iseUp.length}</td>
                <td>{iseDown.length}</td>
                <td>{iseUp.length + iseDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general?categoria=inalambricas">
                    Controladoras Inalambricas
                  </Link>
                </td>
                <td>{wirelessUp.length}</td>
                <td>{wirelessDown.length}</td>
                <td>{wirelessUp.length + wirelessDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general?categoria=lte">
                    LTE
                  </Link>
                </td>
                <td>{lteUp.length}</td>
                <td>{lteDown.length}</td>
                <td>{lteUp.length + lteDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general?categoria=cctv">
                    Sistema CCTV
                  </Link>
                </td>
                <td>{cctvUp.length}</td>
                <td>{cctvDown.length}</td>
                <td>{cctvUp.length + cctvDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general?categoria=fw%20it">
                    Firewalls IT
                  </Link>
                </td>
                <td>{fwItUp.length}</td>
                <td>{fwItDown.length}</td>
                <td>{fwItUp.length + fwItDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general?categoria=fw%20ot">
                    Firewalls OT
                  </Link>
                </td>
                <td>{fwOtUp.length}</td>
                <td>{fwOtDown.length}</td>
                <td>{fwOtUp.length + fwOtDown.length}</td>
              </tr>
              <tr>
                <td className="td-category-ig">
                  <Link to="/monitoreo/infraestrucura-general/procesos-devnet">
                    Procesos DevNet
                  </Link>
                </td>
                <td>{dockersUp.length}</td>
                <td>{dockersDown.length}</td>
                <td>{dockersUp.length + dockersDown.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
