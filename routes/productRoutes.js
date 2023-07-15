// Endpoint Related to Create Product in product database

const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.post('/add_product',productController.createProduct)
router.post('/get_product_details',productController.get_product_details)
router.post('/all_product_details',productController.get_all_product_details)
module.exports = router