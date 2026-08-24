const { ApolloServer, gql} = require ('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
const  transformDate = require('./tranformDate')

// servidor
const server = new ApolloServer({
    typeDefs,
    resolvers
});
conectarDB();
const dia = new Date("2026-07-12T20:39:31.899+00:00");
console.log(transformDate(dia));
// arrancar el servidor
server.listen().then( ({url}) => {
    console.log(`Servidor listo en la URL ${url}`);
})

