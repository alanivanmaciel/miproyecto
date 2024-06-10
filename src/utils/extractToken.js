import { configObject } from "../config/connectDB.js";
import jwt from "jsonwebtoken";

const { jwt_secret_Key } = configObject

export const extractCookie = (cookie) =>  jwt.verify(cookie, jwt_secret_Key)