const mongoose = require('mongoose')

const UserModel = mongoose.model('User', mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    surname: String,
    phone: Number,
    adress: String,
    age: Number,
    photo: String,
    role: String
}))

module.exports = UserModel