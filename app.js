import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter, { productManager } from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js'
import { Server } from 'socket.io';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON malformado' });
  }
  next();
});
app.use(express.urlencoded({extended : true}))
app.use(express.static('src/public'))

app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', './src/views')

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

const httpServer = app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en puerto ${PORT}`);
});

const io = new Server(httpServer);

io.on('connection', socket => {
  console.log('🟢 Cliente conectado por WebSocket');

  socket.on('new-product', async product => {
    await productManager.addProduct(product);
    const updatedProducts = await productManager.getProducts();
    io.emit('products-updated', updatedProducts);
  });

  socket.on('delete-product', async id => {
    await productManager.deleteProduct(Number(id));
    const updatedProducts = await productManager.getProducts();
    io.emit('products-updated', updatedProducts);
  });
});
