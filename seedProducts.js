import mongoose from "mongoose";
import { productModel } from "./models/product.model.js";

// Conexión a MongoDB Atlas
const MONGO_URI = "mongodb+srv://maiaparaje:Paraje25@ecommerce.nfhlwez.mongodb.net/myEcommerce";

const categories = ["tecnologia", "hogar", "indumentaria", "perifericos", "juguetes"];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomProduct(index) {
  const title = `Producto ${index + 1}`;
  const description = `Descripción del producto ${index + 1}`;
  const code = `CODE-${index + 1}-${Math.floor(Math.random() * 10000)}`;
  const price = Math.floor(Math.random() * 10000) + 100;
  const stock = Math.floor(Math.random() * 500) + 1;
  const category = getRandomElement(categories);

  return {
    title,
    description,
    code,
    price,
    stock,
    category,
    status: true,
    thumbnails: [`https://picsum.photos/200?random=${index + 1}`] // imagen random
  };
}

async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");

    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateRandomProduct(i));
    }

    await productModel.insertMany(products);
    console.log("100 productos insertados correctamente");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error al insertar productos:", err);
  }
}

seedProducts();
