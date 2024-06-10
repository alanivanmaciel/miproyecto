import mongoose from "mongoose"
import { logger } from "./logger.js";

class MongoSingleton {
    static #instance
    constructor() {
        mongoose.connect(process.env.MONGOURL)
    }
    static getInstance() {
        if (this.#instance) {
            logger.info('Base de datos previamente conectada.');
            return this.#instance
        }

        this.#instance = new MongoSingleton()
        logger.info('Base de datos conectada.');
        return this.#instance
    }
}

export default MongoSingleton