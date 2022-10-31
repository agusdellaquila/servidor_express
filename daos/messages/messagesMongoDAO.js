const ContenedorMongo = require('../../containers/contenedorMongo')
const MessageModel = require('../../model/messages.model')

class MessageMongoDAO extends ContenedorMongo {

    constructor() {
        super(MessageModel)
    }

}

module.exports = MessageMongoDAO