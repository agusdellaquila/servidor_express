const UserModel = require('../model/user.model')
const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()
const bcrypt = require('bcrypt')

const getLoginController = async (req, res) => {
    if (req.session.username) {
        res.render('home.ejs')
    } else {
        res.render('login.ejs', {})
    }
}
const postLoginController = async (req, res) => {
    const { email, password } = req.body
    let sessionUsername
    UserModel.findOne({email: email}, async (error, foundItem) => {
        if (error) {
            res.send(error)
        } else {
            if (foundItem) {
                const compare = await bcrypt.compare(password, foundItem.password)
                req.session.userObject = foundItem
                req.session.username = foundItem.username
                sessionUsername = foundItem.username
                if (compare) {
                    const products = await DAO.product.getAll()
                    const { id } = await DAO.cart.cartSave()
                    req.session.cartId = id
                    console.log('CART_ID: ' + req.session.cartID)
                    res.render('home.ejs', {products, sessionUsername})
                } else {
                    res.render('error-login.ejs', {error: 'Incorrect password'})
                }
            } else {
                res.render('error-login.ejs', {error: 'Account not found'})
            }
        }
    })
}

module.exports = {getLoginController, postLoginController}