const fs = require('fs')

class Contenedor {
    constructor (archivo) {
        this.archivo = archivo
        this.data = []

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
            await this.start()
            object = {...object, id: this.data.length + 1}
            this.data.push(object)
            await fs.promises.appendFile(this.archivo, JSON.stringify(object) + '\n')
            return object.id
        } 
        catch (error) {
            console.error(error)
        }
    }

    getById = async (id) => {
        try {
            let all = await this.getAll()
            let found = null
            all.forEach(product => {
                if (product.id === id) {
                    found = product
                }
            })
            return found
        }
        catch (error) {
            console.error(error)
        }
    }

    getAll = async () => {
        try {
            let reader = await fs.promises.readFile(this.archivo, 'utf-8')
            let readerFormatted = reader.split('\n').filter(item => item != '')
            let readerParsed = readerFormatted.map(obj => JSON.parse(obj))
            return readerParsed
        }
        catch (error) {
            console.error(error)
        }
    }

    edit = async (products) => {
        await fs.promises.writeFile(this.archivo, '')
        products.forEach(prod => {
            fs.promises.appendFile(this.archivo, JSON.stringify(prod) + '\n')
        })
    }

    editById = async (id, field, value) => {
        try {
            let all = await this.getAll()
            const index = all.findIndex(product => product.id === id)
            if (all[index]) {
                let producto = all[index]
                producto[field] = value
                all.splice(index, 1, producto)
                this.edit(all)
            } else {
                return null
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    deleteById = async (id) => {
        try {
            let all = await this.getAll()
            let allWithoutDeletedItem = all.filter(item => item.id != id)
            this.deleteAll()
            allWithoutDeletedItem.forEach(obj => fs.promises.appendFile(this.archivo, JSON.stringify(obj) + '\n'))
        }
        catch (error) {
            console.error(error)
        }
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