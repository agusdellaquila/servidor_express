const express = require('express')
const Router = require('express')
//---------------------------------------------------
const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/cart')
//---------------------------------------------------
const app = express()
const PORT = process.env.PORT || 8080
//---------------------------------------------------
app.set('views', './views')
app.set('view engine', 'ejs')
//---------------------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//---------------------------------------------------
app.use(express.static('./public'))
//---------------------------------------------------
app.use("/api/products", productsRouter)
//---------------------------------------------------
app.use("/api/cart", cartsRouter)
//---------------------------------------------------
app.use((req, res) => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.json({error: -2, description: `"${url}" method not implemented`})
})
//---------------------------------------------------
app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT} ...`)
})