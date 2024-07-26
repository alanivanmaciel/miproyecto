import jwt from "jsonwebtoken";
import { configObject } from "../config/connectDB.js";
import UserService from "../repositories/users.repository.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { generateToken, authToken } from "../utils/jsonWebToken.js";
import { logger } from "../utils/logger.js";
import sendMail from "../utils/sendEmail.js";
import UserController from "./users.controller.js";

const { jwt_secret_Key } = configObject

class SessionController {
    constructor() {
        this.userController = new UserController()
        this.userService = new UserService()
    }

    register = async (req, res) => {
        try {
            const { firstname, lastname, email, age, password } = req.body
            if (!req.file) {
                return res.status(400).send({
                    status: 'error upload image',
                    message: 'No file uploaded',
                })
            }
            //validar que no exista email FALTA
            
            const newUser = {
                firstname,
                lastname,
                email,
                age,
                password: createHash(password),
                imgProfile: `/uploads/profiles/${req.file.filename}`
            }

            const result = await this.userController.createUser({ body: newUser })

            const emailConfigObject = {
                service: `Bienvenido usuario`,
                to: result.email,
                subject: 'Bienvenido a la App de Finanzas',
                html: `<h1>Bienvenido ${result.firstname}!</h1>`
            }
            sendMail(emailConfigObject)

            const token = generateToken({
                email: result.email,
                uid: result._id.toString(),
                role: result.role,
            })

            res.status(200).cookie('CookieToken', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true
            }).redirect('/')
        } catch (error) {
            res.send({ status: 'error register', message: error })
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await this.userService.getUser({ email })

            if (!user) return res.status(401).send({ status: 'error', message: 'El email ingresado no existe.' })

            const hash = user.password

            if (!isValidPassword(password, hash)) return res.status(401).send({ status: 'error', message: 'No coincide las credenciales' })

            const token = generateToken({
                email: user.email,
                uid: user._id.toString(),
                role: user.role,
            })

            const last_connection = await this.userController.last_connection(user._id.toString())

            res.status(200).cookie('CookieToken', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true
            }).redirect('/')
        } catch (error) {
            res.send({ status: 'error', message: error })
        }
    }

    logout = async (req, res) => {
        try {
            const cookie = req.cookies['CookieToken']
            const user = jwt.verify(cookie, jwt_secret_Key)
            const last_connection = await this.userController.last_connection(user.uid)

            res.clearCookie('CookieToken').render('plantilla', {
                title: 'Usuario deslogueado correctamente.',
                enlace: '/login',
                textEnlace: 'Ir al Login'
            });
        } catch (error) {
            res.send({ status: 'error', message: error })
        }
    }

    current = async (req, res) => {
        try {
            const cookie = req.cookies['CookieToken']
            const user = jwt.verify(cookie, jwt_secret_Key)

            if (user) return res.send({ status: 'success', payload: user })
        } catch (error) {
            res.send({ status: 'error', message: error })
        }
    }

    restorePassword = async (req, res) => {
        try {
            const { email } = req.body
            const user = await this.userService.getUser({ email })

            if (!user) return res.status(401).send({ status: 'error', message: 'El email ingresado no existe.' })
            const emailParams = {
                service: `Soporte Finanzas`,
                to: email,
                subject: `Restablecimiento de contraseña`,
                html: `
                    <h2>Estimado ${user.firstname}:</h2>

                    <p>Se recepciono la solicitud para reestablecer su contraseña.</p>
                    <p>A continuacion se envia el enlace para realizar el restablecimiento: <a href='${configObject.enlace}/updatePassword'>LINK</a>

                    </p>Si usted no realizo la solicitud, desestimar este email.</p>
                    <p>Gracias!</p>
                    `
            }
            sendMail(emailParams)
            logger.info(`Solicitud de cambio de contraseña del usuario ${user.email}`)

            const tokenRestartPwd = generateToken({
                id: user._id
            })
            let button = false

            res.status(200).cookie('restorePassword', tokenRestartPwd, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            }).render('plantilla', {
                title: 'restablecido',
                detalle: 'Se envio email',
                enlace: `http://localhost:${configObject.port}/login`,
                button: button
            })
        } catch (error) {
            logger.error(error);
        }
    }

    resetPassword = async (req, res) => {
        try {
            const { password, confirmPassword, label } = req.body
            const user = await this.userService.getUser({ _id: label })
            if (isValidPassword(password, user.password)) {
                res.status(400).send('La contraseña no puede ser igual a la anterior, por favor ingrese una nueva contraseña.');
            }
            const newPassword = createHash(password)
            const uid = user._id

            const update = await this.userService.updateUser(uid, { password: newPassword })
            res.send(update)


        } catch (error) {
            logger.error(error);
        }
    }
}

export default SessionController