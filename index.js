const { ApolloServer, gql } = require("apollo-server");

const typeDefs = require("./database/schema");
const resolvers = require("./database/resolvers");

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Initiate Server
server.listen().then(({ url }) => {
  console.log(`Server ready in the URL ${url}`);
});
