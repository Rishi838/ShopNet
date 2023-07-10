const express = require('express')
const router = express.Router()
const middleware = require('../utilities/middleware')
const orderController = require('../controllers/orderController')

router.post('/previous_orders',middleware, orderController.fetch_orders)

module.exports = router