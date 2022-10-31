const express = require('express')
//---------------------------------
const app = express()
const MongoStore = require('connect-mongo')
const session = require('express-session')
//const logger = require("./logger")
const {graphqlHTTP} = require("express-graphql")
const shemaql = require("./graphql/Schema.js")
const CarritoService = require("./services/carrito.service.js")
const ProductoService = require("./services/producto.service.js")
const OrderService = require("./services/order.service.js")
const MessageService = require("./services/messages.service.js")
const FactoryDAO = require('./daos/index')
const DAO = FactoryDAO()
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const cors = require("cors")
const http = require('http')
const { normalize, schema } = require('normalizr')
const { Server } = require('socket.io')
const httpServer = http.createServer(app)
const io = new Server(httpServer)
require('./config/config');
require('dotenv').config()

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
    rolling: true,
    cookie: {
        expires: 600000 
    },
    store: new MongoStore({
        mongoUrl: `mongodb+srv:${process.env.MONGO_URI}`,
        mongoOptions: advancedOptions
    })
}))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
//logger 
// app.use((req,res, next) => {
// 	logger.info(`Ruta: ${req.path}, Método: ${req.method}`)
// 	next()
// })
//---------------------------------
//Routes
const userRouter = require('./routes/user.routes')
const productsRouter = require('./routes/products.routes.js')
const cartsRouter = require('./routes/carts.routes.js')
const messagesRouter = require('./routes/messages.routes')

app.use('/', userRouter)
app.use('/products', productsRouter)
app.use('/cart', cartsRouter)
app.use('/chat', messagesRouter)
app.all("*", (req, res) => {
    res.render('notfound.ejs')
})
//---------------------------------

async function getAllCarritos() {
    return CarritoService.getInstance().getAll();
}

async function getAllProductos() {
    return ProductoService.getInstance().getAll();
}

async function createCarrito() {
    return CarritoService.getInstance().create();
}

async function deleteCarritoById({ id }) {
    return CarritoService.getInstance().deleteById(id);
}

async function getAllProductsFromCartById({ id }) {
    return CarritoService.getInstance().getAllProductsFromCart(id);
}

async function saveProductToCart({ id, idProd }) {
    return CarritoService.getInstance().saveProductToCart(id, idProd);
}

async function deleteProductFromCart({ id, idProd }) {
    return CarritoService.getInstance().deleteProductFromCart(id, idProd);
}

async function getProductById({ id }) {
    return ProductoService.getInstance().getProductById(id);
}

async function createProduct({ data }) {
    return ProductoService.getInstance().create(data);
}

async function updateProductById({ id, data }) {
    return ProductoService.getInstance().updateProductById(id, data);
}

async function deleteProductById({ id }) {
    return ProductoService.getInstance().deleteById(id);
}

async function createOrder() {
    return OrderService.getInstance().create()
}

async function createMessage() {
    return MessageService.getInstance().create()
}

app.use(
    '/graphql',
    graphqlHTTP({
        shemaql,
        rootValue: {
            getAllCarritos,
            getAllProductos,
            createCarrito,
            deleteCarritoById,
            getAllProductsFromCartById,
            saveProductToCart,
            deleteProductFromCart,
            getProductById,
            createProduct,
            updateProductById,
            deleteProductById,
            createOrder,
            createMessage
        },
        graphiql: true
    }
    )
)

//--------------------Socket chat-const 
const ContenedorMessages = require('./containers/contenedorMessages')
const messages = new ContenedorMessages('DB_messages.json')
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
    messages.read()

    const normalizedData = normalize(messages.data, [messageSchema])

    socket.emit('messages', normalizedData)

    socket.on('newMessage', async (msg) => {
        await messages.writeMessage(msg)
        const normalizedData = normalize(messages.data, [messageSchema])
        const messagesMongo = messages.read()
        await DAO.messages.messagesSave(messagesMongo)
        io.sockets.emit('messages', normalizedData)
    })
})

//---------------------------------
httpServer.listen(process.env.PORT || 80)
httpServer.on('error', error => console.log(`Error en servidor ${error}`))