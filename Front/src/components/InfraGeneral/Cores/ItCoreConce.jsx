import "./Cores.css";

export function ItCoreConce({
  devicesInterfaces,
  devicesHealth,
  neighbors,
  routeStatus,
}) {
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

  devicesInterfaces.forEach((element) => {
    if (
      (element.name_switch === "CONCE" &&
        element.status === "Up" &&
        element.red === "it") ||
      (element.name_switch === "CONCE" &&
        element.status.toLowerCase().includes("Paused") &&
        element.red === "it")
    ) {
      interfacesUp.push(element);
    }
    if (
      element.name_switch === "CONCE" &&
      element.status.includes("Down") &&
      element.red === "it"
    ) {
      interfacesDown.push(element);
    }
  });

  neighbors.forEach((element) => {
    if (
      element.name === "CONCE" &&
      element.status === "Up" &&
      element.neighbor === "bgp" &&
      element.red === "it"
    ) {
      neighborsBgpUp.push(element);
    }
    if (
      element.name === "CONCE" &&
      element.status === "Down" &&
      element.neighbor === "bgp" &&
      element.red === "it"
    ) {
      neighborsBgpDown.push(element);
    }
    if (
      element.name === "CONCE" &&
      element.status === "Up" &&
      element.neighbor === "eigrp" &&
      element.red === "it"
    ) {
      neighborsEigrpUp.push(element);
    }
    if (
      element.name === "CONCE" &&
      element.status === "Down" &&
      element.neighbor === "eigrp" &&
      element.red === "it"
    ) {
      neighborsEigrpDown.push(element);
    }
    if (
      element.name === "CONCE" &&
      element.status === "Up" &&
      element.neighbor === "ospf" &&
      element.red === "it"
    ) {
      neighborsOspfUp.push(element);
    }
    if (
      element.name === "CONCE" &&
      element.status === "Down" &&
      element.neighbor === "ospf" &&
      element.red === "it"
    ) {
      neighborsOspfDown.push(element);
    }
  });

  devicesHealth.forEach((element) => {
    if (
      element.name_switch === "CONCE" &&
      element.red === "it" &&
      element.status === "Up" &&
      element.name.includes("CPU") &&
      parseInt(element.lastvalue) <= 90
    ) {
      listDevicesHealthOk.push(element);
    }
    if (
      (element.name_switch === "CONCE" &&
        element.red === "it" &&
        element.name.includes("CPU") &&
        parseInt(element.lastvalue) > 90) ||
      (element.name_switch === "CONCE" &&
        element.red === "it" &&
        element.name === "System Health CPU" &&
        element.status.includes("Down"))
    ) {
      listDevicesHealthFail.push(element);
    }
    if (
      element.name_switch === "CONCE" &&
      element.red === "it" &&
      element.status === "Up" &&
      element.name.includes("Power Supplies") &&
      element.lastvalue === "Normal"
    ) {
      listDevicesHealthOk.push(element);
    }
    if (
      (element.name_switch === "CONCE" &&
        element.red === "it" &&
        element.name.includes("Power Supplies") &&
        element.lastvalue !== "Normal") ||
      (element.name_switch === "CONCE" &&
        element.red === "it" &&
        element.name.includes("Power Supplies") &&
        element.status.includes("Down"))
    ) {
      listDevicesHealthFail.push(element);
    }
    if (
      element.name_switch === "CONCE" &&
      element.red === "it" &&
      element.status === "Up" &&
      element.name.includes("Temperatures") &&
      parseInt(element.lastvalue) < 50
    ) {
      listDevicesHealthOk.push(element);
    }
    if (
      (element.name_switch === "CONCE" &&
        element.red === "it" &&
        element.name.includes("Temperatures") &&
        parseInt(element.lastvalue) >= 50) ||
      (element.name_switch === "CONCE" &&
        element.red === "it" &&
        element.name.includes("Temperatures") &&
        element.status.includes("Down"))
    ) {
      listDevicesHealthFail.push(element);
    }
  });

  const numConceInterfUp = interfacesUp.length;
  const numConceInterfDown = interfacesDown.length;
  const statusInterfaces = numConceInterfDown > 0 ? "FAIL" : "OK";

  const numBgpUp = neighborsBgpUp.length;
  const numBgpDown = neighborsBgpDown.length;
  const statusBgp = numBgpDown > 0 ? "FAIL" : "OK";

  const numEigrpUp = neighborsEigrpUp.length;
  const numEigrpDown = neighborsEigrpDown.length;
  const statusEigrp = numEigrpDown > 0 ? "FAIL" : "OK";

  const numOspfUp = neighborsOspfUp.length;
  const numOspfDown = neighborsOspfDown.length;
  const statusOspf = numOspfDown > 0 ? "FAIL" : "OK";

  const numSysHealthOk = listDevicesHealthOk.length;
  const numSysHealthFail = listDevicesHealthFail.length;
  const statusSysHealth = numSysHealthFail > 0 ? "FAIL" : "OK";

  const routeDefault = routeStatus.filter((e) => {
    return e.name === "CONCE" && e.via_bgp === "true";
  });

  const statusRouteDefault = routeDefault.length > 0 ? "OK" : "FAIL";

  return (
    <>
      <div className="table-infra-general-container">
        <table className="table-core">
          <thead>
            <tr>
              <th>SW-CORE CONCE IT 10.224.127.2</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Interfaces: {numConceInterfUp}/
                {numConceInterfUp + numConceInterfDown}
                <div className="fail-elements-container">
                  {interfacesDown.map((e) => (
                    <p key={e.id + e.id_prtg}>
                      {e.name} - {e.status}
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
            <tr>
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
            <tr>
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
            <tr>
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
            <tr>
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
            <tr>
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
    </>
  );
}
