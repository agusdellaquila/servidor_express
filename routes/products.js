const Router = require('express')
//---------------------------------------------------
const Container = require('../containerProductosDB')
const options = require('../options/mariaDB')
const products = new Container(options, 'products')
//---------------------------------------------------
const productsRouter = Router()
//---------------------------------------------------
productsRouter.set('views', './views')
productsRouter.set('view engine', 'ejs')
//-----------------------GET----------------------------
productsRouter.get('/', (req, res)=>{
    products.selectProducts()
    res.render('products.ejs', {products})
})
productsRouter.get('/form', (req, res)=>{
    // const admin = req.headers.admin
    const admin = 'true'

    products.selectProducts()
    if (admin == 'true') {
        res.render('form.ejs', {products})
    } else {
        res.json({error: 'route with "/" method "GET" not authorized, not an admin'})
    }
})
productsRouter.get('/:id', async (req, res) => {
	const id = req.params.id

    products.selectProductById('id', '=', id)
    .then((product) => {
        product = product[0]
        product ? res.render('details.ejs', {product}) : res.json({error: 'Product not found.'})
    })
})
//-----------------------POST----------------------------
productsRouter.post('/form', async (req, res) => {
    // const admin = req.headers.admin
    const admin = 'true'

    if (admin == 'true') {
        let { title, price, stock, description, image } = req.body

        price = Number(price)
        stock = Number(stock)

        if (!title || !price || !stock || !description || !image) {
            return res.status(400).send({ message: 'missign fields' })
        }

        products.insertProduct([{ title, price, stock, description, timestamp: Date.now(), image }])
        .then(() => {
            products.data.push({title, price, stock, description, timestamp: Date.now(), image})
            res.render('products.ejs', {products})
        })
    } else {
        res.json({error: 'route with "/form" method "POST" not authorized, not an admin'})
    }
})
//-----------------------PUT-----------------------------
productsRouter.put('/:id', async (req, res) => {
    // const admin = req.headers.admin
    const admin = 'true'

    if (admin == 'true') {
        const id = req.params.id
        const field = Object.keys(req.body)[0]
        const newValue = Object.values(req.body)[0]

        products.updateProductById('id', '=', id, field, newValue)
        res.json({message: `Product with ID #${id} edited.`})
    } else {
        res.json({error: 'route with "/:id" method "PUT" not authorized, not an admin'})
    }
})
//-----------------------DELETE--------------------------
productsRouter.delete('/:id', async (req, res) => {
    // const admin = req.headers.admin
    const admin = 'true'

    if (admin == 'true') {
        const id = req.params.id
        products.deleteProductById('id', '=', id)
        res.json({error: `Deleted Successfully product #${id}`})
    } else {
        res.json({error: 'route with "/:id" method "delete" not authorized, not an admin'})
    }
})
//---------------------------------------------------
module.exports = productsRouter