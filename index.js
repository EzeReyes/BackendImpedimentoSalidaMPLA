const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express4");

const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const conectarDB = require("./config/db");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();


app.use(
  cors({
    origin: process.env.FRONT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Middlewares
app.use(cookieParser());

app.use(express.json());

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  try {
    await conectarDB();

    await server.start();

    app.use(
      "/graphql",
      expressMiddleware(server, {
      context: async ({ req, res }) => {
      return { req, res }; 
      },     
    })
    );

    app.listen(4000, () => {
      console.log("Servidor funcionando en http://localhost:4000");
      console.log("GraphQL en http://localhost:4000/graphql");
    });
  } catch (error) {
    console.error("Error iniciando servidor:", error);
  }
};

startServer();
