const { Schema, model } = require("mongoose")

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = model("User", userSchema);

