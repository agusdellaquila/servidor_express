const options = {
    client: 'sqlite3',
    connection: {
        filename: './public/messages.sqlite'
    },
    useNullAsDefault: true
}
module.exports = options