const express = require('express')
const router = express.Router()
const adminController = require('../controller/admin/adminController')
const upload = require('../middleweare/upload')
const uploadProduct = require('../middleweare/productUpload')
// admin home and admin login
router.get('/admin_signin',adminController.getAdminSignin)
router.post('/admin_signin',adminController.postAdminSignin) 
 router.get('/adminHome',adminController.getAdminHome)
 
// admin product management
router.get('/products',adminController.productHome)
router.get('/add_product',adminController.addProduct)
router.post('/add_product',uploadProduct.single('image'),adminController.postAddProduct)
router.get('/edit_product/:id',adminController.getEditproduct)
router.post('/edit_product/:id',uploadProduct.single('image'),adminController.postEditproduct)
router.get('/delete_product/:id',adminController.deleteProduct)

// admin category management
router.get('/get_category',adminController.getCategory)
router.get('/get_addCategory',adminController.getAddcategory)
 router.post('/add_category',upload.single('image'),adminController.addCategory)
 router.get('/delete_category/:id',adminController.deleteCategory)
 router.get('/edit_category/:id',adminController.editCategory) 
 router.post('/edit_category/:id',upload.single('image'),adminController.post_editCategory)
module.exports = router
