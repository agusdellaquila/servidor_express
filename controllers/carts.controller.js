const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

const getCartsController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const cart = await DAO.cart.getAll()
        const userCart = cart[0].products
        res.render('carts.ejs', {userCart})
    }
}
const postCartsController = async (req, res) => {
    const { addID } = req.body
    const productToAdd = await DAO.product.getByID(addID)
    if (productToAdd.length > 0) {
        res.send(await DAO.cart.addToCart(productToAdd))
    } else {
        res.send({error: 'The product does not belong to our inventory.'})
    }
}
const deleteCartsController = async (req, res) => {
    await DAO.cart.deleteAll()
    res.send('All cart products deleted.')
}
const deleteByIdCartsController = async (req, res) => {
    const id = req.params.id
    await DAO.cart.deleteByID(id)
    res.send(`Product with ID #${id} deleted from cart.`)
}

module.exports = {getCartsController, postCartsController, deleteCartsController, deleteByIdCartsController}