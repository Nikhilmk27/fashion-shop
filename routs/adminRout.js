const express = require('express')
const router = express.Router()
const adminController = require('../controller/admin/adminController')
const upload = require('../middleweare/upload')
const uploadProduct = require('../middleweare/productUpload')
const adminAuth = require("../middleweare/adminAuth")
// admin home and admin login
router.get('/signin',adminAuth,adminController.getAdminSignin)
router.post('/admin_signin',adminController.postAdminSignin) 
 router.get('/adminHome',adminAuth,adminController.getAdminHome)
 router.get('/adminsignout',adminAuth,adminController.signout)
 
// admin product management
router.get('/products',adminAuth,adminController.productHome)
router.get('/add_product',adminAuth,adminController.addProduct)
router.post('/add_product',adminAuth,uploadProduct.single('image'),adminController.postAddProduct)
router.get('/edit_product/:id',adminAuth,adminController.getEditproduct)
router.post('/edit_product/:id',adminAuth,uploadProduct.single('image'),adminController.postEditproduct)
router.get('/delete_product/:id',adminAuth,adminController.deleteProduct)

// admin category management
router.get('/get_category',adminAuth,adminController.getCategory)
router.get('/get_addCategory',adminAuth,adminController.getAddcategory)
 router.post('/add_category',adminAuth,upload.single('image'),adminController.addCategory)
 router.get('/delete_category/:id',adminAuth,adminController.deleteCategory)
 router.get('/edit_category/:id',adminAuth,adminController.editCategory) 
 router.post('/edit_category/:id',adminAuth,upload.single('image'),adminController.post_editCategory)
module.exports = router
// admin user management 
router.get('/get_user',adminAuth,adminController.getUser)
router.get('/delete_user',adminAuth,adminController.getUser)

// admin order management
 router.get('/get_orderDetails',adminAuth,adminController.getOrderDetails)
