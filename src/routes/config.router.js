import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import { authorization } from "../middleware/authorization.middleware.js";
import configController from "../controllers/config.controller.js";

const router = Router()
const { createConfig, getConfig, transaction } = new configController()

router.get('/', passportCall('jwt'), authorization('admin', 'premium'), getConfig)
router.get('/:transactionType', passportCall('jwt'), authorization('admin', 'premium'), transaction)
router.post('/', passportCall('jwt'), authorization('admin', 'premium'), createConfig)

export default router