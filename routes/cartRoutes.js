const express = require('express');
const router = express.Router();
const middleware = require('../utilities/middleware');
const cartController = require('../controllers/cartController')

router.post('/add_to_cart', middleware, cartController.addtocart);

router.post('/fetch_cart',middleware,cartController.fetchcart)

module.exports = router;