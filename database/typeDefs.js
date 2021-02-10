const { gql } = require("apollo-server");

// Schema - Type definitions
const typeDefs = gql`
  # Data Types
  type User {
    id: ID
    name: String
    lastName: String
    email: String
    created: String
  }

  type Product {
    id: ID
    name: String
    stock: Int
    price: Float
    created: String
  }

  type Client {
    id: ID
    name: String
    lastName: String
    company: String
    email: String
    phone: String
    created: String
    seller: ID
  }

  type Order {
    id: ID
    order: [OrderGroup]
    total: Float
    client: ID
    seller: ID
    date: String
    state: OrderState
  }

  type OrderGroup {
    id: ID
    quantity: Int
  }


  type Token {
    token: String
  }

  # Input Types
  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  input AuthenticateInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    stock: Int!
    price: Float!
  }

  input ClientInput {
    name: String!
    lastName: String!
    company: String!
    email: String!
    phone: String
  }

  input OrderProductInput {
    id: ID
    quantity: Int
  }

  input OrderInput {
    order: [OrderProductInput]
    total: Float
    client: ID
    state: OrderState
  }

  # Using an Enum to only accept certain values in an input property:
  enum OrderState {
    Pending
    Complete
    Canceled
  }

  # Queries
  type Query {
    # Users
    obtainUser(token: String!): User

    # Products
    obtainProducts: [Product]
    obtainProduct(id: ID!): Product

    # Clients
    obtainClients: [Client]
    obtainClientsPerSeller: [Client]
    obtainClient(id: ID!): Client

    # Orders
    obtainOrders: [Order]
    obtainOrdersPerSeller: [Order]
    obtainOrder(id: ID!): Order
    obtainOrdersByState(state: String!): [Order]
  }

  # Mutations
  type Mutation {
    # Users
    newUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token

    # Products
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    # Clients
    newClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput): Client
    deleteClient(id: ID!): String

    # Orders
    newOrder(input: OrderInput): Order
    updateOrder(id: ID!, input: OrderInput): Order
    deleteOrder(id: ID!): String
  }
`;

module.exports = typeDefs;
