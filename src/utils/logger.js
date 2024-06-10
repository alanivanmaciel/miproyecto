import winston from 'winston'
import { configObject } from '../config/connectDB.js'
import DailyRotateFile from 'winston-daily-rotate-file'

const mode = configObject.node_env

const levelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'magenta',
        info: 'blue',
        http: 'cyan',
        debug: 'gray'
    }
}

// const fileTransport = new winston.transports.DailyRotateFile({
//     dirname: './logs',
//     filenam: 'app-%DATE%.log',
//     datePattern: 'YYYY-MM-DD-HH-mm',
//     zippedArchive: true,
//     maxSize: '1m',
//     maxFiles: '3',
//     frequency: '1m',
//     level: 'debug'
// })

const logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        mode === 'development' ?
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: levelOptions.colors }),
                    winston.format.simple()
                ),
                // fileTransport
            }) :
            new winston.transports.File({
                filename: './errors.log',
                level: 'info',
                format: winston.format.simple(),
                // fileTransport
            })
    ]
});


const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

export { addLogger, logger }