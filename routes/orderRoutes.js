const express = require('express')
const router = express.Router()
const middleware = require('../utilities/middleware')
const orderController = require('../controllers/orderController')

router.post('/orders/place',middleware, orderController.order_place)
router.post('/orders/:orderId/verify',middleware, orderController.payment_verify)
module.exports = router