import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { configObject } from '../config/connectDB.js'
import { logger } from '../utils/logger.js'

const jwt_secret_Key = configObject.jwt_secret_Key

class RouterClass {
    constructor() {
        this.router = Router
    }

    getRouter = () => {
        return this.router
    }

    init() { }

    applyCallback(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                logger.error(error);
                params[1].status(500)
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.send({ status: 'Success', payload })
        res.sendServerError = error => res.send({ status: 'Error', error })
        res.sendUserError = error => res.send({ status: 'Error', error })
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies[0] === 'public') next()
        const authHeaders = req.headers.authorization
        const token = authHeaders.split(' ')[1]
        let user = jwt.verify(token, jwt_secret_Key)
        if (!policies.includes(user.role.toUpperCase())) res.status(403).send({ status: 'Error', error: 'Not permissions' })
        req.user = user
        next()
    }

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies, this.generateCustomResponses, this.applyCallback(callbacks))
    }
}

export default RouterClass