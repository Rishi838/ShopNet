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
  Name: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Category : {
    type : String,
    required :true
  },
  image : {
    data : Buffer,
    contentType : String
  }
});
const collection = new mongoose.model("Products", productschema);
module.exports = collection;
