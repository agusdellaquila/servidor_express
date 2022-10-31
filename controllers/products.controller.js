const FactoryDAO = require('../daos/index')
const DAO = FactoryDAO()

const getProductsController = async (req, res) => {
    try {
        let sessionUsername = req.session.userObject
        let email = sessionUsername.email
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            const products = await DAO.product.getAll()
            res.render('products.ejs', {products, sessionUsername, email})
        }
    } catch (error) {
        res.render('error.ejs', {error})
    }
}
const postProductsController = async (req, res) => {
    try {
        await DAO.product.save(req.body)
        res.redirect('/products')
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

const getByIdProductsController = async (req, res) => {
    try {
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            const id = req.params.id
            await DAO.product.getByID(id).then((data) => {
                if (data !== undefined && data.length) {
                    const product = data[0]
                    res.render('details.ejs', {product})
                } else {
                    res.render('notfound.ejs')
                }
            })
        }
    }
    catch (error) {
        res.render('error.ejs', {error})
    }
}

const deleteProductsController = async (req, res) => {
    try {
        let sessionUsername = req.session.userObject
        if (sessionUsername.role === 'admin') {
            const id = req.params.id
            await DAO.product.deleteByID(id)
            res.redirect('/products')
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

const getEditProductsController =  async (req, res) => {
    try {
        let sessionUsername = req.session.userObject
        if (sessionUsername.role === 'admin') {
            const id = req.params.id
            DAO.product.getByID(id).then((data) => {
                if (data !== undefined && data.length) {
                    const prod = data[0]
                    res.render('edit.ejs', {prod})
                } else {
                    res.render('notfound.ejs')
                }
            })
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

const editProductsController =  async (req, res) => {
    try {
        let sessionUsername = req.session.userObject
        if (sessionUsername.role === 'admin') {
            const id = req.params.id
            await DAO.product.editById(req.body, id)
            res.redirect('/products')
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

const getAddProductController = async (req, res) => {
    try {
        let sessionUsername = req.session.userObject
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            if (sessionUsername.role === 'admin') {
                res.render('addProduct.ejs')
            } else {
                res.redirect('/')
            }
        }
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

module.exports = {getProductsController, postProductsController, getByIdProductsController, deleteProductsController, getEditProductsController, editProductsController, getAddProductController}