const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  order: {
    type: Array,
    required: true,
    trim: true,
  },
  total: {
    type: Number,
    required: true,
  },
  client: {
    type: Schema.Types.ObjectID,
    required: true,
    ref: "Client",
  },
  seller: {
    type: Schema.Types.ObjectID,
    required: true,
    ref: "User",
  },
  state: {
    type: String,
    default: "Pending",
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Order", orderSchema);
