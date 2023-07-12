const express = require('express')
const router = express.Router()
const middleware = require('../utilities/middleware')
const orderController = require('../controllers/orderController')

router.post('/payments/initiate', middleware , orderController.order_place)
router.post('/payments/:orderDatabaseId/verify', middleware , orderController.payment_verify)

module.exports = router