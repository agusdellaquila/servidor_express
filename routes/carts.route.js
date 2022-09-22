const { Router } = require('express')
const {getCartsController, postCartsController, deleteCartsController, deleteByIdCartsController} = require('../controllers/carts.controller')


const cartsRouter = Router()

cartsRouter.get('/', getCartsController)
cartsRouter.post('/', postCartsController)
cartsRouter.delete('/', deleteCartsController)
cartsRouter.delete('/:id', deleteByIdCartsController)

module.exports = cartsRouter;