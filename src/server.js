import cors from 'cors'
import express from "express";
import passport from "passport";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import session from 'express-session'
import spec from "./utils/swagger.js";
import cookieParser from "cookie-parser";
import appRouter from "./routes/index.js";
import handlebars from "express-handlebars";
import swaggerUiExpress from 'swagger-ui-express'
import { configObject } from "./config/connectDB.js";
import { addLogger, logger } from './utils/logger.js';
import { handleErrors } from "./middleware/errors/index.js";
import initializePassport from "./config/passport.config.js";
import messageModel from "./daos/MongoDB/models/message.models.js";
import UserController from "./controllers/users.controller.js";
import { userRepository } from "./repositories/index.js";
import UserService from './repositories/users.repository.js';
import transactionDaoMongo from './daos/MongoDB/transactionDaoMongo.js';
import configDaoMongo from './daos/MongoDB/configDaoMongo.js';

const app = express();
const PORT = configObject.port

app.get('/favicon.ico', (req, res) => res.status(204));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

initializePassport()
app.use(passport.initialize())
app.use(addLogger)

app.use(session({
  secret: 'palabraSecreta',
  resave: true,
  saveUninitialized: true
}))

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(appRouter)
app.use(handleErrors)

const httpServer = app.listen(PORT, (err) => {
  if (err) logger.error(err);
  logger.info(`Escuchando en el puerto ${PORT}:`);
});

const io = new Server(httpServer);

const userManager = new UserController()
const userService = new UserService()
const transactionService = new transactionDaoMongo()
const addIngreso = new configDaoMongo()

io.on("connection", (socket) => {

  socket.on('deleteUser', async (req) => {
    const uid = req.uid
    const user = await userManager.getUser({ _id: uid })

    if (user.role === 'admin') {
      io.to(socket.id).emit("notDeleteAdmin")
    } else {
      const delUser = await userManager.deleteUser(uid)
      const users = await userRepository.getUsers()
      io.to(socket.id).emit('getUsers')
    }
  })

  socket.on('getUser', async (uid) => {
    const user = await userManager.getUser({ _id: uid })
    io.emit('dataUser', user)
  })

  socket.on("getMessages", async (data) => {
    const message = await messageModel.find();
    io.emit("messageLogs", message);
  });

  socket.on("message", async (data) => {
    await messageModel.create(data);

    const message = await messageModel.find();
    io.emit("messageLogs", message);
  });

  socket.on('newCategory', async (data) => {
    const { user, newCategory } = data
    const addCategory = await addIngreso.addIngresoCategory(user, newCategory)

  })

  socket.on("addTransaction", async (data) => {
    if (data.transactionType === '' || data.category === '' || data.amount === '' || data.mounth === '') {
      return 'Campos vacios'
    }

    if (data.transactionType === 'Ingreso') {
      const ingresos = await transactionService.find({
        user: data.user,
        transactionType: data.transactionType,
        month: data.month,
        category: data.category,
      })

      if (ingresos.length === 0) {
        console.log('No hay valores, se crea movimiento');
        const newTransaction = {
          user: data.user,
          transactionType: data.transactionType,
          category: data.category,
          amount: data.amount,
          description: data.description,
          month: data.month,
        }

        const addTransaction = await transactionService.create(newTransaction)


      } else {
        console.log('se debe actualizar el registro')
        const ingreso = await transactionService.find({
          user: data.user,
          transactionType: data.transactionType,
          month: data.month,
          category: data.category,
        })

        let _id
        const amount = data.amount

        ingreso.forEach(ing => {
          console.log(ing._id)
          _id = ing._id.toString()
        })

        const update = await transactionService.updateAmount({ _id: _id, amount: amount })
      }
    }
  })
});
