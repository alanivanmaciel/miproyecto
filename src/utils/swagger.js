import swaggerJSDoc from "swagger-jsdoc"
import __dirname from "../utils.js"

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion de app Eccomerce',
            description: ' Descripcion de nuestro Eccomerce'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const spec = swaggerJSDoc(swaggerOptions)

export default spec
