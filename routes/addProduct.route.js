const { Router } = require('express')
const {getAddProductController} = require('../controllers/addProduct.controller')

const addProductRouter = Router()

addProductRouter.get('/', getAddProductController)

module.exports = addProductRouter;