const CartMongoDAO = require('./cart/cartMongoDAO')
const ProductMongoDAO = require('./products/productMongoDAO')
const OrderMongoDAO = require('./order/orderMongoDAO')
const MessagesMongoDAO = require('./messages/messagesMongoDAO')
require('dotenv').config()

const FactoryDAO = () => {
    try {
        console.log('Generate DAO with mongo')
        return {
            cart: new CartMongoDAO(),
            product: new ProductMongoDAO(),
            order: new OrderMongoDAO(),
            messages: new MessagesMongoDAO()
        }
    } catch (e) {
        console.log('TYPE_DB is not found')
    }
}

module.exports = FactoryDAO