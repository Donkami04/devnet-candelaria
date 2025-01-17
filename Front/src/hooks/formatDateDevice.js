function obtenerFechaHoraChile() {
  const ahora = new Date();

  // Formatear la fecha
  const opcionesFecha = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Santiago",
  };
  const fecha = new Intl.DateTimeFormat("es-CL", opcionesFecha).format(ahora);

  // Obtener la hora en Chile
  const opcionesHora = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "America/Santiago",
  };
  const hora = new Intl.DateTimeFormat("es-CL", opcionesHora).format(ahora);

  return `${fecha} ${hora}`;
}

console.log(obtenerFechaHoraChile());
