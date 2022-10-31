const mongoose = require('mongoose')

const OrderModel = mongoose.model('Order',
    new mongoose.Schema({
        user: String,
        products: [],
        createdAt: Date
    })
)

module.exports = OrderModel