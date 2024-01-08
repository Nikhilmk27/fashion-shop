const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: 
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            mobile: {
                type: Number,
                required: true
            },
            zip_code: {
                type: Number,
                required: true
            },
            address: {
                type: String,
                required: true
            }
        }
    ,
    otp: {
        code: {
            type: String
        },
        expiry: {
            type: Date
        }
    }
});

module.exports = mongoose.model('User', userSchema);
