import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { Dashboard } from "./Dashboard/Dashboard";
import { TableClients } from "./TableClients/TableClients";
import { Button } from "../Button/Button";

export function CandelariaClients() {
  const clientsTable = "dcs";

  return (
    <>
      <Navbar title={"Clientes Candelaria"} />
      <Status_System tableToShow={clientsTable} />
      <Button interfaz={'switches'} buttonTag={'Switches'}/>
      <Dashboard />
      <TableClients />
    </>
  );
}
