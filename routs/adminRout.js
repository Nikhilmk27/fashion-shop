const express = require('express')
const router = express.Router()
const adminController = require('../controller/admin/adminController')
// admin home and admin login
router.get('/admin_signin',adminController.getAdminSignin)
router.post('/admin_signin',adminController.postAdminSignin) 
 router.get('/adminHome',adminController.getAdminHome)
// admin product management


// admi category management

module.exports = router
