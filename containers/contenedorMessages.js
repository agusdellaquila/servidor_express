const fs = require('fs')

class ContenedorMensajes {

    constructor(textJson) {
        this.textJson = textJson;
        this.data = []
        try {
            this.read()
        } catch (error) {
            this.write()
        }
    }

    read() {
        this.data = JSON.parse(fs.readFileSync(this.textJson));
        return this.data
    }

    write() {
        fs.writeFileSync(this.textJson, JSON.stringify(this.data));
    }

    async writeMessage(msg) {
        msg['id'] = this.data.length + 1
        this.data.push(msg)
        this.write()
        return msg
    }
}

module.exports = ContenedorMensajes;