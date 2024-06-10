import { Router } from "express";
import { logger } from "../utils/logger.js";

const router = Router()

router.get('/log', (req, res) => {
    logger.fatal('Este es un mensaje de log fatal');
    logger.error('Este es un mensaje de error');
    logger.warning('Este es un mensaje de advertencia');
    logger.info('Este es un mensaje de información');
    logger.http('Este es un mensaje de log HTTP');
    logger.debug('Este es un mensaje de depuración');

    res.send('Logs probados. Verifica tu consola o archivo de registro.');
})

export default router