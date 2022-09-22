const UserModel = require('../model/user.model')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")
const email_notification = 'agusdellaquila12@gmail.com'

const getProfileController = async (req, res) => {
    res.render('register.ejs', {})
}
const postProfileController = async (req, res) => {
    const { username, email, password, name, surname, phone, adress, age, photo } = req.body
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: email_notification,
            pass: 'ogtgxxiaifyycdpm'
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
            role: 'admin'
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
                        console.log(error)
                    })
                }
            }
        })
    })
}

module.exports = {getProfileController, postProfileController}