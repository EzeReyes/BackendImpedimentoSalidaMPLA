require('dotenv').config({ path: '.env' });
const enviarCodigo = require('./services/email.js');
const probar = async () => {

  try {

    await enviarCodigo(
      "ese.reyes1992.2@gmail.com",
      "483921"
    );

    console.log(
      "Email enviado correctamente"
    );

  } catch (error) {

    console.error(
      "Error enviando email:",
      error
    );

  }
};

probar();