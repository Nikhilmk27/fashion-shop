const mongoose = require('mongoose')
const userColllectionSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
})
module.exports = mongoose.model('usecollection',userColllectionSchema)