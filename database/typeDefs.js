const { gql } = require("apollo-server");

// Schema - Type definitions
const typeDefs = gql`
  type Query {
    obtainCourse: String
  }
`;

module.exports = typeDefs;
