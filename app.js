require('dotenv').config();
const express = require('express')
const userRout = require('./routs/userRout')
const adminRout = require('./routs/adminRout')
const path = require('path')
const session = require('express-session')
const connnectDB = require('./model/dbModel')
const cookieparser = require('cookie-parser')
const cors = require('cors')
const errorHandler = require("./middleweare/errorHandler")
const app = express()
// connecting to database
connnectDB()
// for parsing the url to json,string or array format
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieparser())
app.use(cors());
// session middleweare
app.use(session({
    resave: false,
    saveUninitialized: true,
    /// secret: process.env.SESSION_SECRET,
    secret: 'your_secret_key_here',
    cookie: { maxAge: 3600000 }
}))

app.use('/',userRout)
app.use('/',adminRout)
// for adding externel file to view engine(static files)
const staticPath = path.join(__dirname,'public')
// const staticCategory = path.join(__dirname,'public/admin/category')
app.use(express.static(staticPath))
// app.use(express.static(staticCategory))
// set ejs view engine
app.set('view engine', 'ejs')
app.use(errorHandler)

app.all('*',(req,res) =>{
    res.render('404')
})



const PORT = process.env.PORT || 7000
app.listen(PORT,()=>{
    console.log(`app listining to port ${PORT}`)
})