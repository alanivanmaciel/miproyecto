import jwt from 'jsonwebtoken'
import { configObject } from '../config/connectDB.js'

const { jwt_secret_Key } = configObject

export const generateToken = (user) => jwt.sign(user, jwt_secret_Key, { expiresIn: '24h' })

export const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) return res.status(401).send({ status: 'error', message: 'No token.' })

    const token = authHeader.split(' ')[1]

    jwt.verify(token, jwt_secret_Key, (error, decodeUser) => {
        if (error) return res.status(401).send({ status: 'error', message: 'No authorizated.' })

        req.user = decodeUser
        next()
    })
}