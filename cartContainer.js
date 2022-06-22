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

    edit = async (products) => {
        await fs.promises.writeFile(this.archivo, '')
        products.forEach(prod => {
            fs.promises.appendFile(this.archivo, JSON.stringify(prod) + '\n')
        })
    }

    deleteProductById = async (cartID, prodID) => {
        try {
            let array = await this.existsById(cartID)
            if (array[0]) {
                let cart = array[1]
                let prodPosition
                let productExists = false
                cart.products.forEach((prod, index) => {
                    if (prod.id == prodID) {
                        productExists = true
                        prodPosition = index
                    }
                })
                if (productExists) {
                    cart.products.splice(prodPosition, 1)
                    let cartsArray = this.data
                    cartsArray[array[2]] = cart
                    this.edit(cartsArray)
                } else {
                    console.log('The product in cart does not exist')
                }
                return productExists
            } else {
                console.log('The cart does not exist')
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    existsById = async (id) => {
        try {
            let carts = await this.getAll()
            let exists = [false, null, null]
            carts.forEach((cart, index) => {
                if (cart.id === id) {
                    exists = [true, cart, index]
                }
            })
            return exists
        }
        catch {
            console.log(error)
        }
    }

}

module.exports = Contenedor