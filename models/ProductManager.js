import { promises as fs } from 'fs';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async addProduct(product) {
    const products = await this._readFile();
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      ...product
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id === Number(id));
  }
  
  async updateProduct(id, updateData) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    updateData.id = id;
    products[index] = { ...products[index], ...updateData };

    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const filteredProducts = products.filter(p => p.id !== id);

    if (filteredProducts.length === products.length) {
      throw new Error('Producto no encontrado');
    }

    await this._writeFile(filteredProducts);
    return { message: 'Producto eliminado exitosamente' };
  }
}