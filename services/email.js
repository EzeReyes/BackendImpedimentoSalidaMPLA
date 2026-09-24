// const nodemailer = require("nodemailer");
// require('dotenv').config({ path: '.env' });

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// const enviarCodigo = async (email, code) => {
//   await transporter.sendMail({
//     from: `"Sistema de Buques con Deficiencias ITEC-MPLA" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Código de inicio de sesión",

//     html: `
//       <div style="
//         font-family: Arial, sans-serif;
//         max-width: 500px;
//         margin: auto;
//         padding: 30px;
//       ">

//         <h2>Inicio de sesión</h2>

//         <p>
//           Utilizá el siguiente código para iniciar sesión:
//         </p>

//         <div style="
//           font-size: 32px;
//           font-weight: bold;
//           letter-spacing: 8px;
//           text-align: center;
//           padding: 20px;
//           background: #f3f4f6;
//           border-radius: 10px;
//         ">
//           ${code}
//         </div>

//         <p>
//           Este código vence en 10 minutos.
//         </p>

//         <p>
//           Si no solicitaste este código, podés ignorar este email.
//         </p>

//       </div>
//     `,  });
// };

// module.exports = enviarCodigo;

// Servicio de email para enviar códigos de inicio de sesión a los usuarios. Utiliza nodemailer y Gmail como proveedor de correo electrónico. El código se envía en un formato HTML con estilo para que sea más legible y atractivo visualmente.