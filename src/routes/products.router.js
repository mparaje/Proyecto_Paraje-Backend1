import { Router } from 'express';
import {productModel} from '../../models/product.model.js';
import {userModel} from '../../models/user.model.js'

const router = Router();

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let {sort, query} = req.query;

    try{
        let filter = {}
        if (query){
            filter = {
                $or: [
                    {category: query.toLowerCase()},
                    {status: query.toLowerCase() === "true"} // Filtra por todos los productos disponibles
                ]
            }
        }

        let sortOption = {};
        if(sort === "asc") sortOption = {price:1};
        if(sort === "desc") sortOption = {price: -1};

        const totalProducts = await productModel.countDocuments(filter);
        const totalPages = Math.max(1,Math.ceil(totalProducts / limit));

        if(page < 1) page = 1;
        if(page > totalPages) page = totalPages;

        const products = await productModel.find(filter)
            .sort(sortOption)
            .skip((page - 1)* limit)
            .limit(limit)
            .lean()
        
        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
        const user = await userModel.findOne().populate("cart").lean();

        res.render("home", {
            products,
            cartId: user?.cart?._id,
            page,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
            nextLink: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null
        })
    } catch (err){
        res.status(500).json({status: "error", error: err.message})
    }
});

router.get('/:pid', async (req, res) => {
    try{
        const product = await productModel.findById(req.params.pid).lean()
        if(!product){
            return res.status(404).json({ error: "Producto no encontrado"})
        }
        const user = await userModel.findOne().populate("cart").lean();
        res.render("productDetail", { product, cartId: user?.cart?._id });
    } catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productModel.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.pid,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await productModel.findByIdAndDelete(pid);
        if (!deletedProduct){
            return res.status(404).json({error: "Producto no encontrado"});
        }
        res.json({message: "Producto eliminado", deletedProduct});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;