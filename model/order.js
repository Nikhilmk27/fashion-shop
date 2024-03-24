const mongoose= require('mongoose')

const orderSchema= new mongoose.Schema(({

user:{

    type:mongoose.Types.ObjectId,
    ref:'UserCollection',
    required:true
    
},

order_details: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "productModel" },
      quantity: Number,
    }
  ],
  total_price:{

    type:Number,
  },
//   discount:{

//     type:Number
//   },
address:{
    
    email:{
        type:String,
        // required:true
    },
    firstName:{
        type:String,
        // required:true
    },
    lastName:{
        type:String,
        // required:true
    },
    country:{
        type:String,
        // required:true
    },
    city:{
        type:String,
        // required:true
    },
    state:{
        type:String,
        // required:true
    },
    pincode:{
        type:String,
        // required:true
    },
    
    phone:{
        type:Number,
        // required:true
    },
   
    address:{
        type:String,
        // required:true
    }
},
status:{

    type:String,
    default:'pending'
},
paymentMethod:{

    type:String,
    // required:true
},
placedDate:{

    type:Date,
    default:Date.now()
},
DeliveredDate:{
    type:Date
},
// couponApplied:String

}))

module.exports=mongoose.model('order',orderSchema)