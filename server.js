const express = require('express')
const Container = require('./container')
const products = new Container('products.txt')
products.start()
const ContainerMessages = require('./containerMessages')
const messages = new Container('messages.txt')
messages.start()

const http = require('http')
const { Server } = require('socket.io')

const app = express()
const PORT = process.env.PORT || 8080
const httpServer = http.createServer(app)
const io = new Server(httpServer)

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('./public'))

app.get('/form', (req, res) => {
    res.render('form.ejs', {products})
})

app.get('/products', (req, res)=>{
    res.render('products.ejs', {products})
})

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado: ' + socket.id)

    //products
    socket.emit('products', products)

    socket.on('newProduct', async newProduct => {
        await products.save(newProduct)
        io.sockets.emit('products', products)
    })

    //messages
    socket.emit('messages', messages)

    socket.on('newMessage', async newMessage => {
        await messages.save(newMessage)
        io.sockets.emit('messages', messages)
    })
})

httpServer.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT} ...`)
})