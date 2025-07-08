import { Router } from 'express';
import ProductManager from '../models/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json({ products });
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(Number(pid), updateData); // <--- AWAIT + convertir ID
        res.json(updatedProduct);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await productManager.deleteProduct(Number(pid)); // <--- AWAIT + convertir ID
        res.json(result);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default router;