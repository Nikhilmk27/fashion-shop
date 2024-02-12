const User = require("../../model/user");
const usercollection = require("../../model/userCollection");
const products = require('../../model/productModel')
const Category = require('../../model/categoryModel')
const Cart = require('../../model/cart')
// const userSign = require("../../model/userCollection");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')
const getHome = async (req, res) => {
  try {
    const product = await products.find()
    console.log(product)
    const category = await Category.find() 
    console.log(category)
    if(product && category){
    res.render("../views/index.ejs",{name:"home",product,category})
  }else{
    res.status(500).send('error loadi data')
  }

  // if(product){
  //   res.render("../views/index.ejs",{name:"home",product})
  // }else{
  //   res.status(500).send('error loadi data')
  // }
    
  } catch (error) {
    console.log(error.message)
  }
  
  
  // res.render("../views/index.ejs",{name:"home"});
};
const getLogin = (req,res) => {
  // res.render('../views/login.ejs')
  if(req.session.user){
    res.redirect('/home')
  }else{
  res.render('../views/user/login.ejs')
}
}
  const postSignin = async (req,res) => {
    try{
      const data = req.body
      console.log(data)
      const email = req.body.email
      let userExist = await usercollection.findOne({email:email}) 
      console.log(userExist)
      if(userExist){
        req.session.user = userExist
        const match = await bcrypt.compare(req.body.password,userExist.password)
        if(match){

          res.redirect('/home')
        }
      }else{
        res.render('../views/login')
      }

    }catch(error){
      console.log(error.message)

    }
    

  }


const getSignup = (req, res) => {
  res.render("../views/signupregister");
};
// first sign up page ,ejs file name = signup.ejs create user
// this roue stores all the user data including address

// const postSignup = async (req, res) => {
//   // user creation storig data to db validting user alredy signup
//   try {
//     const userData = req.body;
//     console.log(userData)
//     const newUser = {
//       name: userData.name,
//       email: userData.email,
//       password: userData.password,
//       address: {
//         name: req.body.addressName,
//         email: req.body.addressEmail,
//         mobile: req.body.addressMobile,
//         zip_code: req.body.addressZipCode,
//         address: req.body.userAddress,

//     }
//   }

//     const user = await User.create(newUser);

//     console.log(user);
//   } catch (error) {
//     console.log(`errormessage:`, error);
//   }
// }
// register page where we are going to register the new user
// this rout sends the tp to users email using node mailer
//  const postSignup = async (req,res) => {
//   const userData = req.body
//   const email = req.body.email
//   console.log(userData)
//   let otp=`${Math.floor(1000+Math.random()*9000)}`
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com', // Gmail SMTP server hostname
//     port: 587, // Port for TLS/STARTTLS
//     secure: false, // Set to true if using SSL/TLS
//     auth: {
//       user: 'nikhil2779526@gmail.com', // Your Gmail address
//       pass: 'kmzp ykyv qkzl izpn' // App-specific password generated for Node Mailer
//     }
//   });

//   const info = await transporter.sendMail({
//     from: 'nikhil2779526@gmail.com', // sender address
//     to: email, // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "otp verification", // plain text body
//     html: ` <p> OTP: <b> ${otp} </b></p>`,
//   });
//   console.log("Message sent: %s", info);

