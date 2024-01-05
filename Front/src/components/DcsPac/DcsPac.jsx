import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { TableClientsPac } from "./TableClientsPac/TableClientsPac";

export function DcsPac() {
  const clientsTable = "dcs";

  return (
    <>
      <Navbar title={"DCS PAC - Clientes"} />
      <TableClientsPac />
    </>
  );
}
