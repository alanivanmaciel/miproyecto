import { Router } from "express";
import ProductManagerMongo from "../daos/MongoDB/productDaoMongo.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { passportCall } from "../middleware/passportCall.js";
import { generateProducts } from "./mail.router.js";

const router = Router();
// const managerMongo = new ProductManagerMongo();

router
  .get('/login', (req, res) => {
    res.render('login')
  })

  
  .get('/register', (req, res) => {
    res.render('register')
  })
  
  .get('/restorePassword', (req, res) => {
    res.render('restorePassword')
  })

  .get('/updatePassword', passportCall('jwtrp'), async (req, res) => {
    res.send('Aca cambio contraseña')
  })
  
  .get("/", passportCall('jwt'), authorization('admin', 'user', 'premium'), async (req, res) => {
    try {      
      res.render("realtimeproducts", {
        user: req.user.email,
        
      });
    } catch (error) {
      res.render("Error al obtener la lista de productos (ViewsRouter)!");
      return;
    }
  })
  
  .get("/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await managerMongo.getBy(pid);
      res.render("realtimeproducts", { payload: product, style: "index.css" });
    } catch (error) {
      logger.error(error);
      res.status(500).send("Error al obtener al intentar obtener el producto.");
      return;
    }
  })
  
  .post("/", async (req, res) => {
    try {
      const { product } = req.body;
      const result = await managerMongo.create(product);
      res.json(result);
    } catch (error) {
      logger.error(error);
    }
  })

  .get('/mockingproducts', (req, res) => {
    let products = []
    let displayAdmin
    for (let i = 0; i < 100; i++) {
      products.push(generateProducts())
    }

    res.render("products", {
      payload: products,

    })
  })
  
  .put("/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
      const { prop, value } = req.body;
      
      await ProductManagerMongo.update(pid, prop, value);
      
      res.status(201).send({
        status: "succes",
        message: "Producto actualizado correctamente.",
      });
    } catch (error) {
      logger.error("Error al intentar actualizar el producto:", error);
      res.status(500).json({
        error: "Error interno del servidor al actualizar el producto.",
      });
    }
  })
  
  .delete("/:pid", async (req, res) => {
    try {
      const { pid } = req.params;
      await managerMongo.delete(pid);
      res.status(201).send({
        status: "succes",
        message: "Producto eliminado correctamente.",
      });
    } catch (error) {
      logger.error(error);
    }
  });
  

  export default router;
  