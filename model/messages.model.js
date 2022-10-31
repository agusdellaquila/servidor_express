const mongoose = require('mongoose')

const MessageModel = mongoose.model('Message',
    new mongoose.Schema({
        list: [],
        createdAt: Date
    })
)

module.exports = MessageModel