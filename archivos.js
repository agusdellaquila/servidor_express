const fs = require('fs')
const { resolve } = require('path')

class Contenedor {
    constructor (archivo) {
        this.archivo = archivo
        this.data = []
        this.id = 0

        try {
            this.start()
        } catch (error) {
            console.log('ocurrio el siguiente error: ' + error)
        }
	}

    start = async () => {
        this.data = await this.getAll()
    }

    save = async (object) => {
        try {
            this.id += 1
            await fs.promises.appendFile(this.archivo, JSON.stringify({...object, id: this.id}) + ',\n')
            return object.id
        } 
        catch (error) {
            console.error(error)
        }
    }

    getById = async (id) => {
        let all = await this.getAll()

        let foundItem = all.find(item => (item.id === id))
        if (foundItem == undefined) {
            foundItem = null
        }
        return foundItem
    }

    getAll = async () => {
        try {
            let reader = await fs.promises.readFile(this.archivo, 'utf-8')
            let readerFormatted = reader.split(',\n').filter(item => item != '')
            let readerParsed = readerFormatted.map( (e) => JSON.parse(e))
            return readerParsed
        }
        catch (error) {
            console.error(error)
        }
    }

    deleteById = async (id) => {
        let all = await this.getAll()
        let allWithoutDeletedItem = all.filter(item => item.id != id)
        console.log(...allWithoutDeletedItem) //en este console.log se ve que estan todos los items bien filtrados
        await fs.promises.writeFile(this.archivo, JSON.stringify(allWithoutDeletedItem) + ',\n') //pero si aqui los paso con el spread, no se escriben todos.
        //igual ahora sin el spread si se escribe y funciona, pero me parecio raro
    }

    deleteAll = async () => {
        try {
            await fs.promises.writeFile(this.archivo, '')
        }
        catch (error) {
            console.error(error)
        }
    }
}

module.exports = Contenedor