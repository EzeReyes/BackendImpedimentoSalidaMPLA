const mongoose = require('mongoose');
const dns = require('dns');

require('dotenv').config();

dns.setServers(['1.1.1.1']);

const conectarDB = async () => {
  try {
    console.log('Intentando conectar a MongoDB...');

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('DB conectada correctamente');
  } catch (error) {
    console.error('Error al conectar la base de datos:');
    console.error('Nombre:', error.name);
    console.error('Mensaje:', error.message);

    process.exit(1);
  }
};

module.exports = conectarDB;
