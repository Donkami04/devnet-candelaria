import "./DataCore.css";
import { PRTG_URL } from "../../../utils/Api-candelaria/api";

export function DataCore({ dataList, swName }) {
  const interfacesUp = [];
  const interfacesDown = [];

  const neighborsBgpUp = [];
  const neighborsBgpDown = [];

  const neighborsEigrpUp = [];
  const neighborsEigrpDown = [];

  const neighborsOspfUp = [];
  const neighborsOspfDown = [];

  const listDevicesHealthOk = [];
  const listDevicesHealthFail = [];

  dataList.forEach((element) => {
    if (element.name && element.name.includes("Traffic")) {
      if (
        (element.name_switch === swName && element.status === "Up") ||
        (element.name_switch === swName &&
          element.status.toLowerCase().includes("paused"))
      ) {
        interfacesUp.push(element);
      }

      if (element.name_switch === swName && element.status.includes("Down")) {
        interfacesDown.push(element);
      }
    }
  });

  dataList.forEach((element) => {
    if (element.neighbor) {
      if (
        element.name_switch === swName &&
        element.status === "Up" &&
        element.neighbor === "bgp" &&
        element.red === "it"
      ) {
        neighborsBgpUp.push(element);
      }
      if (
        element.name_switch === swName &&
        element.status === "Down" &&
        element.neighbor === "bgp" &&
        element.red === "it"
      ) {
        neighborsBgpDown.push(element);
      }
      if (
        element.name_switch === swName &&
        element.status === "Up" &&
        element.neighbor === "eigrp" &&
        element.red === "it"
      ) {
        neighborsEigrpUp.push(element);
      }
      if (
        element.name_switch === swName &&
        element.status === "Down" &&
        element.neighbor === "eigrp" &&
        element.red === "it"
      ) {
        neighborsEigrpDown.push(element);
      }
      if (
        element.name_switch === swName &&
        element.status === "Up" &&
        element.neighbor === "ospf" &&
        element.red === "it"
      ) {
        neighborsOspfUp.push(element);
      }
      if (
        element.name_switch === swName &&
        element.status === "Down" &&
        element.neighbor === "ospf" &&
        element.red === "it"
      ) {
        neighborsOspfDown.push(element);
      }
    }
  });

  dataList.forEach((element) => {
    // Primer If es porque los neighbors no tienen `name`
    if (element.name && element.name.includes("System Health")) {
      if (
        element.name_switch === swName &&
        element.status === "Up" &&
        element.name.includes("CPU") &&
        parseInt(element.lastvalue) <= 90
      ) {
        listDevicesHealthOk.push(element);
      }
      if (
        (element.name_switch === swName &&
          element.name.includes("CPU") &&
          parseInt(element.lastvalue) > 90) ||
        (element.name_switch === swName &&
          element.name.includes("CPU") &&
          element.status.includes("Down"))
      ) {
        listDevicesHealthFail.push(element);
      }
      if (
        element.name_switch === swName &&
        element.status === "Up" &&
        element.name.includes("Power Supplies") &&
        element.lastvalue === "Normal"
      ) {
        listDevicesHealthOk.push(element);
      }
      if (
        (element.name_switch === swName &&
          element.name.includes("Power Supplies") &&
          element.lastvalue !== "Normal") ||
        (element.name_switch === swName &&
          element.name.includes("Power Supplies") &&
          element.status.includes("Down"))
      ) {
        listDevicesHealthFail.push(element);
      }
      if (
        element.name_switch === swName &&
        element.status === "Up" &&
        element.name.includes("Temperatures") &&
        parseInt(element.lastvalue) < 50
      ) {
        listDevicesHealthOk.push(element);
      }
      if (
        (element.name_switch === swName &&
          element.name.includes("Temperatures") &&
          parseInt(element.lastvalue) >= 50) ||
        (element.name_switch === swName &&
          element.name.includes("Temperatures") &&
          element.status.includes("Down"))
      ) {
        listDevicesHealthFail.push(element);
      }
    }
  });

  let showOrHideInterfaces = "";
  let showOrHideSysHealth = "";
  let showOrHideBgp = "";
  let showOrHideEigrp = "";
  let showOrHideOspf = "";
  let showOrHideRoute = "";

  const numAdmInterfUp = interfacesUp.length;
  const numAdmInterfDown = interfacesDown.length;
  let statusInterfaces = "";
  numAdmInterfDown > 0
    ? (statusInterfaces = "FAIL")
    : (statusInterfaces = "OK");
  if (numAdmInterfUp === 0 && numAdmInterfDown === 0) {
    showOrHideInterfaces = "hide";
  }

  const numBgpUp = neighborsBgpUp.length;
  const numBgpDown = neighborsBgpDown.length;
  let statusBgp = "";
  numBgpDown > 0 ? (statusBgp = "FAIL") : (statusBgp = "OK");
  if (numBgpUp === 0 && numBgpDown === 0) {
    showOrHideBgp = "hide";
  }

  const numEigrpUp = neighborsEigrpUp.length;
  const numEigrpDown = neighborsEigrpDown.length;
  let statusEigrp = "";
  numEigrpDown > 0 ? (statusEigrp = "FAIL") : (statusEigrp = "OK");
  if (numEigrpUp === 0 && numEigrpDown === 0) {
    showOrHideEigrp = "hide";
  }

  const numOspfUp = neighborsOspfUp.length;
  const numOspfDown = neighborsOspfDown.length;
  //   const statusOspf = numOspfDown > 0 ? "FAIL" : "OK";
  let statusOspf = "";
  numOspfDown > 0 ? (statusOspf = "FAIL") : (statusOspf = "OK");
  if (numOspfUp === 0 && numOspfDown === 0) {
    showOrHideOspf = "hide";
  }

  const numSysHealthOk = listDevicesHealthOk.length;
  const numSysHealthFail = listDevicesHealthFail.length;
  //   const statusSysHealth = numSysHealthFail > 0 ? "FAIL" : "OK";
  let statusSysHealth = "";
  numSysHealthFail > 0 ? (statusSysHealth = "FAIL") : (statusSysHealth = "OK");
  if (numSysHealthOk === 0 && numSysHealthFail === 0) {
    showOrHideSysHealth = "hide";
  }

  const routeDefault = dataList.filter((e) => {
    return e.via_bgp && e.name_switch === swName;
  });

  let statusRouteDefault = "";
  if (routeDefault.length === 0) {
    showOrHideRoute = "hide";
  }
  if (routeDefault.length > 0 && routeDefault[0].via_bgp === "true") {
    statusRouteDefault = "OK";
  }
  if (routeDefault.length > 0 && routeDefault[0].via_bgp === "false") {
    statusRouteDefault = "FAIL";
  }

  return (
    <div className="table-infra-general-container">
        <table className="table-core">
          <thead>
            <tr>
              <th>{`${swName}`}</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr className={showOrHideInterfaces}>
              <td>
                Interfaces: {numAdmInterfUp}/{numAdmInterfUp + numAdmInterfDown}
                <div className="fail-elements-container">
                  {interfacesDown.map((e) => (
                    <p key={e.id + e.id_prtg}>
                      {" "}
                      <a
                        style={{ textDecoration: "none", color: "red" }}
                        href={`${PRTG_URL}${e.id_prtg}`}
                        target="_blank"
                      >
                        {e.name} - {e.status}
                      </a>
                    </p>
                  ))}
                </div>
              </td>
              <td
                className={
                  statusInterfaces === "FAIL"
                    ? "status-fail-infra-gen"
                    : "status-ok-infra-gen"
                }
              >
                {statusInterfaces}
              </td>
            </tr>
            <tr className={showOrHideSysHealth}>
              <td>
                System Health: {numSysHealthOk}/
                {numSysHealthOk + numSysHealthFail}
                <div className="fail-elements-container">
                  {listDevicesHealthFail.map((e) => (
                    <p key={e.id + e.id_prtg}>
                      {e.name} - {e.lastvalue}
                    </p>
                  ))}
                </div>
              </td>
              <td
                className={
                  statusSysHealth === "FAIL"
                    ? "status-fail-infra-gen"
                    : "status-ok-infra-gen"
                }
              >
                {statusSysHealth}
              </td>
            </tr>
            <tr className={showOrHideBgp}>
              <td>
                Neighbor BGP: {numBgpUp}/{numBgpUp + numBgpDown}
                <div className="fail-elements-container">
                  {neighborsBgpDown.map((e) => (
                    <p key={e.id + e.ip_neighbor}>
                      {e.ip_neighbor} - {e.interface}
                    </p>
                  ))}
                </div>
              </td>
              <td
                className={
                  statusBgp === "FAIL"
                    ? "status-fail-infra-gen"
                    : "status-ok-infra-gen"
                }
              >
                {statusBgp}
              </td>
            </tr>
            <tr className={showOrHideEigrp}>
              <td>
                Neighbor EIGRP: {numEigrpUp}/{numEigrpUp + numEigrpDown}
                <div className="fail-elements-container">
                  {neighborsEigrpDown.map((e) => (
                    <p key={e.id + e.ip_neighbor}>
                      {e.ip_neighbor} - {e.interface}
                    </p>
                  ))}
                </div>
              </td>
              <td
                className={
                  statusEigrp === "FAIL"
                    ? "status-fail-infra-gen"
                    : "status-ok-infra-gen"
                }
              >
                {statusEigrp}
              </td>
            </tr>
            <tr className={showOrHideOspf}>
              <td>
                Neighbor OSPF: {numOspfUp}/{numOspfUp + numOspfDown}
                <div className="fail-elements-container">
                  {neighborsOspfDown.map((e) => (
                    <p key={e.id + e.ip_neighbor}>
                      {e.ip_neighbor} - {e.interface}
                    </p>
                  ))}
                </div>
              </td>
              <td
                className={
                  statusOspf === "FAIL"
                    ? "status-fail-infra-gen"
                    : "status-ok-infra-gen"
                }
              >
                {statusOspf}
              </td>
            </tr>
            <tr className={showOrHideRoute}>
              <td>Default Route "Via bgp 65001"</td>
              <td
                className={
                  statusRouteDefault === "FAIL"
                    ? "status-fail-infra-gen"
                    : "status-ok-infra-gen"
                }
              >
                {statusRouteDefault}
              </td>
            </tr>
          </tbody>
        </table>
    </div>
  );
}
