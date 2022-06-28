class Contenedor {
    constructor (options, tableName){
        try {
            const knex = require('knex')(options)
            this.knex = knex
            this.options = options
            this.tableName = tableName

            knex.schema.createTable(tableName, table => {
                table.string('username')
                table.string('message')
                table.integer('timestamp')
            })
            .then( () => console.log("Table created"))
            .catch( () => {console.log('Table already exists')}) 

            this.data = this.selectMessages()
        } catch (error) {
            console.log('ocurrio el siguiente error: ' + error)
        }
	}

    insertMessage(message) {
        return this.knex(this.tableName).insert(message)
    }

    selectMessages() {
        this.knex.from(this.tableName).select('*')
        .then(message => {
            message ? this.data = message : this.data = []
        })
        .catch( err => {console.log(err); throw err})
    }
}

module.exports = Contenedor