//  }
const postSignup = async (req, res) => {
  try {
    // const userDatas = req.body;
    // console.log(userDatas);
    req.session.userData = req.body;
    console.log("session data is bellow")
    console.log(req.session.userData)

    res.cookie("user_mail", req.body.email, { httpOnly: true });
    console.log(`user email:${req.cookies.user_mail}`)
    const email = req.body.email;
    let userExist = await usercollection.findOne({ email });
    if (userExist) {
      res.render("../views/signupregister", { message: "email alredy exist" });
    } else if (req.body.password != req.body.repeatPassword) {
      res.render("../views/signupregister", {
        message: "password dosent match",
      });
    } else {
      let otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Gmail SMTP server hostname
        port: 587, // Port for TLS/STARTTLS
        secure: false, // Set to true if using SSL/TLS
        auth: {
          user: "nikhil2779526@gmail.com", // Your Gmail address
          pass: "kmzp ykyv qkzl izpn", // App-specific password generated for Node Mailer
        },
      });

      const info = await transporter.sendMail({
        from: "nikhil2779526@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "otp verification", // plain text body
        html: ` <p> OTP: <b> ${otp} </b></p>`,
      });
     
      console.log("Message sent: %s", info);
      req.session.otp=otp
      res.redirect("/otp");
      console.log("otp stored in session")
      console.log(otp)

      setTimeout(function(){
        req.session.destroy()
      },300000)
    }
  } catch (error) {
    console.log(error);
  }
};
// otp page view
const otpPageView = (req,res) => {
  res.render('../views/otp')
}
// otp verification
const otpVerification = async (req,res) => {
  try{
  const userOTP = req.body.otp
  const userData = req.session.userData
  let otp = req.session.otp
  console.log(userOTP)
  console.log(userData)
  console.log(req.session.otp)
  
  if(!req.session.otp){
    res.redirect('/otp?wrong = OTP expired')
  } else if(req.session.otp != userOTP){
    res.redirect('/otp?wrong = invalid otp')
  }else{
    const passwordHash = await bcrypt.hash(userData.password,12)
    console.log(passwordHash)
    const user =await usercollection.create({
      name: userData.name,
        email: userData.email,
        password: passwordHash,
    })
    console.log(user)
    res.redirect('/signin?msg=successfully registerd plese login')
  }
} catch(error){
  console.log(error.message)

}
  
  
}
const resend_otp = async (req,res) => {
   const userData = req.session.userData
   console.log(userData)
   let email = req.session.email
  let otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Gmail SMTP server hostname
        port: 587, // Port for TLS/STARTTLS
        secure: false, // Set to true if using SSL/TLS
        auth: {
          user: "nikhil2779526@gmail.com", // Your Gmail address
          pass: "kmzp ykyv qkzl izpn", // App-specific password generated for Node Mailer
        },
      });

      const info = await transporter.sendMail({
        from: "nikhil2779526@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "otp verification", // plain text body
        html: ` <p> OTP: <b> ${otp} </b></p>`,
      });
     
      console.log("Message sent: %s", info);
      req.session.otp=otp
      res.redirect("/otp");
      console.log("otp stored in session")
      console.log(otp)

      setTimeout(function(){
        req.session.otp = false
      },300000)

}
// user category management
const getProductCategory = async (req,res) => {
  try {
    const id = req.params.id
  const product = await products.find({category:id})
  console.log(product)
  res.render('../views/categoryProduct.ejs',{product})
    
  } catch (error) {
    console.log(error.message)
  }
  
  
}
const getProductView = async (req,res) => {
  try {
    const id = req.params.id
    const product = await products.findOne({_id : id})
    console.log("single product")
    console.log(product)
    res.render('../views/user/productPage.ejs',{product})
    
  } catch (error) {
    console.log(error.message)
  }
  
}
// const postAddToCat =async (req,res) => {
//   // Cart route to add an item to the cart

//   // Check if the user is logged in
//   if (!req.session || !req.session.user) {
//       return res.status(401).send('Unauthorized');
//   }

//   const userId = req.session.user._id; // Assuming user ID is stored in session
//   const productId = req.params.productId;

//   try {
//       let cart = await Cart.findOne({ userId });
//       if (!cart) {
//           cart = new Cart({ userId, items: [] });
//       }

//       // Check if the product already exists in the cart
//       const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
//       if (existingItemIndex !== -1) {
//           // If the product exists, update the quantity
//           cart.items[existingItemIndex].quantity++;
//       } else {
//           // If the product doesn't exist, add it to the cart
//           cart.items.push({ productId, quantity: 1 });
//       }

