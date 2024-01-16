const express = require('express')
const router = express.Router()
const adminController = require('../controller/admin/adminController')
const upload = require('../middleweare/upload')
// admin home and admin login
router.get('/admin_signin',adminController.getAdminSignin)
router.post('/admin_signin',adminController.postAdminSignin) 
 router.get('/adminHome',adminController.getAdminHome)
 
// admin product management


// admi category management
router.get('/get_category',adminController.getCategory)
 router.post('/add_category',upload.single('image'),adminController.addCategory)
 router.get('/delete_category/:id',adminController.deleteCategory)
 router.get('/edit_category/:id',adminController.editCategory) 
module.exports = router
