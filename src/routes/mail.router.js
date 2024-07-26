import { Router } from "express";
import sendMail from "../utils/sendEmail.js";
import sendSms from "../utils/sendSms.js";
import { faker } from '@faker-js/faker'
import compression from 'express-compression'
import transactionDaoMongo from "../daos/MongoDB/transactionDaoMongo.js";


const router = Router()
const transaction = new transactionDaoMongo()

export const generateProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.random.alphaNumeric(5),
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.product(),
        departament: faker.commerce.department(),
        displayAdmin: 'disabled',
        displayUser: 'disabled'
    }
}

const generateUser = () => {
    let numberOfProducts = parseInt(faker.string.numeric(1, { bannedDigits: ['0'] }))
    let products = []
    for (let i = 0; i < numberOfProducts; i++) {
        products.push(generateProducts())
    }
    return {
        id: faker.database.mongodbObjectId(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        sex: faker.person.sex(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        email: faker.internet.email(),
        products
    }
}

router.use(compression())
router
    .get('/mail', (req, res) => {

        const to = 'alan.maciel@neotel.us'
        const subject = 'Email de prueba'
        const html = '<div><h1>Es es un email de prueba</h1></div>'

        sendMail(to, subject, html)

        res.send('Email enviado.')

    })

    .get('/pruebausers', (req, res) => {
        let users = []
        for (let i = 0; i < 5; i++) {
            users.push(generateUser())
        }
        res.send({
            status: 'succes',
            payload: users
        })
    })

    .get('/stringlargo', (req, res) => {
        let string = ' Hola coders, esto es un string ridiculamente largo '
        for (let i = 0; i < 5e4; i++) {
            string += ' Hola coders, esto es un string ridiculamente largo '
        }
        res.send(string)
    })

    .get('/newTransaction', async (req, res) => {
        const user = 'test'
        const newTransaction = {
            user_id: user,
            amount: 300000,
            transaction_type: 'Extras',
            category: 'Ingreso',
            description: 'Extras',
            month: 'Junio',
        }

        // const addTransaction = await transaction.create(newTransaction)

        res.send(addTransaction);
        
    })


export default router