//       await cart.save();
//       // res.sendStatus(200); // Send success status
//       res.redirect('/home');
//   } catch (error) {
//       console.error(error);
//       res.sendStatus(500); // Internal server error
//   }
// }
// Route to get the user's cart
// const getAddToCart = async (req, res) => {
//     // Check if the user is logged in
//     if (!req.session || !req.session.user) {
//         return res.status(401).send('Unauthorized');
//     }

//     const userId = req.session.user._id; // Assuming user ID is stored in session
//     console.log(req.session.user)

//     try {
//         const cart = await Cart.findOne({ userId }).populate('items.productId');
//         res.json(cart);
//     } catch (error) {
//         console.error(error);
//         res.sendStatus(500); // Internal server error
//     }
// }

// rout to render the cart view
// Route to get cart details
const getAddToCart =  async (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
      return res.status(401).send('Unauthorized');
  }

  const userId = req.session.user._id;

  try {
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart) {
          return res.render('../views/user/cart', { cartItems: [] });
      }

      res.render('../views/user/cart', { cartItems: cart.items });
  } catch (error) {
      console.error('Error fetching cart details:', error);
      res.sendStatus(500); // Internal server error
  }
}

const  postAddToCat = async (req, res) => {
    // Cart route to add an item to the cart

    // Check if the user is logged in
    if (!req.session || !req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const userId = req.session.user._id; // Assuming user ID is stored in session
    const productId = req.params.productId;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if the product already exists in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            // If the product exists, update the quantity
            existingItem.quantity++;
        } else {
            // If the product doesn't exist, add it to the cart
            cart.items.push({ productId, quantity: 1 });
        }

        await cart.save();
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Internal server error
    }
}


// controller to fetch cart count
// Route to get cart count
const getCartCount = async (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
      return res.status(401).json({ count: 0 }); // Unauthorized
  }

  const userId = req.session.user._id;

  try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
          return res.json({ count: 0 });
      }

      const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
      res.json({ count: itemCount });
  } catch (error) {
      console.error('Error fetching cart count:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

// update quantit rout




// Define the POST route for updating quantity
const updateQuantity = async (req, res) => {
    // Check if the user is logged in
    if (!req.session || !req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const userId = req.session.user._id;
    const productId = req.params.productId;
    const action = req.query.action; // 'inc' for increment, 'dec' for decrement
    console.log(userId)
    console.log(productId)
    console.log(action)

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Find the item in the cart
        const item = cart.items.find(item => item.productId.toString() === productId);

        if (!item) {
            return res.status(404).send('Product not found in cart');
        }

        // Update quantity based on the action
        if (action === 'inc') {
            item.quantity++;
        } else if (action === 'dec') {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                return res.status(400).send('Quantity cannot be less than 1');
            }
        } else {
            return res.status(400).send('Invalid action');
        }

        await cart.save();
        res.sendStatus(200); // Send success status
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.sendStatus(500); // Internal server error
    }
}

// rout to remove product from cart
const removeProduct = async (req,res) =>{
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
      return res.status(401).send('Unauthorized');
  }

  const userId = req.session.user._id;
  const productId = req.params.productId;

  try {
      let cart = await Cart.findOne({ userId });

      if (!cart) {
          return res.status(404).send('Cart not found');
      }

      // Filter out the item to be removed from the cart
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);

      await cart.save();
      res.sendStatus(200); // Send success status
  } catch (error) {
      console.error('Error removing product:', error);
      res.sendStatus(500); // Internal server error
  }
}

// rou to get the checkout page
const checkOut = (req,res) => {
  res.render('../views/user/checkout')
}





module.exports = {
  getHome,
  getSignup,
  //  register
  postSignup,
  otpPageView,
  otpVerification,
  resend_otp,
  getLogin,
  postSignin,
  getProductCategory,
  getProductView,
  postAddToCat,
  getAddToCart,
  getCartCount,
  updateQuantity,
  removeProduct,
  checkOut
  
};
