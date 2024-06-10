import { logger } from "../../utils/logger.js";
import productsModel from "./models/products.models.js";

class ProductDaoMongo {
  constructor() {
    this.service = productsModel
  }

  get = async (limit = 10, pageQuery = 1, query, sort) => {
    if (query) {
      const queryParts = query.split(":");
      if (queryParts.length === 2) {
        const [field, value] = queryParts;
        filter[field] = value;
      } else {
        logger.error("Formato de consulta no válido:", query);
      }
    }
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } =
      await this.service.paginate({ isActive: true }, {
        limit,
        page: pageQuery,
        sort: { price: sort === "asc" ? 1 : -1 },
        lean: true,
      });

    return {
      status: "success",
      payload: docs,
      totalPages: Math.ceil(docs.length / limit),
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage
        ? `/realtimeproducts?pageQuery=${prevPage}`
        : null,
      nextLink: hasNextPage
        ? `/realtimeproducts?pageQuery=${nextPage}`
        : null,
    };
  }

  getBy = async (pid) => {
    return await this.service.findOne({ _id: pid });
  }

  create = async (newProduct) => {
    return await this.service.create(newProduct);
  }

  update = async (data) => {
    return await this.service.findByIdAndUpdate(
      { _id: data.idProduct },
      {
        code: data.code,
        title: data.title,
        description: data.description,
        price: data.price,
        thumbnail: data.thumbnail,
        stock: data.stock,
        category: data.category,
        page: data.page,
      },
      { new: true }
    );
  }

  delete = async (pid) => {
    return await this.service.findByIdAndUpdate({ _id: pid }, { isActive: false }, { new: true });
  }

  getProductCode = async (code) => {
    return await this.service.findOne({ code });
  }
}

export default ProductDaoMongo;
