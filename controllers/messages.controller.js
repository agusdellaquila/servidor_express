const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

const getAllMessages = async (req, res) => {
    try {
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            const email = req.session.userObject.email
            DAO.messages.getByEmail(email)
            .then((messages) => {
                console.log('messages', messages)
                res.render('messages.ejs', {messages, email})
            })
            .catch((error) => {
                res.render('error.ejs', {error})
            })
        }
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

module.exports = {getAllMessages}