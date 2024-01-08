require('dotenv').config();
const express = require('express')
const userRout = require('./routs/userRout')
const path = require('path')
const session = require('express-session')
const connnectDB = require('./model/dbModel')
const cookieparser = require('cookie-parser')
// const session = require('express-session')
const app = express()
// connecting to database
connnectDB()
// for parsing the url to json,string or array format
app.use(express.urlencoded({ extended: true }))
app.use(cookieparser())
// session middleweare
app.use(session({
    resave: false,
    saveUninitialized: true,
    /// secret: process.env.SESSION_SECRET,
    secret: 'your_secret_key_here'
}))

app.use('/',userRout)
// for adding externel file to view engine(static files)
const staticPath = path.join(__dirname,'public')
app.use(express.static(staticPath))
// set ejs view engine
app.set('view engine', 'ejs')

app.all('*',(req,res) =>{
    res.render('404')
})

const PORT = process.env.PORT || 7000
app.listen(PORT,()=>{
    console.log(`app listining to port ${PORT}`)
})