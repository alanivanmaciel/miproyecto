import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import { authorization } from "../middleware/authorization.middleware.js";
import UserController from "../controllers/users.controller.js";
import { handleUpload } from "../utils/multer.js";

const router = Router()
const { getUsers, getUser, createUser, updateRole, deleteUser, documents } = new UserController()

router.get('/', passportCall('jwt'), authorization('admin','premium'), getUsers)
router.post('/', createUser)
router.get('/premium/:uid', updateRole)
router.get('/:uid', deleteUser)
router.post('/:uid/documents', handleUpload, documents)

export default router