const deleteProduct = (id) => {
    fetch(`http://localhost:8080/products/${id}`, { 
        method: 'DELETE'
    })
    .then(() => {
        window.location.reload()
    })
}

const addProduct = (id) => {
    fetch('http://localhost:8080/carts', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify({
            addID: id
        })
    })
    .then(response => response.json())
    .catch(e => console.log(e))
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