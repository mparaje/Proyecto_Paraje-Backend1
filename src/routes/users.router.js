import { Router } from "express";
import {userModel} from "../../models/user.model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users)
    } catch (err){
       res.status(500).json({message : "Error al obtener usuarios", err}) 
    }
})


router.post('/', async (req, res) => {
    try {
        const {first_name, last_name, email} = req.body;
        const newCart = await cartModel.create({ products: [] });
        const newUser = new userModel({first_name, last_name, email, cart: newCart._id})
        await newUser.save()
        res.status(201).json(newUser)
    } catch (err){
       res.status(500).json({message : "Error al crear usuarios", err}) 
    }
})


router.put('/:uid', async (req, res) => {
    try {
        const {uid} = req.params;
        const {first_name, last_name, email} = req.body;
        const user = await userModel.findOne({_id: uid})
        if(!user){
            return res.status(404).json({message: 'usuario no encontrado'})
        }

        if(first_name) user.first_name = first_name
        if(last_name) user.last_name = last_name
        if(email) user.email = email

        await user.save()
        res.status(200).json(user)

    } catch (err){
       res.status(500).json({message : "Error al actualizar usuarios", err}) 
    }
})


router.delete('/:uid', async (req, res) => {
    try {
        const {uid} = req.params;
        const deletedUser = await userModel.deleteOne({_id: uid})
        if(deletedUser.deletedCount > 0){
            res.status(200).json({message: 'Eliminado correctamente'})
        } else {
            res.status(404).json({message: "Usuario no encontrado"})
        }
    } catch (err){
       res.status(500).json({message : "Error al borrar usuario", err}) 
    }
})

export default router;