require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Models/User");
const Product = require("../Models/Product");
const Client = require("../Models/Client");
const Order = require("../Models/Order");

const secret = process.env.SECRET;

const createToken = (user, secret, expiresIn) => {
  const { id, name, lastName, email } = user;

  // The jwt takes a payload. It takes the infor that will be added to the header of the
  // jsonwebtoken.
  return jwt.sign({ id, name, lastName, email }, secret, { expiresIn });
};

// Resolvers
const resolvers = {
  // Query with method that satisfies what's in the Schema.
  Query: {
    obtainUser: async (_, { token }) => {
      const verifiedUser = jwt.verify(token, secret);
      return verifiedUser;
    },
    obtainProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    obtainProduct: async (_, { id }) => {
      try {
        const product = await Product.findById(id);

        if (!product) {
          throw new Error("Product not found.");
        }

        return product;
      } catch (error) {
        console.log(error);
      }
    },
    obtainClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    obtainClientsPerSeller: async (_, {}, ctx) => {
      try {
        const clients = await Client.find({ seller: ctx.user.id.toString() });
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    obtainClient: async (_, { id }, ctx) => {
      try {
        const client = await Client.findById(id);

        if (client === undefined || client === null) {
          throw new Error("Client not found.");
        }

        if (client.seller.toString() !== ctx.user.id) {
          throw new Error("You do not have access to this information.");
        }

        return client;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      const isUserRegistered = await User.findOne({ email });
      if (isUserRegistered) {
        throw new Error("The user is already registered.");
      }

      const salt = await bcrypt.genSalt(10);
      input.password = await bcrypt.hash(password, salt);

      try {
        const newUser = new User(input);

        newUser.save((error) => {
          if (error) {
            return `${error}. There was an error creating the user.`;
          }
        });

        return newUser;
      } catch (error) {
        console.log(error);
      }
    },
    authenticateUser: async (_, { input }) => {
      const { email, password } = input;
      let user = {};

      const doesUserExist = await User.findOne({ email });
      if (!doesUserExist) {
        throw new Error("The user or password are incorrect.");
      } else {
        user = doesUserExist;
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new Error("The user or password are incorrect.");
      }

      // Create token.
      return {
        token: createToken(user, secret, "24h"),
      };
    },
    newProduct: (_, { input }) => {
      try {
        const newProduct = new Product(input);

        newProduct.save((error) => {
          if (error) {
            return `${error}. There was an error creating the product.`;
          }
        });

        return newProduct;
      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }) => {
      let product = await Product.findById(id);

      if (!product) {
        throw new Error("Product not found.");
      }

      // Save it with new values in db.
      product = await Product.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return product;
    },
    deleteProduct: async (_, { id }) => {
      let product = await Product.findById(id);

      if (!product) {
        throw new Error("Product not found.");
      }

      await Product.findByIdAndDelete(id);

      return "Product deleted.";
    },
    newClient: async (_, { input }, ctx) => {
      const { email } = input;

      const isClientRegistered = await Client.findOne({ email });

      if (isClientRegistered) {
        throw new Error("Client already registered.");
      }

      const newClient = new Client(input);
      newClient.seller = ctx.user.id;

      try {
        newClient.save((error) => {
          if (error) {
            return `${error}. There was an error registering the client.`;
          }
        });
        return newClient;
      } catch (error) {
        console.log(error);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      try {
        let client = await Client.findById(id);

        if (client === undefined || client === null) {
          throw new Error("Client not found.");
        }

        if (client.seller.toString() !== ctx.user.id) {
          throw new Error("You do not have access to this information.");
        }

        client = await Client.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return client;
      } catch (error) {
        console.log(error);
      }
    },
    deleteClient: async (_, { id }, ctx) => {
      try {
        const client = await Client.findById(id);

        if (client === undefined || client === null) {
          throw new Error("Client not found.");
        }

        if (client.seller.toString() !== ctx.user.id) {
          throw new Error("You do not have access to this information.");
        }

        await Client.findByIdAndDelete(id);
        return "Client deleted.";
      } catch (error) {
        console.log(error);
      }
    },
    newOrder: async (_, { input }, ctx) => {
      const { client } = input;

      try {
        // Verify if client exists or no.
        const doesClientExists = await Client.findById(client);

        if (doesClientExists === undefined || doesClientExists === null) {
          throw new Error("Client is not registered.");
        };

        // Verify if client is from the seller.
        if (doesClientExists.seller.toString() !== ctx.user.id) {
          throw new Error("You do not have access to this option.");
        };

        // Verify if stock is available.
        for await ( const article of input.order ) {
          const { id } = article;

          const product = await Product.findById(id);

          if (article.quantity > product.stock) {
            throw new Error(`The article: ${product.name} exceeds the available stock.`);
          } else {
            // Substract the order number to the stock.
            product.stock = product.stock - article.quantity;

            await product.save(error => {
              if (error ) {
                return `${error}. There was an error saving the new changes to the stock.`;
              }
            });
          };
        }

        // Create a new order.
        const newOrder = new Order(input);
      
        // Assign a seller.
        newOrder.seller = ctx.user.id;
  
        // Save it to database.
        const newOrderSaved = newOrder.save(error => {
          if (error) {
            return `${error}. There was an error registering the new order.`;
          }
        });

        return newOrderSaved;
      } catch (error) {
        console.log(error);
      };
    },
  },
};

module.exports = resolvers;
