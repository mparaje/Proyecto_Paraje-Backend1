const socket = io();

console.log("JS conectado")

document.getElementById('addProductForm').addEventListener('submit', e =>{
    e.preventDefault();

    const formData = new FormData(e.target);
    const product = Object.fromEntries(formData.entries());
    product.price = Number(product.price);
    product.stock = Number(product.stock);
    product.status = true;
    product.thumbnails = [product.thumbnail];
    delete product.thumbnail;

    socket.emit('new-product', product);
    e.target.reset();
})

document.getElementById('deleteProductForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = e.target.id.value;
  socket.emit('delete-product', id);
  e.target.reset();
});

socket.on('products-updated', products => {
  const ul = document.getElementById('productList');
  ul.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price}`;
    ul.appendChild(li);
  });
});