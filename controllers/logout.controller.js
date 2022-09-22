const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

const getLogoutController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        const username = req.session.username
        await DAO.cart.deleteCartById(req.session.cartId)
        req.session.destroy(err => {
            if (!err) {
                res.render('logout.ejs', {username})
            } else res.send({error: 'logout', body: err})
        })
    }
}
module.exports = {getLogoutController}