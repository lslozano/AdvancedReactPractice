const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../Models/User");
const Product = require("../Models/Product");

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
          if (error) `${error}. There was an error creating the user.`;
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
          if (error) `${error}. There was an error creating the product.`;
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
  },
};

module.exports = resolvers;
