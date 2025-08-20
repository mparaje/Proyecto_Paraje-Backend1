import mongoose from "mongoose";
import { userModel } from "./models/user.model.js";
import { cartModel } from "./models/cart.model.js";

const MONGO_URI = "mongodb+srv://maiaparaje:Paraje25@ecommerce.nfhlwez.mongodb.net/myEcommerce";

// Lista de usuarios de prueba
const sampleUsers = [
  { first_name: "Juan", last_name: "Pérez", email: "juan@example.com" },
  { first_name: "María", last_name: "Gómez", email: "maria@example.com" },
  { first_name: "Carlos", last_name: "López", email: "carlos@example.com" },
  { first_name: "Lucía", last_name: "Martínez", email: "lucia@example.com" },
  { first_name: "Pedro", last_name: "Fernández", email: "pedro@example.com" }
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");

    // Limpiamos colecciones para que no se repitan usuarios
    await userModel.deleteMany({});
    await cartModel.deleteMany({});

    const usersWithCarts = [];

    for (const u of sampleUsers) {
      // Crear carrito vacío
      const newCart = await cartModel.create({ products: [] });

      // Crear usuario con referencia al carrito
      const newUser = await userModel.create({
        ...u,
        cart: newCart._id
      });

      usersWithCarts.push(newUser);
    }

    console.log("Usuarios y carritos creados:");
    console.log(usersWithCarts);

    await mongoose.connection.close();
  } catch (err) {
    console.error("Error al crear usuarios:", err);
  }
}

seedUsers();
