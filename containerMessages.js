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
            this.data.push(object)
            await fs.promises.appendFile(this.archivo, JSON.stringify(object) + '\n')
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