import { useState, useEffect } from 'react';
import { getVpn } from '../utils/Api-candelaria/api';

export function useVpnCounter() {
  const [vpnData, setVpnData] = useState({
    vpn1Users: [],
    vpn2Users: [],
    vpn3Users: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vpnDataResponse = await getVpn();
        setVpnData({
          vpn1Users: vpnDataResponse.vpn_1,
          vpn2Users: vpnDataResponse.vpn_2,
          vpn3Users: vpnDataResponse.vpn_3,
        });
      } catch (error) {
        console.error('Error al obtener el listado de Usuarios VPN:', error);
      }
    };
    fetchData();
  }, []);

  return vpnData;
}
