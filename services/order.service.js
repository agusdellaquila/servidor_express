const {OrderModel} = require("../model/order.model")
const {GeneralDao} = require("./GeneralDao.js")

class OrderService extends GeneralDao{

    ID_FIELD = "_id";

    static getInstance() {
        return new OrderService();
    }

    constructor() {
        if(typeof OrderService.instance === 'object') {
            return OrderService.instance;
        }
        super();
        OrderService.instance = this;
        return this;
    }

    async create() {
        try {
            return await OrderModel.create({});
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

}

module.exports = OrderService