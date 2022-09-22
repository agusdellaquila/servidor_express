const getAddProductController = async (req, res) => {
    if (!req.session.username) {
        res.render('login.ejs', {})
    } else {
        res.render('form.ejs')
    }
}

module.exports = {getAddProductController}