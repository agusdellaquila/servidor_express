require("../config/config.js")

class GeneralDao {

    constructor() {
        if (this.constructor === GeneralDao) {
            throw new Error('Class "GeneralDao" cannot be instantiated')
        }
    }

    create() {
        throw new Error('Method create() must be implemented')
    }

    getAll() {
        throw new Error('Method getAll() must be implemented')
    }

    deleteById() {
        throw new Error('Method deleteById() must be implemented')
    }
}

module.exports = {GeneralDao}