const socket = io.connect();

socket.on('messages', normalizedData => {
    const user = new normalizr.schema.Entity('users')
    const message = new normalizr.schema.Entity('messages', {
        messenger: user
    })
    const messageSchema = new normalizr.schema.Entity('message', {
        author: user,
        messages: [message]
    })
    const denormalizedData = normalizr.denormalize(normalizedData.result, [messageSchema], normalizedData.entities)
    const normalPercentage = JSON.stringify(normalizedData).length
    const denormalPercentage = JSON.stringify(denormalizedData).length
    const percentage = Math.round((denormalPercentage / normalPercentage) * 100)
    renderMessages(denormalizedData, percentage)
})

const renderMessages = (messages, percentage) => {
    const html = messages.map( element => {
        return (
            `<div class="flex">
                <img src="${element.author.avatar}" alt="avatar" class="rounded" width="30px"/>
                <b class="text-blue-500">${element.author.alias}</b> <span class="font-bold text-red-800">[${element.timestamp}]</span> :<em class="text-green-300">${element.text}</em>
            </div>`
        )
    }).join(' ')
    document.getElementById('messages').innerHTML = html
    document.getElementById('percentage').innerHTML = (`<div><p class="font-bold text-xl"> Porcentaje de compresion: ${percentage}% </p></div>`)
}

const addMessage = (e) => {
    e.preventDefault()

    const msg = {
        author: {
            id: document.getElementById('Email').value,
            nombre: document.getElementById('Nombre').value,
            apellido: document.getElementById('Apellido').value,
            edad: document.getElementById('Edad').value,
            alias: document.getElementById('Alias').value,
            avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
        },
        text: document.getElementById('Mensaje').value,
        timestamp: new Date().toLocaleString()
    }

    socket.emit('newMessage', msg)
}

document.getElementById("messageSubmit").addEventListener("submit", addMessage)