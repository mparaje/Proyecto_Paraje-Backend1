import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js'
import userRouter from './src/routes/users.router.js'
import { Server } from 'socket.io';
import { productModel } from './models/product.model.js';
import { userModel } from './models/user.model.js';

const PORT = 8080;
const app = express();

mongoose.connect('mongodb+srv://maiaparaje:Paraje25@ecommerce.nfhlwez.mongodb.net/myEcommerce')
.then(()=>{
  console.log("Conectado a mongoDB correctamente")
})
.catch(err => {
  console.log(`No pudimos conectarnos a mongoDB. Error: ${err}`)
})

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
app.use('/products', productsRouter); 
app.use('/api/carts', cartsRouter);
app.use('/api/users', userRouter);

app.get('/', async (req, res) => {
  const products = await productModel.find().lean();
  const user = await userModel.findOne().populate("cart").lean();
  res.render('home', { products, cartId: user?.cart?._id  });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productModel.find().lean();
  res.render('realTimeProducts', { products });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

const io = new Server(httpServer);

io.on('connection', socket => {
  console.log('Cliente conectado por WebSocket');

  socket.on('new-product', async productData => {
    await productModel.create(productData);
    const updatedProducts = await productModel.find().lean();
    io.emit('products-updated', updatedProducts);
  });

  socket.on('delete-product', async id => {
    await productModel.findByIdAndDelete(id);
    const updatedProducts = await productModel.find().lean();
    io.emit('products-updated', updatedProducts);
  });
});
