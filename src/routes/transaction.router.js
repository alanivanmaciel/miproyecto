import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import { authorization } from "../middleware/authorization.middleware.js";
import TransactionController from "../controllers/transaction.controller.js";

const router = Router()
const {getIncomes} = new TransactionController()

router.get('/', passportCall('jwt'), authorization('admin','premium'), getIncomes)

export default router