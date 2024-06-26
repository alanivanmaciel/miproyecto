import fs from "node:fs/promises";
import { logger } from "../../utils/logger";

class CartsManager {
  constructor() {
    this.path = "./src/jsonDB/carts.json";
  }

  async readJson() {
    try {
      const readJsonFile = await fs.readFile(this.path, "utf-8");
      return JSON.parse(readJsonFile);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.writeFile(this.path, "[]", "utf-8");
        return [];
      } else {
        logger.error("Error al intentar leer el JSON: ", error);
      }
    }
  }

  async createCart() {
    try {
      const carts = await this.readJson();
      let newCart = {
        id: carts.length + 1,
        product: [],
      };
      carts.push(newCart);
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
      return newCart;
    } catch (error) {
      return `Error al intentar crear el carrito ${error}`;
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.readJson();
      const cart = carts.find((cart) => cart.id === cid);
      if (cart) {
        return cart;
      } else {
        logger.info(`ID de carrito (${cid}) no encontrado.`);
        return "El producto no existe.";
      }
    } catch (error) {
      logger.error(error);
    }
  }

  async addProductToCart(cid, pid, quantity) {
    try {
      const carts = await this.readJson();
      const cart = carts.find((cart) => cart.id === parseInt(cid));

      if (!cart) {
        logger.error(`Carrito con ID ${cid} no encontrado.`);
        return;
      }
      const existingProduct = cart.product.find(
        (item) => item.product === parseInt(pid)
      );

      if (existingProduct) {
        existingProduct.quantity += parseInt(quantity);
      } else {
        cart.product.push({
          product: parseInt(pid),
          quantity: parseInt(quant),
        });
      }
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
      logger.info('Producto agregado correctamente.');
      return cart;
    } catch (error) {
      logger.error(error);
    }
  }
}

export default CartsManager;
