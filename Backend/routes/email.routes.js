// utils/sendEmail.js
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const { fetchDataDevices } = require("../utils/email/devices");
const { fetchDataDcs } = require("../utils/email/dcs");

// CONFIGURA aquí tu relay SMTP:
const transporter = nodemailer.createTransport({
  host: "10.224.98.53", // IP de tu relay SMTP
  // port: 25, // o 587 o 465 según tu relay
  secure: false, // true si usas puerto 465
  // auth: {
  //     user: 'usuario',  // si tu relay pide autenticación
  //     pass: 'contraseña'
  // }
});

router.post("/send-report", async (req, res) => {
  try {
    const dashDevices = await fetchDataDevices();
    const dashDcs = await fetchDataDcs();

    // Enviar el correo
    const info = await transporter.sendMail({
      from: "Devnet <v-j.munera@lundinmining.com>", // Usa un remitente válido para tu relay
      to: "juan.munera@sgtnetworks.com",
      subject: "Reporte Devnet Candelaria",
      html: dashDevices + dashDcs,
    });

    console.log("Correo enviado:", info.response);
    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ error: "No se pudo enviar el correo" });
  }
});

module.exports = router;
