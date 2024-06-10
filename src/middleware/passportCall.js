import jwt from "jsonwebtoken";
import passport from "passport";
import { configObject } from "../config/connectDB.js";
import { logger } from "../utils/logger.js";

const { jwt_secret_Key } = configObject

export const passportCall = strategy => {
    return async (req, res, next) => {

        if (req.path === '/updatePassword') {
            const restorePasswordCookie = req.cookies['restorePassword'];

            if (!restorePasswordCookie) {
                return res.render('restorePassword',
                    { label: 'El enlace expiro, por favor envia la solicitud nuevamente.' });
            } else {
                try {
                    const decoded = jwt.verify(restorePasswordCookie, jwt_secret_Key)
                    const user = decoded.id
                    return res.render('updatePassword', {
                        label: user
                    })
                } catch (error) {
                    logger.error(error);
                }
            }
        }

        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) return res.redirect('/login');
            req.user = user
            next()
        })(req, res, next)
    }
}