const { Router } = require('express')
const router = Router()
const product = require('../controllers/products.controller')

router.get('/', product.getProductsController)
router.post('/', product.postProductsController)
router.get('/addProduct', product.getAddProductController)
router.get('/:id', product.getByIdProductsController)
router.delete('/:id', product.deleteProductsController)
router.get('/:id/edit', product.getEditProductsController)
router.put('/:id/edit', product.editProductsController)

module.exports = router