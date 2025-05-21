const express = require("express");
const router = express.Router();
const transporter = require("../config/smtp");

router.post("/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    const info = await transporter.sendMail({
      from: '"Devnet" <email>',
      to,
      subject,
      text,
      html,
    });

    return res.json({ message: "Correo enviado", messageId: info.messageId });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ error: "No se pudo enviar el correo" });
  }
});

module.exports = router;
