const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  stock: {
    type: Number,
    require: true
  },
  price: {
    type: Number,
    required: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

productSchema.index({ name: "text" });

module.exports = model("Product", productSchema);