// const text = "28-09-2024 20:18:46 [2 d 3 h 25 m ago]";

// // Expresión regular para capturar la fecha y hora
// const match = text.match(/(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2})/);
// console.log(match);
// if (match.length > 0) {
//   const datetimeStr = match[0];
// //   const datetimeObj = new Date(datetimeStr.split("-").reverse().join("/")); // Convertir a formato Date
// const fecha1Format = new Date( datetimeStr.split(" ")[0].split("-").reverse().join("-") + "T" + datetimeStr.split(" ")[1] );
// console.log(fecha1Format);
// } else {
//     console.log("No se encontró una fecha y hora válida.");
// }

const a = "17-01-2025 03:12:50";
// const a = '28-09-2024 20:18:46';
const fecha1Format = new Date( a.split(" ")[0].split("-").reverse().join("-") + "T" + a.split(" ")[1] );

const b = "17-01-2025 03:12:51";
const fecha1Format2 = new Date( b.split(" ")[0].split("-").reverse().join("-") + "T" + b.split(" ")[1] );

const diferencia = Math.abs(fecha1Format2 - fecha1Format);

// 24 horas en milisegundos
const horas24 = 24 * 60 * 60 * 1000;

// Verificar si la diferencia es mayor o menor a 24 horas
if (diferencia > horas24) {
  console.log('La diferencia es mayor a 24 horas');
} else {
  console.log('La diferencia es menor a 24 horas');
}