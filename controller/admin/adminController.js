const admin = require("../../model/admin.js");
const Category = require("../../model/categoryModel.js");
const fs = require('fs')
const path = require('path')

// admin signin controlers
const getAdminSignin = (req, res) => {
  res.render("../views/adminSignin.ejs");
};
const postAdminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    console.log(email);
    const adminExist = await admin.findOne({ email: email });
    console.log(adminExist);
    if (adminExist && password == adminExist.password) {
      res.render("../views/adminHome.ejs");
    } else {
      res.render("../views/adminSignin");
    }
  } catch (error) {
    console.log(error);
  }
};
const getAdminHome = (req, res) => {
  try {
    res.render("../views/adminHome.ejs");
  } catch (error) {
    console.log(error.message);
  }
};
// const addProduct = async (req,res) => {

// }
const getCategory = async (req, res) => {
    const categories = await Category.find()
    console.log(categories)
   res.render("../views/category.ejs",{categories:categories});
};
const addCategory = async (req, res) => {
  const { name } = req.body;
  const image = req.file.filename;
  const category = await Category.create({
    name: name,
    image: image,
  });
  console.log(category);
  res.redirect('/get_category')
};
const editCategory = async (req,res) => {
  let id = req.params.id
  const category = await Category.findOne({_id:id})
  if(category){
    console.log(category)
    res.render('../views/editCategory',{category:category})
  }

}
const deleteCategory = async (req,res) => {
    const id = req.params.id
    try {
        let category = await Category.findOne({_id:id})
        console.log('CATGORY')
        console.log(category)
            let imageFileName = category.image
            console.log(`image file name`,imageFileName)
            await Category.deleteOne({_id:id})
            .then(deletedCategory => {
                console.log(`category deleted`,deletedCategory)
            })
            // delete the associate message
            const imagePath = path.join(__dirname,'../../public/admin/category',imageFileName)
            console.log(imagePath)
            fs.unlink(imagePath,err =>{
                if(err){
                    console.error('error deleteng image:',err)
                }else{
                    console.log('imgage deleted sucessfully')
                }
            })
            res.redirect('/get_category')

        
    } catch (error) {
        console.log(error.message)
    }

}
module.exports = {
  getAdminHome,
  getAdminSignin,
  postAdminSignin,
  getCategory,
  addCategory,
  deleteCategory,
  editCategory 
};
