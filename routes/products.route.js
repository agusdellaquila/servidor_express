const { Router } = require('express')
const {getProductsController, postProductsController, getByIdProductsController, deleteProductsController, editProductsController} = require('../controllers/products.controller')

const productsRouter = Router()

productsRouter.get('/', getProductsController)
productsRouter.post('/', postProductsController)
productsRouter.get('/:id', getByIdProductsController)
productsRouter.delete('/:id', deleteProductsController)
productsRouter.put('/:id', editProductsController)

module.exports = productsRouter;