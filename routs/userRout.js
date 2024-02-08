const express = require('express')
const router = express.Router()
const userController = require('../controller/user/userController')
// user routs
router.get('/signin',userController.getLogin)
router.post('/signin',userController.postSignin)
router.get('/home',userController.getHome)
router.get('/signup',userController.getSignup)
 router.post('/signup',userController.postSignup)
 router.get('/otp',userController.otpPageView)
 router.post('/otpverification',userController.otpVerification)
 router.post('/resend_otp',userController.resend_otp)
//  user category
router.get('/getProductCategory/:id',userController.getProductCategory)
router.get('/getProductView/:id',userController.getProductView)

module.exports = router