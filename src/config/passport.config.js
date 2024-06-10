import passport from 'passport'
import passportJwt from 'passport-jwt'
import GithubStrategy from 'passport-github2'
// import { createHash, isValidPassword } from '../utils/hashBcrypt.js'
import UserManagerMongo from '../daos/MongoDB/userDaoMongo.js'
import { configObject } from '../config/connectDB.js'

const jwt_secret_Key = configObject.jwt_secret_Key
const userManager = new UserManagerMongo()
const JWTStrategy = passportJwt.Strategy
const ExtractJWT = passportJwt.ExtractJwt

const initializePassport = () => {
    // passport.use('register', new LocalStrategy({
    //     passReqToCallback: true,
    //     usernameField: 'email'
    // }, async (req, username, password, done) => {
    //     const { firstname, lastname, email } = req.body
    //     try {
    //         let user = await userManager.getUserBy({ email })
    //         if (user) return done(null, false)

    //         let newUser = {
    //             firstname,
    //             lastname,
    //             email,
    //             password: createHash(password)
    //         }

    //         let result = await userManager.createUser(newUser)
    //         return done(null, result)
    //     } catch (error) {
    //         return done(error)
    //     }
    // }))

    // passport.use('login', new LocalStrategy({
    //     usernameField: 'email'
    // }, async (username, password, done) => {
    //     try {
    //         const user = await userManager.getUserBy({ email: username })
    //         if (!user) {
    //             console.log('Usuario no existe.');
    //             return done(null, false)
    //         }
    //         if (!isValidPassword(password, user.password)) return done(null, false)
    //         return done(null, user)
    //     } catch (error) {
    //         return done(error)
    //     }
    // }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userManager.getBy({ _id: id })
        done(null, user)
    })

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.545d12c63f15cb78',
        clientSecret: 'ad7c627e6c0b315e3c82f0f91ff35427e3098c9f',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            let user = await userManager.getBy({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    firstname: profile._json.name,
                    lastname: profile._json.name,
                    email: profile._json.email,
                    password: ''
                }
                let result = await userManager.create(newUser)
                return done(null, result)
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }

    }))

    const cookieExtractor = (req) => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies['CookieToken'];
        }
        return token
    }

    const cookieRecPassword = (req) => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies['restorePassword'];
        }
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: jwt_secret_Key
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error, false, { message })
        }
    }))

    passport.use('jwtrp', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieRecPassword]),
        secretOrKey: jwt_secret_Key
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error, false, { message })
        }
    }))

}

export default initializePassport