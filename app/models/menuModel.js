const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name of Pizza is required"],
  },
  image: {
    type: String,
    required: [true, "Image of Pizza is Must"],
  },
  price: {
    type: Number,
    required: [true, "Price to be Mentioned"],
  },
  size: {
    type: String,
    required: [true, "Small/Medium/Large must be mentioned"],
  },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
