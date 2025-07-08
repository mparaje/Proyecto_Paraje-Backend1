import { promises as fs } from 'fs';

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

    const newCart = {
      id: newId,
      products: []
    };

    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => c.id === Number(id));
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cartIndex = carts.findIndex(c => c.id === Number(cid));
    if (cartIndex === -1) throw new Error('Carrito no encontrado');

    const cart = carts[cartIndex];
    const productInCart = cart.products.find(p => p.product === Number(pid));

    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: Number(pid), quantity: 1 });
    }

    carts[cartIndex] = cart;
    await this._writeFile(carts);
    return cart;
  }
}
