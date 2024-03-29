 const User = require("../../model/user");
const usercollection = require("../../model/userCollection");
const products = require("../../model/productModel");
const Category = require("../../model/categoryModel");
const Cart = require("../../model/cart");
const order = require("../../model/order");
 const userSign = require("../../model/userCollection");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const isLoggedIn = require('./isLoggedIn')
// razorpay
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: 'rzp_test_b8r9QYFtn70jSl',
  key_secret: 'PqaaUuPb2G5Zk9Ee33HTcZf5'
});

// home test
const getHome = async (req, res) => {
  try {
    // const name = req.query.name;
    const product = await products.find();
    const category = await Category.find();
    if (product && category&& req.session.user) {
      const name=req.session.user.name
      res.render("../views/index.ejs", { name, product, category });
    } else if(product && category){
      res.render("../views/index.ejs", { name:"", product, category });
    }
    else  {
      res.status(500).send("error loadi data");
    }

  } catch (error) {
    console.log(error.message);
  }
}


// const getHome = async (req, res) => {
//   try {
//     const product = await products.find();
//     const category = await Category.find();
//     if (product && category) {
//       res.render("../views/index.ejs", { name: "home", product, category });
//     } else {
//       res.status(500).send("error loadi data");
//     }

//   } catch (error) {
//     console.log(error.message);
//   }

//   // res.render("../views/index.ejs",{name:"home"});
// };
const getSearch = async(req,res) => {
  try {
    const { query } = req.query;
    // Use MongoDB's $regex operator to perform a case-insensitive search
    const product = await products.find({
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { description: { $regex: new RegExp(query, 'i') } },
      ],
    });
    console.log(product)
    res.json(product);
  } catch (error) {
    console.log(error.message)
  }
}

const getLogin = (req, res) => {
  // res.render('../views/login.ejs')
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("../views/user/login.ejs");
  }
};
// const postSignin = async (req, res) => {
//   try {
//     const data = req.body;
//     console.log(data);
//     const email = req.body.email;
//     let userExist = await usercollection.findOne({ email: email });
//     console.log(userExist);
//     if (userExist) {
//       req.session.user = userExist;
//       const match = await bcrypt.compare(req.body.password, userExist.password);
//       if (match) {
//         res.redirect("/home");
//       }
//     } else {
//       res.render("../views/login");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

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
    console.log("session data is bellow");
    console.log(req.session.userData);

    res.cookie("user_mail", req.body.email, { httpOnly: true });
    console.log(`user email:${req.cookies.user_mail}`);
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
      req.session.otp = otp;
      res.redirect("/otp");
      console.log("otp stored in session");
      console.log(otp);

      setTimeout(function () {
        req.session.destroy();
      }, 300000);
    }
  } catch (error) {
    console.log(error);
  }
};
// otp page view
const otpPageView = (req, res) => {
  res.render("../views/otp");
};
// otp verification
const otpVerification = async (req, res) => {
  try {
    const userOTP = req.body.otp;
    const userData = req.session.userData;
    let otp = req.session.otp;
    console.log(userOTP);
    console.log(userData);
    console.log(req.session.otp);

    if (!req.session.otp) {
      res.redirect("/otp?wrong = OTP expired");
    } else if (req.session.otp != userOTP) {
      res.redirect("/otp?wrong = invalid otp");
    } else {
      const passwordHash = await bcrypt.hash(userData.password, 12);
      console.log(passwordHash);
      const user = await usercollection.create({
        name: userData.name,
        email: userData.email,
        password: passwordHash,
      });
      console.log(user);
      res.redirect("/signin?msg=successfully registerd plese login");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const resend_otp = async (req, res) => {
  const userData = req.session.userData;
  console.log(userData);
  let email = req.session.email;
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
  req.session.otp = otp;
  res.redirect("/otp");
  console.log("otp stored in session");
  console.log(otp);

  setTimeout(function () {
    req.session.otp = false;
  }, 300000);
};
// user category management
// const getProductCategory = async (req, res) => {
//   try {
//     const id = req.params.id;
//    const  name = req.session.user.name
//     const product = await products.find({ category: id });
//     console.log(product);
//     res.render("../views/categoryProduct.ejs", {name, product });
//   } catch (error) {
//     console.log(error.message);
//   }
// };
// user category2
const getProductCategory = async (req, res) => {
  try {
    const id = req.params.id;
    // Check if session user data exists and has a name property
    const name = req.session.user && req.session.user.name ? req.session.user.name : '';

    // Assuming `products` is a Mongoose model or a database query function
    const product = await products.find({ category: id });

    // Check if products were found before rendering the view
    if (product) {
      res.render("../views/categoryProduct.ejs", { name, product });
    } else {
      // Handle the case where no products are found for the given category
      res.status(404).send('No products found for this category.');
    }
  } catch (error) {
    console.log(error.message);
    // Send an appropriate error response
    res.status(500).send('Error fetching products.');
  }
};

const getProductView = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await products.findOne({ _id: id });
    console.log("single product");
    console.log(product);
    const name = req.session.user ? req.session.user.name : "";
    console.log(name)
    res.render("../views/user/productx.ejs", { name,product });
  } catch (error) {
    console.log(error.message);
  }
};
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
const getAddToCart = async (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
    // return res.status(401).send("Unauthorized")
    return res.redirect('/signin');
  }

  const userId = req.session.user._id;
  const name = req.session.user.name

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    console.log(cart);
    if (!cart) {
      return res.render("../views/user/cart", { cartItems: [] });
    }
    const size = cart.size
    console.log(size)

    res.render("../views/user/cart", { cartItems: cart.items,name });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.sendStatus(500); // Internal server error
  }
};

