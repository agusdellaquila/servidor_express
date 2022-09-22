const express = require('express')
//---------------------------------
const app = express();
const MongoStore = require('connect-mongo')
const session = require('express-session')
//const logger = require("./logger")
// const { normalize, schema } = require('normalizr') //Para el chat
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const cors = require("cors")
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
const registerRouter = require('./routes/register.route.js')
const loginRouter = require('./routes/login.route.js')
const logoutRouter = require('./routes/logout.route.js')
const productsRouter = require('./routes/products.route.js')
const addProductRouter = require('./routes/addProduct.route.js')
const cartsRouter = require('./routes/carts.route.js')
const profileRouter = require('./routes/profile.route.js')

app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/products', productsRouter)
app.use('/addProduct', addProductRouter)
app.use('/cart', cartsRouter)
app.use('/profile', profileRouter)
//---------------------------------
app.listen((process.env.PORT || 80), () => {
	console.log(`Server listening on port: 80 ...`)
})
app.on('error', error => console.log(`Error: ${error}`))

//--------------------Socket chat--------------------
// const ContenedorMensajes = require('./contenedores/contenedorMensajes')
// const messages = new ContenedorMensajes('DB_messages.json')
// const http = require('http')
// const { Server } = require('socket.io')
// const httpServer = http.createServer(app)
// const io = new Server(httpServer)

// const user = new schema.Entity('users')
// const message = new schema.Entity('messages', {
//     messenger: user
// })
// const messageSchema = new schema.Entity('message', {
// 	author: user,
//     messages: [message]
// })

// io.on('connection', function(socket) {
//     console.log('Un cliente se ha conectado: ' + socket.id)

//     messages.selectMessages()

//     const normalizedData = normalize(messages.data, [messageSchema])

//     socket.emit('messages', normalizedData)

//     socket.on('newMessage', async (newMessage) => {
//         await messages.writeMessage(newMessage)
//         messages.selectMessages()
//         const messageSchema = normalize(messages.data, [messageSchema])
//         io.sockets.emit('messages', normalizedData)
//     })
// })
//---------------------------------------------------


//TWILIO WHATSAPP
// const accountSid = 'AC8f36b58666fb36bbe53c79d15dbf8298'; 
// const authToken = '[AuthToken]'; 
// const client = require('twilio')(accountSid, authToken); 

// client.messages 
//     .create({ 
//         body: 'Your Yummy Cupcakes Company order of 1 dozen frosted cupcakes has shipped and should be delivered on July 10, 2019. Details: http://www.yummycupcakes.com/', 
//         from: 'whatsapp:+14155238886',       
//         to: 'whatsapp:+5491122428587' 
//     }) 
//     .then(message => console.log(message.sid)) 
//     .done();