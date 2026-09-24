const dns = require('node:dns').promises;

async function probarDNS() {
  try {
    const resultado = await dns.resolveSrv(
      '_mongodb._tcp.cluster0.cd7s9gz.mongodb.net'
    );

    console.log(resultado);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

probarDNS();