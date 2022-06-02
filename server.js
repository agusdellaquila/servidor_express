const express = require('express')
const productsRouter = require('./routes/productsRoutes')

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname +'/public'))

app.use('/api/products', productsRouter)

app.get('/api', (req, res)=>{
    res.sendFile(__dirname + '/public/products.html')
})

app.get('/api', (req, res)=>{
    res.send({ message: 'Server running ok'})
})

const server = app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}...`)
})
server.on('error', error => console.log('Error on server', error))