import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Interfaces } from "./Interfaces/Interfaces";
import { SystemHealth } from "./SystemHealth/SystemHealth";
import { Neighbors } from "./Neighbors/Neighbors";
import { DefaultRoute } from "./RoutesDefault/RoutesDefault";

import "./infrageneral.css";

export function InfraGeneral() {
  return (
    <>
      <Navbar title={"Infraestructura General"} />
      <main className="main-infra-gen-container">
        <div className="section-infra-general-container">
          <Interfaces />
        </div>
        <div className="section-infra-general-container">
          <SystemHealth />
        </div>
        <div className="section-infra-general-container">
          <Neighbors />
        </div>
      </main>
      <div className="default-route-infra-general-container">
        <DefaultRoute />
      </div>
    </>
  );
}
