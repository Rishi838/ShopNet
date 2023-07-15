// This utility function help us in adding different products to out product database
const product = require("../models/product");
const path = require('path')
const fs = require('fs')

 module.exports.createProduct = async (req,resp) => {
  try {
    const result = await product.create({
      Name: "AirDopes 81",
      Price: 100,
      Description: "Trending Electronics",
      Category: "Electronics",
    });
    resp.status(200).json({message : "Product added successfully",result})
  } catch (error) {
    console.log("Some Error Occured ", error);
    resp.status(404).json({message:"Some Error Occured"})
  }
};

module.exports.get_product_details = async(req,resp) =>{
  try{
  const productId = req.body.productId
  if(!productId)
  return resp.status(200).json({success:0,message:"Please Specify Product Id"})
  const details = await product.findOne({_id : productId})
  if(!details)
  return resp.status(200).json({success:0,message:"No Such Product Exists"})
  return resp.status(200).json({success:1, details: details})
  }catch(err)
  {
    console.log("Some Error Occured",err)
    return resp.status(404).json({success:-1,message : "SERVER ERROR OOCCURED"})
  }
}

module.exports.get_all_product_details = async(req,resp) =>{
  try {
    const products = await product.find();
    resp.status(200).json(products);
  } catch (err) {
    console.error('Error retrieving products:', err);
    resp.status(500).send('Internal Server Error');
  }
}
