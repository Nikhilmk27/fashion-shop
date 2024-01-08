const User = require("../../model/user");
const usercollection = require("../../model/userCollection");
const userSign = require("../../model/userCollection");
const nodemailer = require("nodemailer");
const getHome = (req, res) => {
  res.render("../views/index.ejs");
};
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
    const userDatas = req.body;

    console.log(userDatas);
    req.session.userData = req.body;
    res.cookie("user_mail", req.body.email, { httpOnly: true });
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
      res.redirect("/otp");
      console.log("Message sent: %s", info);
      req.session.otp=otp

      setTimeout(function(){
        req.session.destroy()
      },300000)
    }
  } catch (error) {
    console.log(error);
  }
};
const otpPageView = (req,res) => {
  res.render('../views/otp')
}
module.exports = {
  getHome,
  getSignup,
  //  register
  postSignup,
  otpPageView
};
