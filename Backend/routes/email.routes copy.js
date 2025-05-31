// utils/sendEmail.js
const express = require("express");
const axios = require("axios");
const mjml = require("mjml");
const router = express.Router();
const { Resend } = require("resend");
const Handlebars = require("handlebars");
const fs = require("fs");

const resend = new Resend("re_ZDwv46aq_PTxJzvX1NLzdbZpDLyX7zJ1d");

router.post("/send-report", async (req, res) => {
  try {
    console.log("Enviando reporte de dispositivos...");
    const { data } = await axios.get("http://10.224.116.14:3001/api/v1/candelaria/indicators/devices");
    const d = data.data; // accedemos a la parte útil

    const rows = [
      { name: "CAMARAS", up: d.numCamerasUp, down: d.numCamerasDown, total: d.numTotalCameras },
      { name: "ACCESS POINTS", up: d.numApUp, down: d.numApDown, total: d.numTotalAp },
      { name: "IMPRESORAS", up: d.numImpresorasUp, down: d.numImpresorasDown, total: d.numTotalImpresoras },
      { name: "MAGIC INFO", up: d.numMagicUp, down: d.numMagicDown, total: d.numTotalMagic },
      { name: "CTRL DE ACCESO", up: d.numBarreraUp, down: d.numBarreraDown, total: d.numTotalBarrera },
      { name: "OTROS", up: d.numOthersUp, down: d.numOthersDown, total: d.numTotalOthers },
      {
        name: "TOTAL",
        up: d.numOthersUp + d.numBarreraUp + d.numMagicUp + d.numImpresorasUp + d.numApUp + d.numCamerasUp,
        down:
          d.numOthersDown + d.numBarreraDown + d.numMagicDown + d.numImpresorasDown + d.numApDown + d.numCamerasDown,
        total: d.numTotalDevices,
      },
    ];

    const templateRaw = fs.readFileSync("./utils/templates/email.mjml", "utf8");
    const template = Handlebars.compile(templateRaw);
    const mjmlWithData = template({ rows });
    const { html } = mjml(mjmlWithData);

    const result = await resend.emails.send({
      from: "Devnet <onboarding@resend.dev>",
      to: "juan.munera@sgtnetworks.com",
      subject: "Reporte Dispositivos Candelaria",
      html,
    });
    console.log("Respuesta de Resend:", result);

    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ error: "No se pudo enviar el correo" });
  }
});

module.exports = router;
