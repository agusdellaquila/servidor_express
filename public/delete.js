const deleteProduct = (id) => {
    fetch(`/products/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        window.location.reload()
    })
}