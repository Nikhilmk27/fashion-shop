// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'usecollections' },
//     items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    
// });

// const Cart = mongoose.model('Cart', cartSchema);

// module.exports = Cart;
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'usecollections' },
    items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number,size:String }],
    
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
