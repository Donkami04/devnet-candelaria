export function ItCoreAdm({
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

  //! Agregar Red a las interfaces y system health
  devicesInterfaces.forEach((element) => {
    if (
      (element.name_switch === "ADMIN" &&
        element.status === "Up" &&
        element.red === "it") ||
      (element.name_switch === "ADMIN" &&
        element.status.toLowerCase().includes("Paused") &&
        element.red === "it")
    ) {
      interfacesUp.push(element);
    }
    if (
      element.name_switch === "ADMIN" &&
      element.status.includes("Down") &&
      element.red === "it"
    ) {
      interfacesDown.push(element);
    }
  });

  neighbors.forEach((element) => {
    if (
      element.name === "ADMIN" &&
      element.status === "Up" &&
      element.neighbor === "bgp" &&
      element.red === "it"
    ) {
      neighborsBgpUp.push(element);
    }
    if (
      element.name === "ADMIN" &&
      element.status === "Down" &&
      element.neighbor === "bgp" &&
      element.red === "it"
    ) {
      neighborsBgpDown.push(element);
    }
    if (
      element.name === "ADMIN" &&
      element.status === "Up" &&
      element.neighbor === "eigrp" &&
      element.red === "it"
    ) {
      neighborsEigrpUp.push(element);
    }
    if (
      element.name === "ADMIN" &&
      element.status === "Down" &&
      element.neighbor === "eigrp" &&
      element.red === "it"
    ) {
      neighborsEigrpDown.push(element);
    }
    if (
      element.name === "ADMIN" &&
      element.status === "Up" &&
      element.neighbor === "ospf" &&
      element.red === "it"
    ) {
      neighborsOspfUp.push(element);
    }
    if (
      element.name === "ADMIN" &&
      element.status === "Down" &&
      element.neighbor === "ospf" &&
      element.red === "it"
    ) {
      neighborsOspfDown.push(element);
    }
  });

  devicesHealth.forEach((element) => {
    if (
      element.name_switch === "ADMIN" &&
      element.red === "it" &&
      element.status === "Up" &&
      element.name.includes("CPU") &&
      parseInt(element.lastvalue) <= 90
    ) {
      listDevicesHealthOk.push(element);
    }
    if (
      (element.name_switch === "ADMIN" &&
        element.red === "it" &&
        element.name.includes("CPU") &&
        parseInt(element.lastvalue) > 90) ||
      (element.name_switch === "ADMIN" &&
        element.red === "it" &&
        element.name === "System Health CPU" &&
        element.status.includes("Down"))
    ) {
      listDevicesHealthFail.push(element);
    }
    if (
      element.name_switch === "ADMIN" &&
      element.red === "it" &&
      element.status === "Up" &&
      element.name.includes("Power Supplies") &&
      element.lastvalue === "Normal"
    ) {
      listDevicesHealthOk.push(element);
    }
    if (
      (element.name_switch === "ADMIN" &&
        element.red === "it" &&
        element.name.includes("Power Supplies") &&
        element.lastvalue !== "Normal") ||
      (element.name_switch === "ADMIN" &&
        element.red === "it" &&
        element.name.includes("Power Supplies") &&
        element.status.includes("Down"))
    ) {
      listDevicesHealthFail.push(element);
    }
    if (
      element.name_switch === "ADMIN" &&
      element.red === "it" &&
      element.status === "Up" &&
      element.name.includes("Temperatures") &&
      parseInt(element.lastvalue) < 50
    ) {
      listDevicesHealthOk.push(element);
    }
    if (
      (element.name_switch === "ADMIN" &&
        element.red === "it" &&
        element.name.includes("Temperatures") &&
        parseInt(element.lastvalue) >= 50) ||
      (element.name_switch === "ADMIN" &&
        element.red === "it" &&
        element.name.includes("Temperatures") &&
        element.status.includes("Down"))
    ) {
      listDevicesHealthFail.push(element);
    }
    // if (
    //     element.name_switch === "ADMIN" &&
    //     element.red === "it" &&
    //     element.status === "Up"
    //   ) {
    //     listDevicesHealthOk.push(element);
    //   }
  });

  const numAdmInterfUp = interfacesUp.length;
  const numAdmInterfDown = interfacesDown.length;
  const statusInterfaces = numAdmInterfDown > 0 ? "FAIL" : "OK";

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
    return e.name === "ADMIN" && e.via_bgp === "true";
  });

  const statusRouteDefault = routeDefault.length > 0 ? "OK" : "FAIL";

  return (
    <div>
      <div className="section-infra-general-container">
        <table>
          <thead>
            <tr>
              <th>CORE ADM IT - 10.224.127.1</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Interfaces: {numAdmInterfUp}/{numAdmInterfUp + numAdmInterfDown}
                <div>
                  {interfacesDown.map((e) => (
                    <div key={e.id + e.id_prtg}>
                      <p>{e.name} - {e.status}</p>
                    </div>
                  ))}
                </div>
              </td>
              <td>{statusInterfaces}</td>
            </tr>
            <tr>
              <td>
                System Health: {numSysHealthOk}/
                {numSysHealthOk + numSysHealthFail}
                <div>
                  {listDevicesHealthFail.map((e) => (
                    <div key={e.id + e.id_prtg}>
                      <p>
                        {e.name} - {e.lastvalue}
                      </p>
                    </div>
                  ))}
                </div>
              </td>
              <td>{statusSysHealth}</td>
            </tr>
            <tr>
              <td>
                Neighbor BGP: {numBgpUp}/{numBgpUp + numBgpDown}
                <div>
                  {neighborsBgpDown.map((e) => (
                    <div key={e.id + e.ip_neighbor}>
                      <p>
                        {e.ip_neighbor} - {e.interface}
                      </p>
                    </div>
                  ))}
                </div>
              </td>
              <td>{statusBgp}</td>
            </tr>
            <tr>
              <td>
                Neighbor EIGRP: {numEigrpUp}/{numEigrpUp + numEigrpDown}
                <div>
                  {neighborsEigrpDown.map((e) => (
                    <div key={e.id + e.ip_neighbor}>
                      <p>
                        {e.ip_neighbor} - {e.interface}
                      </p>
                    </div>
                  ))}
                </div>
              </td>
              <td>{statusEigrp}</td>
            </tr>
            <tr>
              <td>
                Neighbor OSPF: {numOspfUp}/{numOspfUp + numOspfDown}
                <div>
                  {neighborsOspfDown.map((e) => (
                    <div key={e.id + e.ip_neighbor}>
                      <p>
                        {e.ip_neighbor} - {e.interface}
                      </p>
                    </div>
                  ))}
                </div>
              </td>
              <td>{statusOspf}</td>
            </tr>
            <tr>
              <td>Default Route "Via bgp 65001"</td>
              <td>{statusRouteDefault}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
