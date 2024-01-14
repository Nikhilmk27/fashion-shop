const admin = require('../../model/admin.js')
// admin signin controlers
const getAdminSignin = (req,res) => {
    res.render('../views/adminSignin.ejs')
}
const postAdminSignin = async (req,res) => {
    try{
        const{email,password} = req.body
        console.log(req.body)
        console.log(email)
    const adminExist = await admin.findOne({email:email})
    console.log(adminExist)
    if(adminExist && password == adminExist.password){
        res.render('../views/adminHome.ejs')
    }else{
        res.render('../views/adminSignin')
    }
    } catch(error){
        console.log(error)

    }
    
    
}
const getAdminHome = (req,res) => {
    try{
        res.render('../views/adminHome.ejs')
    }catch(error){
        console.log(error.message)
    }

    }
// const addProduct = async (req,res) => {

// }
// const addCategory = async (req,res) => {

// }
   
module.exports = {
     getAdminHome,
    getAdminSignin,
    postAdminSignin,
    // addProduct,
}