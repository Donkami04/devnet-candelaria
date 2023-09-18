import React from 'react';
import { Navbar } from '../Navbar/Navbar';
import { SectionVpn } from './SectionVpn/SectionVpn';
import { Status_System } from '../Status_System/Status_System';
import { useVpnCounter } from '../../hooks/useVpnCounter';
import './vpn.css';

export function Vpn() {
  const tableToShow = 'vpn';
  const { vpn1Users, vpn2Users, vpn3Users } = useVpnCounter();

  return (
    <div>
      <Navbar title={'Monitoreo VPN'} />
      <Status_System tableToShow={tableToShow} />
      <main className='sections-container'>
        <SectionVpn vpnNum={1} usersNumber={vpn1Users.number} users={vpn1Users.users} />
        <SectionVpn vpnNum={2} usersNumber={vpn2Users.number} users={vpn2Users.users} />
        <SectionVpn vpnNum={3} usersNumber={vpn3Users.number} users={vpn3Users.users} />
      </main>
    </div>
  );
}
