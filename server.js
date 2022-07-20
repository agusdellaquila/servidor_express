const express = require('express');
require('./config');
const FactoryDAO = require('./daos/index');
const app = express();

const { normalize, schema } = require('normalizr')
//---------------------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//---------------------------------------------------
//RENDERS
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
const DAO = FactoryDAO()
//PRODUCTS
app.get('/products', async (req, res) => {
    const products = await DAO.product.getAll()
    // require('./normalize-messages')
    res.render('products.ejs', {products})
})
app.post('/products', async (req, res) => res.send(await DAO.product.save(req.body)))
//DETAILS
app.get('/products/:id', async (req, res) => {
    const id = req.params.id
    const product = await DAO.product.getByID(id)
    res.render('details.ejs', {product})
})
//CART
app.get('/carts', async (req, res) => {
    const carts = await DAO.cart.getAll()
    console.log(carts)
    res.render('products.ejs', {carts})
})
app.post('/cart', async (req, res) => res.send(await DAO.cart.save(req.body)))

//POST FORM
app.get('/form', (req, res) => {
    res.render('form.ejs')
})
//--------------------Socket chat--------------------
const ContenedorMensajes = require('./contenedores/contenedorMensajes')
const messages = new ContenedorMensajes('DB_messages.json')
const http = require('http')
const { Server } = require('socket.io')
const httpServer = http.createServer(app)
const io = new Server(httpServer)

const user = new schema.Entity('users')
const message = new schema.Entity('messages', {
    messenger: user
})
const messageSchema = new schema.Entity('message', {
	author: user,
    messages: [message]
})

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado: ' + socket.id)

    messages.selectMessages()

    const normalizedData = normalize(messages.data, [messageSchema])

    socket.emit('messages', normalizedData)

    socket.on('newMessage', async (newMessage) => {
        await messages.writeMessage(newMessage)
        messages.selectMessages()
        const messageSchema = normalize(messages.data, [messageSchema])
        io.sockets.emit('messages', normalizedData)
    })
})
//---------------------------------------------------
httpServer.listen(8080, () => {
	console.log(`Server listening on port: 8080 ...`)
})