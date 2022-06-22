const Router = require('express')
//---------------------------------------------------
const Container = require('../container')
const products = new Container('products.txt')
products.start()
//---------------------------------------------------
const CartContainer = require('../cartContainer')
const carts = new CartContainer('cart.txt')
carts.start()
//---------------------------------------------------
const cartsRouter = Router()
//---------------------------------------------------
cartsRouter.set('views', './views')
cartsRouter.set('view engine', 'ejs')
//-----------------------GET----------------------------
cartsRouter.get('/:id/products', async (req, res) => {
    const id = Number(req.params.id)
    const cart = await carts.getById(id)

    if (cart) {
        if (cart.products.length > 0) {
            res.json(cart.products)
        } else {
            res.json({error: 'empty cart'})
        }
    } else {
        res.json({error: 'cart not found'})
    }
})
//-----------------------POST----------------------------
cartsRouter.post('/', async (req, res) => {
    await carts.save({timestamp: new Date().toLocaleTimeString, products: []})
    res.send({message: 'Cart created successfully'})
})
cartsRouter.post('/:id/products', async (req, res) => {
    const cartId = Number(req.params.id)
    const { id } =  req.body
    const cart = await carts.getById(cartId)

    if (cart) {
        const index = carts.data.findIndex(c => c.id == cart.id)
        const product = await products.getById(id)
        
        cart.products.push(product)
        carts.data[index] = cart
        carts.edit(carts.data)
        res.json({message: `Product #${id} added successfully to cart #${cartId}`})
    } else {
        res.json({error: 'cart not found'})
    }
})
//-----------------------DELETE----------------------------
cartsRouter.delete('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const objProduct = await carts.getById(id)

    if (objProduct) {
        carts.deleteById(id)
        res.json(`Cart #${id} deleted successfuly`)
    } else {
        res.json({error: 'cart not found'})
    }
})

cartsRouter.delete('/:id/products/:prodId', async (req, res) => {
    const cartId = Number(req.params.id)
    const productId = Number(req.params.prodId)

    const deleted = await carts.deleteProductById(cartId, productId)

    if (deleted) {
        res.json({message: `Product in cart deleted successfully`})
    } else {
        res.json({error: 'Product in cart not deleted'})
    }
})
//---------------------------------------------------
module.exports = cartsRouter