// Endpoint Related to Create Product in product database

const express = require('express')
const router = express.Router()
const product_function = require('../controllers/createProduct')

router.post('/add_product',product_function.createProduct)

module.exports = router