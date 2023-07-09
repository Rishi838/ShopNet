const mongoose = require("mongoose");
require("dotenv").config();
// Connecting to Database
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Products Database connected");
  })
  .catch((e) => {
    console.log(e);
    console.log("Products Database Falied");
  });
//Creating a new schema
const productschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
const collection = new mongoose.model("Products", productschema);
module.exports = collection;
