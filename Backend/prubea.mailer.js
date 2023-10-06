const nodemailer = require('nodemailer');

// Configuración de Nodemailer basada en la configuración de main.cf
const transporter = nodemailer.createTransport({
  host: '127.0.0.1', // La dirección IP o el nombre de host de tu servidor Postfix
  port: 25, // El puerto SMTP que estás utilizando
  secure: false, // Puedes configurarlo como true si estás utilizando SSL/TLS
  ignoreTLS: true, // Puedes configurarlo como false si estás utilizando SSL/TLS
});

// Función para enviar correo
async function enviarCorreo() {
  try {
    // Configuración del correo electrónico
    const info = await transporter.sendMail({
      from: 'tu@correo.com', // Remitente
      to: 'kaka0404@yopmail.com', // Destinatario
      subject: 'Asunto del correo',
      text: 'Contenido del correo en texto plano',
      html: '<p>Contenido del correo en formato HTML</p>',
    });

    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

// Llama a la función para enviar el correo
enviarCorreo();
