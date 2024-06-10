import fs from 'node:fs/promises';
import { logger } from '../../utils/logger';

class ProductManager {
  constructor() {
    this.path = "./src/jsonDB/productos.json";
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

  async get(limit) {
    try {
      const readProducts = await this.readJson();
      if (Array.isArray(readProducts)) {
        const limitProducts = limit
          ? readProducts.slice(0, limit)
          : readProducts;
        return limitProducts;
      }
    } catch (error) {
      logger.info("No se encontraron productos.");
    }
  }

  async getBy(id) {
    const readProducts = await this.readJson();
    const product = readProducts.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      
      return (`ID de producto (${id}) no encontrado.`);
    }
  }

  async create(product) {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      logger.info("Todos los campos deben ser obligatorios.");
      return;
    }

    const readProducts = await this.readJson();
    if (readProducts.some((readProduct) => readProduct.code === product.code)) {
      logger.info("El código del producto ya existe.");
      return;
    }

    try {
      const readProducts = await this.readJson();
      const maxId = readProducts.reduce(
        (max, product) => (product.id > max ? product.id : max),
        0
      );
      product.id = maxId + 1;
      product.status = true;
      readProducts.push(product);
      const newProduct = JSON.stringify(readProducts, null, 2);
      await fs.writeFile(this.path, newProduct, "utf-8");
      logger.info('Producto agregado correctamente.');
    } catch (error) {
      logger.error("Error al registrar producto: ", error);
    }
  }
  
  async update(id, prop, value) {
    const readProducts = await this.readJson();
    const index = readProducts.findIndex((product) => product.id === id);
    if (index !== -1) {
      readProducts[index][prop] = value;
      const updateProduct = JSON.stringify(readProducts, null, 2);
      await fs.writeFile(this.path, updateProduct, "utf-8");
      logger.info("Producto actualizado: ", readProducts);
    } else {
      logger.info(`El ID (${id}) especificado no existe en el archivo.`);
    }
  }

  async delete(id) {
    const readProducts = await this.readJson();
    const index = readProducts.findIndex((product) => product.id === id);
    if (index !== -1) {
      readProducts.splice(index, 1);
      const updateJson = JSON.stringify(readProducts, null, 2);
      await fs.writeFile(this.path, updateJson, "utf-8");
      logger.info(`El producto con ID (${id}) se elimino correctamente.`);
    } else {
      logger.info(        `No se encontro ningun producto con el ID (${id}) especificado.`      );
    }
  }
}

export default ProductManager;
