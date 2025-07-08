import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js'

const app = express();

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON malformado' });
  }
  next();
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server escuchando el puerto ${PORT}`);
});