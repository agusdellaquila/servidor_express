const express = require('express')
const Router = require('express')
//---------------------------------------------------
const productsRouter = require('./routes/products')
// const cartsRouter = require('./routes/cart')
//-------------------------------------------------
const app = express()
const PORT = process.env.PORT || 8080
//-------------------------------------------------
const ContainerMessages = require('./containerMessagesDB')
const optionsMessages = require('./options/sqlite3')
const messages = new ContainerMessages(optionsMessages, 'messages')
//-------------------------------------------------
const http = require('http')
const { Server } = require('socket.io')
const httpServer = http.createServer(app)
const io = new Server(httpServer)
//-------------------------------------------------
app.set('views', './views')
app.set('view engine', 'ejs')
//-------------------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//-------------------------------------------------
app.use(express.static(__dirname + '/public'))
//-------------------------------------------------
app.use("/api/products", productsRouter)
//---------------------------------------------------
// app.use("/api/cart", cartsRouter)
//---------------------------------------------------
// app.use((req, res) => {
//     const url = req.protocol + '://' + req.get('host') + req.originalUrl;
//     res.json({error: -2, description: `"${url}" method not implemented`})
// })
//---------------------------------------------------
io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado: ' + socket.id)

    //messages
    messages.selectMessages()
    socket.emit('messages', messages.data)

    socket.on('newMessage', newMessage => {
        messages.insertMessage([newMessage])
        .then(() => {
            messages.data.push(newMessage)
            io.sockets.emit('messages', messages.data)
        })
    })
})
//---------------------------------------------------
httpServer.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT} ...`)
})