require("dotenv").config();

const mongoose = require("mongoose");

const db = process.env.DB;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log("Succesfully connected to Database!");
  } catch (error) {
    console.log(
      `The following error produced while trying to connect to the DB: ${error}`
    );
    process.exit(1); // Stops the app.
  }
};

module.exports = connectDB;
