class Contenedor {
    constructor (options, tableName) {
        try {
            const knex = require('knex')(options)
            this.knex = knex
            this.options = options
            this.tableName = tableName
            this.data = this.selectProducts()

            knex.schema.createTable(tableName, table => {
                table.increments('id')
                table.string('title')
                table.integer('price')
                table.integer('stock')
                table.string('description')
                table.integer('timestamp')
                table.string('image')
            })
            .then( () => console.log("Table created"))
            .catch( () => {console.log('table already exists')}) 
        } catch (error) {
            console.log('ocurrio el siguiente error: ' + error)
        }
	}

    insertProduct(products) { //arr of obj
        return this.knex(this.tableName).insert(products)
    }

    deleteProductById(field, condition, value) {
        this.knex.from(this.tableName)
        .where(field, condition, value)
        .del()
        .then( () => this.selectProducts())
        .catch( err => {console.log(err); throw err})
    }

    selectProducts() {
        this.knex.from(this.tableName).select('*')
        .then(prods => {
            prods ? this.data = prods : this.data = []
        })
        .catch( err => {console.log(err); throw err})
    }

    selectProductById(field, condition, value) {
        return this.knex.from(this.tableName).select(['id', 'title', 'price', 'description', 'stock', 'timestamp', 'image'])
        .where(field, condition, value)
    }

    updateProductById(id, condition, value, field, newValue) {
        let objectProduct = {}
        objectProduct[field] = newValue

        this.knex.from(this.tableName)
        .where(id, condition, value)
        .update(objectProduct)
        .then(() => this.selectProducts())
        .catch(error => console.log(error))
    }
}

module.exports = Contenedor