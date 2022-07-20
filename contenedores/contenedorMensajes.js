const fs = require('fs');

class ContenedorMensajes {

    constructor(textJson) {
        this.textJson = textJson;
        this.data = []
        try {
            this.selectMessages()
        } catch (error) {
            this.write()
        }
    }

    selectMessages() {
        this.data = JSON.parse(fs.readFileSync(this.textJson));
    }

    write() {
        fs.writeFileSync(this.textJson, JSON.stringify(this.data));
    }

    async writeMessage(msg) {
        msg['id'] = this.data.length + 1;
        this.data.push(msg)
        this.write()

        return msg
    }
}

module.exports = ContenedorMensajes;