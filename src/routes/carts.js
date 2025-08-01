import { Router } from 'express';
import CartManager from '../../models/CartManager.js';

const router = Router();
const cartManager = new CartManager('./data/carts.json');

router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json({newCart});
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (cart) res.json(cart.products);
  else res.status(404).json({ error: 'Carrito no encontrado' });
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json(updatedCart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default router;
