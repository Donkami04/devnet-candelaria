// utils/sendEmail.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const { Resend } = require("resend");
const { fetchDataDevices } = require("../utils/email/devices");
const { fetchDataDcs } = require("../utils/email/dcs");

const resend = new Resend("re_ZDwv46aq_PTxJzvX1NLzdbZpDLyX7zJ1d");

router.post("/send-report", async (req, res) => {
  try {

    const dashDevices = await fetchDataDevices();
    const dashDcs = await fetchDataDcs();


    // Enviar el correo
    const result = await resend.emails.send({
      from: "Devnet <onboarding@resend.dev>",
      to: "juan.munera@sgtnetworks.com",
      subject: "Reporte Devnet Candelaria",
      html: dashDevices + dashDcs,
    });

    console.log("Respuesta de Resend:", result);
    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ error: "No se pudo enviar el correo" });
  }
});

module.exports = router;
