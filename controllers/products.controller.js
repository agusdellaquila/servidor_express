const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

const getProductsController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const products = await DAO.product.getAll()
        // require('./normalize-messages')
        res.render('products.ejs', {products})
    }
}
const postProductsController = async (req, res) => {
    res.send(await DAO.product.save(req.body))
}
//details
const getByIdProductsController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const id = req.params.id
        const data = await DAO.product.getByID(id)
        const product = data[0]
        res.render('details.ejs', {product})
    }
}
const deleteProductsController = async (req, res) => {
    const id = Number(req.params.id)
    await DAO.product.deleteByID(id)
    res.send(`Product with ID #${id} deleted.`)
}
const editProductsController =  async (req, res) => {
    const id = Number(req.params.id)
    await DAO.product.editById(req.body, id)
    const products = await DAO.product.getAll()
    const username = req.session.username
    res.render('products.ejs', {products, username})
}

module.exports = {getProductsController, postProductsController, getByIdProductsController, deleteProductsController, editProductsController}