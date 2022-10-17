const { CarritosModel } = require('../model/cart.model')
const {GeneralDao} = require("./GeneralDao.js")

class CarritoService extends GeneralDao {

    ID_FIELD = "_id";

    static getInstance() {
        return new CarritoService();
    }

    constructor() {
        if(typeof CarritoService.instance === 'object') {
            return CarritoService.instance;
        }
        super();
        CarritoService.instance = this;
        return this;
    }

    async create() {
        try {
            return await CarritosModel.create({});
        } catch (error) {
            return false;
        }
    }

    async getAll() {
        try {
            return await CarritosModel.find();
        } catch (error) {
            return false;
        }
    }
    
    async deleteById(id) {
        try {
            return await CarritosModel.findByIdAndDelete({[this.ID_FIELD]: id})
        } catch (error) {
            return false;
        }
    }

    async saveProductToCart(id, idProd) {
        try {
            const cart = await CarritosModel.findById(id)
            console.log(cart.products);
            cart.products.push(idProd);
            cart.save();
            return true;
        } catch (error) {
            return false;
        }
    }
    
    async deleteProductFromCart(id, productId) {
        try {
            const cart = await CarritosModel.findById(id);
            cart.products.remove(productId);
            cart.save();
            return true;
        } catch (error) {
            return false;
        }
    }
    
    async getAllProductsFromCart(id) {
        try {
            return (await CarritosModel.findById(id).populate('products').select({products: 1, _id:0})).products;
        } catch (error) {
            return false;
        }
    }
}

module.exports = {CarritoService}