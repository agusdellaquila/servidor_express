const mongoose = require('mongoose');

const CartModel = mongoose.model(
    'Cart', 
    new mongoose.Schema({
        products: [],
        createdAt: Date
    })
);
 
module.exports = CartModel;