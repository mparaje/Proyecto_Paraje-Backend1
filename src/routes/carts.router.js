import { Router } from 'express';
import {cartModel} from '../../models/cart.model.js';

const router = Router();

router.get('/:cid', async (req, res) => {
  try{
    const cart = await cartModel.findById(req.params.cid).populate("products.product").lean();
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.render("cart", { 
      cartId: req.params.cid, 
      products: cart.products 
    });
  } catch (err){
      res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = await cartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put('/:cid', async (req, res) => {
  try {
    const updatedCart = await cartModel.findByIdAndUpdate(
      req.params.cid,
      { products: req.body.products },
      { new: true }
    );
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const item = cart.products.find(p => p.product.toString() === pid);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.render("cart", { 
      cartId: cid, 
      products: cart.products,
      quantity 
    });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cart = await cartModel.findByIdAndUpdate(
      req.params.cid,
      { products: [] },
      { new: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
