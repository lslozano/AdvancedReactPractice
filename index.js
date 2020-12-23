const { ApolloServer, gql } = require('apollo-server');

// Server
const server = new ApolloServer();

// Initiate Server
server.listen().then(({ url })=> {
  console.log(`Server ready in the URL ${url}`)
});