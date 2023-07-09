const express = require('express')
const cookieParser = require('cookie-parser')
const router = express.Router()
const authController = require('../controllers/authController')

router.use(cookieParser())

router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.get('/verify',authController.verify)
router.post('/resend',authController.resend)
router.post('/logout',authController.logout)
module.exports = router