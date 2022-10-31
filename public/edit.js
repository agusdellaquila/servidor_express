const editedProduct = () => {
    const product = {
        title: document.getElementById('title').value || 'empty',
        price: document.getElementById('price').value || 0,
        stock: document.getElementById('stock').value || 0,
        image: document.getElementById('image').value || 'https://www.sulin.it/wp-content/uploads/2018/11/placeholder-wine-bottle3OP.png'
    }
    return product
}
const editProduct = (id) => {
    fetch(`/products/${id}/edit/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify(editedProduct())
    })
    .then(() => {
        window.location.href = '/products'
    })
}

document.getElementById('productEdit').addEventListener('submit', function(e) {
    e.preventDefault()
})