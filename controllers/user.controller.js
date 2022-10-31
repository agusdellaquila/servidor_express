const FactoryDAO = require('../daos/index.js')
const DAO = FactoryDAO()
const UserModel = require('../model/user.model')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")
const email_notification = process.env.EMAIL_NOTIFICATION
const email_pass = process.env.EMAIL_PASS

const getUserLogin = async (req, res) => {
    try {
        let sessionUsername = req.session.userObject
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            res.render('home.ejs', {sessionUsername})
        }
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

const postUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        let sessionUsername
        UserModel.findOne({email: email}, async (error, foundItem) => {
            if (error) {
                res.render('error.ejs', {error})
            } else {
                if (foundItem) {
                    const compare = await bcrypt.compare(password, foundItem.password)
                    if (compare) {
                        req.session.userObject = foundItem
                        req.session.username = foundItem.username
                        sessionUsername = foundItem.username
                        const { id } = await DAO.cart.cartSave()
                        req.session.cartId = id
                        res.render('home.ejs', {sessionUsername})
                    } else {
                        res.render('error-login.ejs', {error: 'Incorrect password'})
                    }
                } else {
                    res.render('error-login.ejs', {error: 'Account not found'})
                }
            }
        })
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

const getUserLogout = async (req, res) => {
    try {
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            const username = req.session.username
            await DAO.cart.deleteCartByID(req.session.cartId)
            req.session.destroy(error => {
                if (!error) {
                    res.render('logout.ejs', {username})
                } else res.render('error.ejs', {error})
            })
        }
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

const getUserProfilePage = (req, res) => {
    try {
        if (!req.session.username) {
            res.render('login.ejs', {})
        } else {
            let userObject = req.session.userObject
            res.render('profile.ejs', {userObject})
        }
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

const getRegister = async (req, res) => {
    try {
        res.render('register.ejs', {})
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

const postRegister = async (req, res) => {
    try {
        const { username, email, password, name, surname, phone, adress, age, photo } = req.body
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: email_notification,
                pass: email_pass
            }
        })
        const rounds = 10
        bcrypt.hash(password, rounds, (error, hash) => {
            const newUser = new UserModel({
                username: username,
                password: hash,
                email: email,
                name: name,
                surname: surname,
                phone: phone,
                adress: adress,
                age: age,
                photo: photo,
                role: 'user'
            })
            UserModel.findOne({email: email}, (error, foundItem) => {
                if (error) {
                    console.log(error)
                    res.render('error-login.ejs', {error})
                } else {
                    if (foundItem) {
                        res.render('error-login.ejs', {error: 'This email is already in use'})
                    } else {
                        newUser.save()
                        .then(() => {
                            console.log('New user registered')
                            res.render('registered.ejs', {username})
                            transporter.sendMail({
                                from: email_notification,
                                to: [email_notification],
                                subject: 'Nuevo usuario registrado',
                                html: `<h1>${username}</h1>
                                        <p>email: ${email}</p>
                                        <p>nombre: ${name} ${surname}</p>
                                        <p>edad: ${age}</p>
                                        <p>direccion: ${adress}</p>`,
                            })
                            .then(r => console.log(r))
                            .catch(e => console.log(e))
                        })
                        .catch(error => {
                            res.render('error.ejs', {error})
                        })
                    }
                }
            })
        })
    } catch (error) {
        res.render('error.ejs', {error})
    }
}

module.exports = {getUserLogin, postUserLogin, getUserLogout, getUserProfilePage, getRegister, postRegister}