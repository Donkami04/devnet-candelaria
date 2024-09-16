import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { Dashboard } from "../CandelariaClients/Dashboard/Dashboard";
import { TableSwitches } from "./TableSwitches/TableSwitches";
import { Button } from "../Button/Button";

export function Switches() {
  const switchesTable = "sw";

  return (
    <>
      <Navbar title={"DCS Candelaria - Switches"} />
      <Status_System tableToShow={switchesTable} />
      <Button interfaz={"clients"} buttonTag={"Clientes"} />
      <Dashboard />
      <TableSwitches />
    </>
  );
}
