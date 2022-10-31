const { Router } = require('express')
const router = Router()
const cart = require('../controllers/cart.controller')

router.get('/', cart.getCartsController)
router.post('/order', cart.postOrderCartsController)
router.post('/', cart.postCartsController)
router.delete('/deleteAll', cart.deleteCartsController)
router.delete('/:id', cart.deleteByIdCartsController)

module.exports = router