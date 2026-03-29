const socket = io()
socket.on('products', () => {
    window.location.reload()
})
document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')
        socket.emit('deleteProduct', id)
    })
})
document.querySelectorAll('.detailsBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')
        window.location.href = `realtimeproducts/${id}`
    })
})

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const product = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        thumbnail: formData.get('thumbnail'),
        stock: parseInt(formData.get('stock')),
        status: formData.get('status') === 'true',
        category: formData.get('category')
    }
    socket.emit('createProduct', product)
    e.target.reset()
})