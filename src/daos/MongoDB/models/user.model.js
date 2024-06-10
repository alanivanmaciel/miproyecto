import { Schema, model } from "mongoose";

const usersCollection = "users";

const usersSchema = new Schema({
  firstname: String,
  lastname: String,
  fullname: {
    type: String,
    required: false
  },
  age: Number,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user'
  },
  imgProfile: {
    type: String,
    default: '/uploads/profiles/default.png'
  },
  documents: [{
    name: String,
    reference: String,
  }],
  cartId: {
    type: String,
    default: 'SC'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  last_connection: {
    type: Date,
    default: null,
  }
});

const usersModel = model(usersCollection, usersSchema);

export default usersModel;
