const ContenedorMongo = require('../../containers/contenedorMongo')
const ProductModel = require('../../model/product.model')

class ProductMongoDAO extends ContenedorMongo {
    
    constructor() {
        super(ProductModel)
    }

}

module.exports = ProductMongoDAO