const postAddToCat = async (req, res) => {
  // Cart route to add an item to the cart

  // Check if the user is logged in
  if (!req.session || !req.session.user) {
    return res.status(401).redirect('/signin')
  }

  const userId = req.session.user._id; // Assuming user ID is stored in session
  const productId = req.params.productId;
  const size = req.body.size
  console.log(size)

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // If the product exists, update the quantity
      existingItem.quantity++;
    } else {
      // If the product doesn't exist, add it to the cart
      cart.items.push({ productId, quantity: 1,size });
    }

    await cart.save();
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal server error
  }
};

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

    const itemCount = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    res.json({ count: itemCount });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// update quantit rout

// Define the POST route for updating quantity
const updateQuantity = async (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  const userId = req.session.user._id;
  const productId = req.params.productId;
  const action = req.query.action; // 'inc' for increment, 'dec' for decrement
  console.log(userId);
  console.log(productId);
  console.log(action);

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    // Find the item in the cart
    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).send("Product not found in cart");
    }

    // Update quantity based on the action
    if (action === "inc") {
      item.quantity++;
    } else if (action === "dec") {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        return res.status(400).send("Quantity cannot be less than 1");
      }
    } else {
      return res.status(400).send("Invalid action");
    }

    await cart.save();
    res.sendStatus(200); // Send success status
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.sendStatus(500); // Internal server error
  }
};

// rout to remove product from cart
const removeProduct = async (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  const userId = req.session.user._id;
  const productId = req.params.productId;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    // Filter out the item to be removed from the cart
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.sendStatus(200); // Send success status
  } catch (error) {
    console.error("Error removing product:", error);
    res.sendStatus(500); // Internal server error
  }
};

// rou to get the checkout page
const checkOut = (req, res) => {
  res.render("../views/user/checkout");
};
const getCheckOut = async (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  const userId = req.session.user._id;
  const name = req.session.user.name

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    console.log(cart);
    if (!cart) {
      return res.render("../views/user/checkout", { cartItems: [] });
    }

    res.render("../views/user/checkout", { cartItems: cart.items ,name});
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.sendStatus(500); // Internal server error
  }
};

const placeOrder = async (req, res) => {
  try {
    const data = req.body;
    const {
      email,
      firstName,
      lastName,
      country,
      address,
      city,
      state,
      pincode,
      phone,
      paymentMethod,
    } = req.body;

    console.log(data);
    // Check if the user is logged in
    if (!req.session || !req.session.user) {
      return res.status(401).send("Unauthorized");
    }
    const userId = req.session.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    console.log(cart);
    const products = cart.items;
    console.log(products);
    // Function to calculate total price of products
    const calculateTotalPrice = (products) => {
      let totalPrice = 0;

      // Iterate over each product
      products.forEach((product) => {
        // Multiply quantity by price and add to total price
        totalPrice += product.productId.price * product.quantity;
      });

      return totalPrice;
    };

    // Calculate total price
    const totalPrice = calculateTotalPrice(products);
    const placedOrder = order.create({
      user:userId,
      order_details: products,
      total_price: totalPrice,
      email,
      firstName,
      lastName,
      country,
      address,
      city,
      state,
      pincode,
      phone,
      paymentMethod,
    });
    console.log(placedOrder)

    console.log("Total Price:", totalPrice);
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100, // Amount in paise
      currency: 'INR',
      receipt: 'receipt_order_74394', // Unique receipt id
      payment_capture: 1 // Auto capture payment
    });
    console.log('Razorpay Order:', razorpayOrder);
    res.render('../views/user/payment2', { placedOrder, razorpayOrder });

    //  res.render('../views/user/payment',{placedOrder});
  } catch (error) {
    console.log(error.message);
  }
};
const paymentUpdate =  async (req, res) => {
  try {
    const { paymentStatus, responseData } = req.body;
    console.log(paymentStatus,responseData)
  
    // Handle the payment status accordingly
    if (paymentStatus == 'success') {
      // Payment was successful
      console.log('Payment successful:', responseData);
      const userId = req.session.user._id;
      const cart = await Cart.findOne({userId})
      console.log(cart)
      if (cart) {
        // Clear the cart items
        cart.items = [];
        // Save the updated cart
        await cart.save();
        console.log('Cart cleared successfully');
    } else {
        console.log('Cart not found for the user');
    }
  
      // You can perform additional actions here, such as updating your database, sending email notifications, etc.
  
      // Send a success response to the client
      res.status(200).redirect('/home');
      
    } else if (paymentStatus === 'failed') {
      // Payment failed
      console.log('Payment failed:', responseData.error.description);
  
      // You can perform additional actions here, such as logging the error, displaying an error message to the user, etc.
  
      // Send a failure response to the client
      res.status(400).send('Payment failed');
    } else {
      // Invalid payment status
      console.error('Invalid payment status:', paymentStatus);
  
      // Send an error response to the client
      res.status(400).send('Invalid payment status');
    }
    
  } catch (error) {
    
    console.log(error)
  }
  // Extract payment status and response data from the request body
 
}

// signin 2nd disply user name
const postSignin = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const email = req.body.email;
    let userExist = await usercollection.findOne({ email: email });
    console.log(userExist);
    const homeName = userExist.name
    if (userExist) {
      req.session.user = userExist;
      const match = await bcrypt.compare(req.body.password, userExist.password);
      if (match) {
        res.redirect(`/home?name=${encodeURIComponent(homeName)}`);
      }
    } else {
      res.render("../views/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// sign out controller
const signout = (req,res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error destroying session');
    } else {
      // Redirect the user to the home page or any other appropriate page after sign-out
      res.redirect('/home');
    }
})
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
  checkOut,
  getCheckOut,
  placeOrder,
  paymentUpdate,
  getSearch,
  signout,
};
