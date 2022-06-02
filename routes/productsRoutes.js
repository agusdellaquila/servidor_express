const { Router } = require('express')
const Container = require('../container')

const products = new Container('products.txt')
products.start()

const router = Router()
//-----------------------GET----------------------------
router.get('/', (req, res) => {
    res.json(products.data)
})
router.get('/:id', async (req, res) => {
	const id = Number(req.params.id)

    // if (isNaN(id)) {
    //     return res.status(400).send({error: 'El parametro debe ser un numero'})
    // }
    // if (id > products.data.length()) {
    //     return res.status(400).send({error: 'El esta fuera de rango'})
    // }
    // if (id < 0) {
    //     return res.status(400).send({error: 'El parametro debe ser mayor que cero'})
    // }

    const product = await products.getById(id)

    if (!product) {
        return res.status(400).send({error: `La perosna con el id: ${id} no existe`})
    }

    res.send(product)
})
//-----------------------POST----------------------------
router.post('/', async (req, res) => {
    const { title, price, stock } = req.body

    if (!title || !price || !stock) {
        return res.status(400).send({ message: '' })
    }

    await products.save({ title, price, stock })
    await  products.start()

    res.send({  message: 'Product posted succesfully!'})
})
//-----------------------PUT-----------------------------
router.put('/:id', async (req, res) => {
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
})
//-----------------------DELETE--------------------------
router.delete('/:id', async (req, res) => {
	const id = Number(req.params.id)
    const product = await products.getById(id)
    if (product) {
        await products.deleteById(id)
        res.send('Product deleted.')
    } else {
        response.send({error: 'Product not found.'})
    }
})

module.exports = router