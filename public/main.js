const deleteProduct = (id) => {
    fetch(`/products/${id}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(res => console.log(res))
}
const addProduct = (id) => {
    fetch('/cart', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify({
            addID: id
        })
    })
    .then(res => res.json())
    .then(res => console.log(res))
}
const sendOrder = (cart) => {
    console.log('TWILIO')
    const accountSid = process.env.TWILIO_SID
    const authToken = process.env.TWILIO_TOKEN 
    const client = require('twilio')(accountSid, authToken); 
    client.messages
      .create({ 
         body: 'Hola este es el carrito: ' + cart, 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+5491122428587' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
}
const deleteCartProduct = (id) => {
    console.log(id)
    fetch(`/cart/${id}`, { 
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(res => console.log(res))
}
const deleteCart = async () => {
    console.log( fetch("/cart", { 
        method: 'DELETE'
    }))
    .then(res => res.json())
    .then(res => console.log(res))
}