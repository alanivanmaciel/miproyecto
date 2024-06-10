import { Router } from "express";
import MessageController from "../controllers/message.controller.js";
import { passportCall } from "../middleware/passportCall.js";
import { authorization } from "../middleware/authorization.middleware.js";

const router = Router();
const { getMessage } = new MessageController

router.get("/", passportCall('jwt'), authorization('admin', 'user', 'premium'), getMessage);

export default router;
