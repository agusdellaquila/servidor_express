const Router = require('express')
//---------------------------------------------------
const Container = require('../container')
const products = new Container('products.txt')
products.start()
//---------------------------------------------------
const productsRouter = Router()
//---------------------------------------------------
productsRouter.set('views', './views')
productsRouter.set('view engine', 'ejs')
//-----------------------GET----------------------------
productsRouter.get('/', (req, res)=>{
    res.render('products.ejs', {products})
})
productsRouter.get('/form', (req, res)=>{
    const admin = req.headers.admin

    if (admin == 'true') {
        res.render('form.ejs', {products})
    } else {
        res.json({error: 'route with "/" method "GET" not authorized, not an admin'})
    }
})
productsRouter.get('/:id', async (req, res) => {
	const id = Number(req.params.id)

    const product = await products.getById(id)

    if (!product) {
        return res.status(400).send({error: `product with id: ${id} does not exist`})
    }

    res.render('details.ejs', {product})
})
//-----------------------POST----------------------------
productsRouter.post('/form', async (req, res) => {
    const admin = req.headers.admin

    if (admin == 'true') {
        const { title, price, stock, description, image } = req.body

        if (!title || !price || !stock || !description || !image) {
            return res.status(400).send({ message: '' })
        }

        await products.save({ title, price, stock, description, image })
        await products.start()

        res.render('products.ejs', {products})
    } else {
        res.json({error: 'route with "/form" method "POST" not authorized, not an admin'})
    }
})
//-----------------------PUT-----------------------------
productsRouter.put('/:id', async (req, res) => {
    const admin = req.headers.admin

    if (admin == 'true') {
        const { id } = req.params
        const field = Object.keys(req.body)[0]
        const value = Object.values(req.body)[0]
        const objProduct = await products.getById(Number(id))
        if (objProduct) {
            await products.editById(Number(id), field, value)
            res.send({message: `Modified product with ID #${id} field ${field} value ${value}`})
        } else {
            res.send({error: 'Product not found'})
        }
    } else {
        res.json({error: 'route with "/:id" method "PUT" not authorized, not an admin'})
    }
})
//-----------------------DELETE--------------------------
productsRouter.delete('/:id', async (req, res) => {
    const admin = req.headers.admin

    if (admin == 'true') {
        const id = Number(req.params.id)
        const product = await products.getById(id)
        if (product) {
            await products.deleteById(id)
            res.send('Product deleted.')
        } else {
            response.send({error: 'Product not found.'})
        }
    } else {
        res.json({error: 'route with "/:id" method "delete" not authorized, not an admin'})
    }
})
//---------------------------------------------------
module.exports = productsRouter