import { Navbar } from "../Navbar/Navbar";
import { Status_System } from "../Status_System/Status_System";
import { Dashboard } from '../CandelariaClients/Dashboard/Dashboard';
import { TableSwitches } from '../CandelariaSwitches/TableSwitches/TableSwitches';

export function Switches() {
  const switchesTable = 'sw';
  
  return (
    <>
      <Navbar title={'Candelaria'} />
      <Status_System tableToShow={switchesTable}/>
      <Dashboard />
      <TableSwitches />
    </>
  );
}
