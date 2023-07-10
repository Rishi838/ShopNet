// This utility function help us in adding different products to out product database
const product = require("../models/product");

 module.exports.createProduct = async (req,resp) => {
  try {
    const result = await product.create({
      Name: "AirPodes",
      Price: 30000,
      Description: "Trending Electronics",
      Category: "Electronics",
    });
    resp.status(200).json({message : "Product added successfully",result})
  } catch (error) {
    console.log("Some Error Occured ", error);
    resp.status(404).json({message:"Some Error Occured"})
  }
};


