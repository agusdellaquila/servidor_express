const express = require('express');
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('./config');
require('dotenv').config();
const FactoryDAO = require('./daos/index');
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const app = express();

const { normalize, schema } = require('normalizr')
//---------------------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//---------------------------------------------------
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        expires: 600000 
    },
    store: new MongoStore({
        mongoUrl: `mongodb+srv:${process.env.MONGO_URI}`,
        mongoOptions: advancedOptions
    })
}))
//---------------------------------------------------
//RENDERS
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
const DAO = FactoryDAO()
//LOGIN
app.get('/login', async (req, res) => {
    if (req.session.username) {
        const sessionUsername = req.session.username
        res.render('home.ejs', {sessionUsername})
    } else {
        res.render('login.ejs', {})
    }
})
app.post('/login', async (req, res) => {
    const { username } = req.body
    const sessionUsername = username ? username : 'guest'
    req.session.username = sessionUsername
    res.render('home.ejs', {sessionUsername})
})

app.get('/logout', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const username = req.session.username
        req.session.destroy(err => {
            if (!err) {
                res.render('logout.ejs', {username})
            } else res.send({error: 'logout', body: err})
        })
    }
})
//PRODUCTS
app.get('/products', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const products = await DAO.product.getAll()
        // require('./normalize-messages')
        res.render('products.ejs', {products})
    }
})
app.post('/products', async (req, res) => res.send(await DAO.product.save(req.body)))
//DETAILS
app.get('/products/:id', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const id = req.params.id
        const product = await DAO.product.getByID(id)
        res.render('details.ejs', {product})
    }
})
//CART
app.get('/carts', async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const carts = await DAO.cart.getAll()
        console.log(carts)
        res.render('products.ejs', {carts})
    }
})
app.post('/cart', async (req, res) => res.send(await DAO.cart.save(req.body)))

//POST FORM
app.get('/form', (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        res.render('form.ejs')
    }
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