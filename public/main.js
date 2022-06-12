console.log('socket ui')

const socket = io.connect();

socket.on('products', products => {
    render(products.data)
})

const render = (data) => {
    const html = data.map( element => {
        return (`
            <tr style="text-align: center">
                <td class="text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">${element.title}</td>
                <td class="text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">${element.price}</td>
                <td class="text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]">${element.stock}</td>
                <td class="text-center text-dark font-medium text-base py-5 px-2 bg-[#F3F6FF] border-b border-l border-[#E8E8E8]"><img src=${element.image} style="margin: 0 auto" width="100px"></td>
            </tr>
        `)
    }).join(' ')

    document.getElementById('products').innerHTML = html
}

const addProduct = () => {
    const newProduct = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        image: document.getElementById('image').value
    }
    socket.emit('newProduct', newProduct)
}

socket.on('messages', messages => {
    renderMessages(messages.data)
})

const renderMessages = (data) => {
    const html = data.map( element => {
        return (
            `<div>
                <b class="text-blue-500">${element.email}</b> <span class="text-red-400">[${element.date}] :</span> <em class="text-green-300">${element.message}</em>
            </div>`
        )
    }).join(' ')

    document.getElementById('messages').innerHTML = html
}

const addMessage = (e) => {
    e.preventDefault()
    console.log('ENTRO')
    const message = {
        email: document.getElementById('email').value,
        date: new Date().toLocaleTimeString(),
        message: document.getElementById('message').value
    }
    console.log(message)
    socket.emit('newMessage', message)
}

document.getElementById("messageSubmit").addEventListener("submit", addMessage)