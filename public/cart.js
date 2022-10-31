const addProduct = (id) => {
    fetch('/cart', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify({
            addID: id
        })
    })
}

const deleteCartProduct = (id) => {
    fetch(`/cart/${id}`, { 
        method: 'DELETE'
    })
    .then(() => {
        window.location.href = '/cart'
    })
}

const deleteCartAll = () => {
    fetch(`/cart/deleteAll`, { 
        method: 'DELETE'
    })
    .then(() => {
        window.location.href = '/cart'
    })
}

const send = (order) => {
    fetch('/cart/order', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: order
    })
    .then(() => {
        window.location.href = '/products'
    })
}