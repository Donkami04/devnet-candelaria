import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { TableClientsOjos } from "./TableClientsOjos/TableClientsOjos";

export function DcsOjos() {
  const clientsTable = "dcs";

  return (
    <>
      <Navbar title={"DCS OJOS - Clientes"} />
      <TableClientsOjos />
    </>
  );
}
