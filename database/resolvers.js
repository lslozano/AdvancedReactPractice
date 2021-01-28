const User = require("../Models/User");

// Resolvers
const resolvers = {
  // Query with method that satisfies what's in the Schema.
  Query: {
    obtainCourse: () => "String",
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      // Review if user is already registered.
      const isUserRegistered = await User.findOne({ email });

      if (isUserRegistered) {
        throw new Error("The user is already registered.");
      }

      // Hash password.

      // Save new user to DB.
      try {
        const newUser = new User(input);

        newUser.save((error) => {
          if (error) `${error}. There was an error creating the user.`;
        });

        return newUser;
      } catch(error) {
        console.log(error);
      }
    },
  },
};

module.exports = resolvers;
