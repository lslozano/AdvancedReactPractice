const { gql } = require("apollo-server");

// Schema - Type definitions
const typeDefs = gql`
  type Course {
    title: String
  }
  type Technology {
    technology: String
  }
  type Query {
    obtainCourses: [Course]
    obtainTechnology: [Technology]
  }
`;

module.exports = typeDefs;