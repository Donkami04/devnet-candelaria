const text = "28-09-2024 20:18:46 [2 d 3 h 25 m ago]";

// Expresión regular para capturar la fecha y hora
const match = text.match(/(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2})/);

if (match) {
  const datetimeStr = match[1];
  const datetimeObj = new Date(datetimeStr.split("-").reverse().join("/")); // Convertir a formato Date
  console.log(datetimeObj);
} else {
  console.log("No se encontró una fecha y hora válida.");
}
