const ObjectId = require('mongoose').Types.ObjectId 

class ContenedorMongo {

    constructor(model) {
        this.model = model  
        this.userCart = []
    }

    async save(obj) {
        const newProduct = new this.model(obj)
        await newProduct.save()
        return newProduct
    }

    async cartSave(obj) {
        const newCart = new this.model()
        this.userCart = newCart
        await this.userCart.save()
        return newCart
    }

    async orderSave(cartProds) {
        const newOrder = new this.model()
        this.userCart = newOrder
        this.userCart.products = [...this.userCart.products, cartProds[0].products]
        await this.userCart.save()
        return this.userCart.products
    }

    async insertProductInCart(obj, id) {
        const cart = await this.getByID(id)
        cart[0].products.push(obj[0])
        cart[0].save()
    }

    async deleteCartByID(id) {
        await this.model.deleteOne({_id: id})
    }

    async getByID(id) {
        try {
            return await this.model.find({_id: id})
        } catch (err) {
            console.log('No existe éste producto.')
        }
    }

    async getAll() {
        return await this.model.find({})
    }

    async editById(obj, id) {
        const objUpdated = await this.model.updateOne(
            { _id: new ObjectId(id)},
            { $set: obj }
        )
        return objUpdated
    }

    async deleteByID(id) {
        await this.model.deleteOne({_id: id})
        return true
    }

    async deleteProductInCart(cartId, prodId) {
        const cart = await this.getByID(cartId)
        let index
        for (let i = 0; i < cart[0].products.length; i++) {
            if (prodId == cart[0].products[i]._id) {
                index = i
            }
        }
        cart[0].products.splice(index, 1)
        cart[0].save()
    }

    async deleteAllProductsInCart(cartId) {
        const cart = await this.getByID(cartId)
        cart[0].products.splice(0, cart[0].products.length)
        cart[0].save()
    }

    async messagesSave(messages) {
        const messagesFetch = await this.getAll()
        if (messagesFetch[0]) {
            messagesFetch[0].list = messages
            await messagesFetch[0].save()
        } else {
            const messagesModel = new this.model()
            messagesModel.list = messages
            await messagesModel.save()
        }
    }

    async getByEmail(email) {
        const messages = await this.getMessages()
        const userMessages = messages[0].list.map(message => {
            if (message.author.id == email) {
                return message.text
            }
        }).filter(message => {
            return message !== undefined
        })
        return userMessages
    }

    async getMessages() {
        return await this.model.find({})
    }
}

module.exports = ContenedorMongo