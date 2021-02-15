const { ApolloServer } = require("apollo-server");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const typeDefs = require("./database/typeDefs");
const resolvers = require("./database/resolvers");

const connectDB = require("./config/db");

// Connect to database.
connectDB();

const secret = process.env.SECRET;

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";

    // Verify if the token is valid.
    if (token) {
      try {
        const user = jwt.verify(token, secret);

        return {
          user,
        };
      } catch (error) {
        console.log(error);
      }
    }
  },
});

// Initiate Server
server.listen().then(({ url }) => {
  console.log(`Server ready in the URL ${url}`);
});
