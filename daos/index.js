const CartMongoDAO = require('./cart/cartMongoDAO')
const ProductMongoDAO = require('./products/productMongoDAO')
require('dotenv').config()

const FactoryDAO = () => {
    try {
        console.log('Generate DAO with mongo')
        return {
            cart: new CartMongoDAO(),
            product: new ProductMongoDAO()
        }
    } catch (e) {
        console.log('TYPE_DB is not found')
    }
}

module.exports = FactoryDAO