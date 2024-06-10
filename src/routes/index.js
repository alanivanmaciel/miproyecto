import { Router } from "express";
import viewsRouter from "./views.router.js";
import messageRouter from "./message.router.js";
import sessionRouter from './session.router.js'
import usersRouter from './users.router.js'
import mailRouter from './mail.router.js'
import loggerRouter from './loggertest.router.js'

const router = Router();

router.use("/", viewsRouter);
router.use('/api/sessions', sessionRouter)
router.use("/api/chat", messageRouter);
router.use('/api/users', usersRouter);
router.use('/api', mailRouter)

router.get('*', (req, res) => {
    res.send('Not Found.')
})

export default router;