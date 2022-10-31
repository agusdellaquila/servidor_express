const ContenedorMongo = require('../../containers/contenedorMongo')
const OrderModel = require('../../model/order.model')

class OrderMongoDAO extends ContenedorMongo {

    constructor() {
        super(OrderModel)
    }

}

module.exports = OrderMongoDAO