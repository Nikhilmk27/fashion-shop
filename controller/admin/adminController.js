const admin = require("../../model/admin.js");
const Category = require("../../model/categoryModel.js");
const Product = require("../../model/productModel.js");
const fs = require("fs");
const path = require("path");

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
// admin category management

const getCategory = async (req, res) => {
  const categories = await Category.find();
  console.log(categories);
  res.render("../views/category.ejs", { categories: categories });
};
const getAddcategory = (req, res) => {
  try {
    res.render("../views/add.ejs");
  } catch (error) {
    console.log(error);
  }
};
const addCategory = async (req, res) => {
  const { name } = req.body;
  const image = req.file.filename;
  console.log("the req object");
  console.log(req.body);
  const category = await Category.create({
    name: name,
    image: image,
  });
  console.log(category);
  res.redirect("/get_category");
};
const editCategory = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    const category = await Category.findOne({ _id: id });
    console.log(category);
    if (category) {
      console.log(category);
      res.render("../views/editCategory.ejs", { category: category });
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    console.log(error);
  }
};


const post_editCategory = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  let new_image = "";
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("../../public/admin/category" + req.body.oldimage);
    } catch (error) {
      console.log(error);
    }
  } else {
    new_image = req.body.oldimage;
  }
  const updateData = {
    name: req.body.name,
    image: new_image,
  };
  const updatedCategory = await Category.updateOne(
    { _id: id },
    { $set: updateData }
  );
  console.log(updatedCategory);
  res.redirect("/get_category");
};
const deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    let category = await Category.findOne({ _id: id });
    console.log("CATGORY");
    console.log(category);
    let imageFileName = category.image;
    console.log(`image file name`, imageFileName);
    await Category.deleteOne({ _id: id }).then((deletedCategory) => {
      console.log(`category deleted`, deletedCategory);
    });
    // delete the associate image
    const imagePath = path.join(
      __dirname,
      "../../public/admin/category",
      imageFileName
    );
    console.log(imagePath);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("error deleteng image:", err);
      } else {
        console.log("imgage deleted sucessfully");
      }
    });
    res.redirect("/get_category");
  } catch (error) {
    console.log(error.message);
  }
};

// admin product management
const productHome = async (req, res) => {
  const products = await Product.find();
  console.log(products);
  res.render("../views/admin/productHome", { products: products });
};
const addProduct = (req, res) => {
  res.render("../views/admin/addProduct");
};
const postAddProduct = async (req, res) => {
  console.log(req.body);
  let image = req.file.filename;
  let images = req.file.filename;
  try {
    const {
      name,
      description,
      richDescription,
      brand,
      price,
      category,
      countInStock,
      numReviews,
      isFeatured,
      dateCreated,
    } = req.body;

    // Validate if required fields are present
    if (!name || !description || !price || !category || !countInStock) {
      return res
        .status(400)
        .json({
          error: "Incomplete data. Please provide all required fields.",
        });
    } else {
      const newProduct = await Product.create({
        name: name,
        description: description,
        richDescription: richDescription,
        image: image,
        brand: brand,
        price: price, // You might want to set the price to a numeric value, as using a string might cause issues in calculations
        category: category,
        countInStock: countInStock, // You might want to set the countInStock to a numeric value
        numReviews: numReviews, // You might want to set the numReviews to a numeric value
        isFeatured: false, // Set to false by default
        dateCreated: new Date().toISOString(),
      });
      console.log(newProduct);

      return res
        .status(201)
        .json({ success: true, message: "Product added successfully." });
    }

    // Perform the necessary operations (e.g., save to database)
    // ...

    // Send a success response
  } catch (error) {
    console.error(error.message);
    // Send an error response
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getEditproduct = async (req, res) => {
  try {
    let id = req.params.id;
    const product = await Product.findOne({ _id: id });
    if (product) {
      res.render("../views/admin/editProduct", { product });
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const postEditproduct = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      description,
      richDescription,
      brand,
      price,
      category,
      countInStock,
      numReviews,
      isFeatured,
      dateCreated,
    } = req.body;
    console.log(id);
    const data = req.body;
    console.log(data);
    let new_image = "";
    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync("../../public/admin/products" + req.body.oldimage);
      } catch (error) {
        console.log(error);
      }
    } else {
      new_image = req.body.oldimage;
    }
    const updateData = {
      name: name,
      description: description,
      richDescription: richDescription,
      image: new_image,
      brand: brand,
      price: price, // You might want to set the price to a numeric value, as using a string might cause issues in calculations
      category: category,
      countInStock: countInStock, // You might want to set the countInStock to a numeric value
      numReviews: numReviews, // You might want to set the numReviews to a numeric value
      isFeatured: false, // Set to false by default
      dateCreated: new Date().toISOString(),
    };
    const updatedProduct = await Product.updateOne(
      { _id: id },
      { $set: updateData }
    );
    console.log(updatedProduct);
    res.redirect("/products");
  } catch (error) {
    console.log(error);
  }
};
const deleteProduct = async (req,res) => {
let id = req.params.id
try {
  let product = await Product.findOne({ _id: id });
  console.log(product);
  let imageFileName = product.image;
  console.log(`image file name`, imageFileName);
  await Product.deleteOne({ _id: id }).then((deletedProduct) => {
    console.log(`category deleted`, deletedProduct);
  });
  // delete the associate image
  const imagePath = path.join(
    __dirname,
    "../../public/admin/products",
    imageFileName
  );
  console.log(imagePath);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("error deleteng image:", err);
    } else {
      console.log("imgage deleted sucessfully");
    }
  });
  res.redirect("/products");
} catch (error) {
  console.log(error.message);
}

}

module.exports = {
  getAdminHome,
  getAdminSignin,
  postAdminSignin,
  getCategory,
  addCategory,
  deleteCategory,
  editCategory,
  post_editCategory,
  getAddcategory,
  productHome,
  addProduct,
  postAddProduct,
  getEditproduct,
  postEditproduct,
  deleteProduct
};
