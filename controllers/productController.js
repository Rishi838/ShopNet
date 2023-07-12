// This utility function help us in adding different products to out product database
const product = require("../models/product");
const path = require('path')
const fs = require('fs')

 module.exports.createProduct = async (req,resp) => {
  try {
    const imagePath =  path.join(__dirname , "pfp.jpeg");
    const imageData = fs.readFileSync(imagePath, 'binary');
    const result = await product.create({
      Name: "AirPodes",
      Price: 30000,
      Description: "Trending Electronics",
      Category: "Electronics",
      image : {
        data : imageData,
        contentType : 'image/jpeg'
      }
    });
    resp.status(200).json({message : "Product added successfully",result})
  } catch (error) {
    console.log("Some Error Occured ", error);
    resp.status(404).json({message:"Some Error Occured"})
  }
};
