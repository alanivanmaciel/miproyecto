import { Schema, model } from "mongoose";

const configCollection = 'configs'

const configSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    categories: {
        Ingreso: [],
        Egreso: []
    }
})

const configModel = model(configCollection, configSchema)

export default configModel