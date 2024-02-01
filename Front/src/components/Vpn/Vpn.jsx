import { useState, useEffect } from "react";
import { Navbar } from "../Navbar/Navbar";
import { SectionVpn } from "./SectionVpn/SectionVpn";
import { Status_System } from "../Status_System/Status_System";
import { useVpnCounter } from "../../hooks/useVpnCounter";
import { Spinner } from "../Spinner/Spinner";
import "./vpn.css";

export function Vpn() {
  const tableToShow = "vpn";

  const [vpn1Users, setVpn1Users] = useState({});
  const [vpn2Users, setVpn2Users] = useState({});
  const [vpn3Users, setVpn3Users] = useState({});
  const [vpn1UsersNumber, setVpn1UsersNumber] = useState({});
  const [vpn2UsersNumber, setVpn2UsersNumber] = useState({});
  const [vpn3UsersNumber, setVpn3UsersNumber] = useState({});
  const [showSpinner, setShowSpinner] = useState(true);
  const { dataVpn1Users, dataVpn2Users, dataVpn3Users } = useVpnCounter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setVpn1Users(dataVpn1Users.users);
        setVpn2Users(dataVpn2Users.users);
        setVpn3Users(dataVpn3Users.users);
        setVpn1UsersNumber(dataVpn1Users.number);
        setVpn2UsersNumber(dataVpn2Users.number);
        setVpn3UsersNumber(dataVpn3Users.number);
        setShowSpinner(false);
      } catch (error) {
        console.error("Error al obtener el listado de VPN:", error);
        return error;
      }
    };
    fetchData();
  }, [dataVpn1Users, dataVpn2Users, dataVpn3Users]);

  if (showSpinner) {
    return (
      <div>
        <Navbar title={"Monitoreo VPN"} />
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar title={"Monitoreo VPN"} />
      <Status_System tableToShow={tableToShow} />
      <main className="sections-container">
        <SectionVpn
          vpnNum={1}
          usersNumber={vpn1UsersNumber}
          users={vpn1Users}
        />
        <SectionVpn
          vpnNum={2}
          usersNumber={vpn2UsersNumber}
          users={vpn2Users}
        />
        <SectionVpn
          vpnNum={3}
          usersNumber={vpn3UsersNumber}
          users={vpn3Users}
        />
      </main>
    </div>
  );
}
