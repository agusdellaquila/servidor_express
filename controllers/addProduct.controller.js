const getAddProductController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        res.render('addProduct.ejs')
    }
}

module.exports = {getAddProductController}