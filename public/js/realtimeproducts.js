const socket = io()
function renderProducts (products) {
    const container = document.getElementById('productsContainer')
    container.innerHTML = products.map(product => `
        <div data-id="${product.id}">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button class="deleteBtn" data-id="${product.id}">BORRAR</button>
        </div>
    `).join('')
    document.querySelectorAll('.deleteBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id')
            socket.emit('deleteProduct', Number(id))
        })
    })
}

socket.on("products", (products) => {
    renderProducts(products)
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