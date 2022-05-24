const express = require('express')
const Contenedor = require('./archivos.js')
const productos = new Contenedor('productos.txt')

const app = express() //ahora app tiene todos los metodos de express

const PORT = 8080

app.get('/', (req, res) => {
    res.send('<h1 style="color: blue;">Bienvenidos a EnPie Wines</h1>')
})

app.get('/productos', (req, res) => {
    res.json(productos.data)
})

app.get('/productoRandom', (req, res) => {
    const productoRandom = Math.ceil(Math.random() * (productos.data.length))
    console.log(productoRandom)
    res.json(productos.data[productoRandom])
})

const server = app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}...`)
})

server.on('error', error => console.log('Error on server', error))