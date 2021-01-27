const { ApolloServer, gql } = require("apollo-server");

const typeDefs = require("./database/typeDefs");
const resolvers = require("./database/resolvers");

const connectDB = require("./config/db");

// Connect to database.
connectDB();

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});
 
// Initiate Server
server.listen().then(({ url }) => {
  console.log(`Server ready in the URL ${url}`);
});
