const express = require('express')
const router = express.Router()
const userController = require('../controller/user/userController')
router.get('/home',userController.getHome)
router.get('/signup',userController.getSignup)
 router.post('/signup',userController.postSignup)
 router.get('/otp',userController.otpPageView)

module.exports = router