const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId; 

class ContenedorMongo {

    constructor(model) {
        this.model = model  
        this.userCart = 'empty'
    }

    async save(obj) {
        const newProduct = new this.model(obj);
        await newProduct.save()
        return newProduct
    }

    async cartSave(obj) {
        const newCart = new this.model()
        this.userCart = newCart
        await newCart.save()
        return newCart
    }

    async addToCart(obj) {
        this.userCart.products.push(obj[0])
        this.userCart.save()
    }

    async getByID(id) {
        return this.model.find({_id: new ObjectId(id)})
    }

    async getAll() {
        return this.model.find({})
    }

    async editById(obj, id) {
        console.log('UPDATE');
        const objUpdated = await this.model.updateOne(
            { _id: new ObjectId(id)},
            { $set: obj }
        )
        
        return objUpdated
    }

    async deleteByID(id) {
        const userDelete = await this.model.deleteOne({_id: new ObjectId(id)})
        return true
    }

    async deleteCartById(id) {
        await this.model.deleteOne({_id: new ObjectId(id)})
    }


}

module.exports = ContenedorMongo;