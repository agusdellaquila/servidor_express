const express = require('express')
const Container = require('./container')
const products = new Container('products.txt')
products.start()

const app = express()
const PORT = process.env.PORT || 8080

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname +'/public'))

app.get('/', (req, res)=>{
    res.render('form.ejs', {products})
})

app.get('/products', (req, res)=>{
    res.render('products.ejs', {products})
})

app.post('/products', async (req, res) => {
    const { title, price, stock, image } = req.body

    if (!title || !price || !stock || !image) {
        return res.status(400).send({ message: '' })
    }

    await products.save({ title, price, stock, image })
    await products.start()

    res.send({  message: 'Product posted succesfully!'})
})

const server = app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}...`)
})
server.on('error', error => console.log('Error on server', error))