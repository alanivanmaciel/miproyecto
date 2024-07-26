import { Router } from "express";
import ProductManagerMongo from "../daos/MongoDB/productDaoMongo.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { passportCall } from "../middleware/passportCall.js";
import { generateProducts } from "./mail.router.js";
import transactionDaoMongo from "../daos/MongoDB/transactionDaoMongo.js";
import { userRepository } from "../repositories/index.js";

const router = Router();
const transaction = new transactionDaoMongo();

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
      const user = req.user.email

      const ingresos = await transaction.find({
        user: user,
        transactionType: 'Ingreso',
      });

      const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

      const getuser = await userRepository.getUser({email: user})      

      const dataByCategoryAndMonth = {};
      const categoryArrays = {};

      ingresos.forEach(ingreso => {
        const { category, month, amount } = ingreso;

        if (!dataByCategoryAndMonth[category]) {
          dataByCategoryAndMonth[category] = {
            category,
            amounts: months.reduce((acc, month) => {
              acc[month] = 0;
              return acc;
            }, {})
          };
        }
        dataByCategoryAndMonth[category].amounts[month] += amount;
      });

      for (const category in dataByCategoryAndMonth) {
        categoryArrays[category] = [
          ...months.map(month => dataByCategoryAndMonth[category].amounts[month].toLocaleString('es-ES', {minimumFractionDigists: 2}))
        ];
      }

      res.render("realtimeproducts", {
        user,
        fullname: getuser.fullname,
        months,
        categoryArrays

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
      console.log('Request received', req.body);

      const { category, transactionType } = req.body;
      console.log('Category:', category);
      console.log('Transaction Type:', transactionType);

      res.json({ status: 'success' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message });
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
