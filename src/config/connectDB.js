import dotenv from 'dotenv'
import program from "../utils/commander.js";
import MongoSingleton from "../utils/mongoSingleton.js";

const { mode } = program.opts()

dotenv.config({
  path: mode === 'development' ? './.env.development' : './.env.production'
})

export const configObject = {
  port:           process.env.PORT || 8080,
  mongo_url:      process.env.MONGOURL,
  jwt_secret_Key: process.env.JWT_SECRET_KEY,
  persistence:    process.env.PERSISTENCE,
  node_env:       process.env.NODE_ENV,
  gmail_user:     process.env.GMAIL_USER_APP,
  gmail_pass:     process.env.GMAIL_PASS_APP,
  twilio_sid:     process.env.TWILIO_ACCOUNT_SID,
  twilio_token:   process.env.TWILIO_AUTH_TOKEN,
  twilio_number:  process.env.TWILIO_NUMBER,
  enlace:         process.env.ENLACE
}

export const connectDB = async () => {
  try {
    await MongoSingleton.getInstance(process.env.MONGOURL)
  } catch (error) {
    logger.fatal(error);
  }
};
 