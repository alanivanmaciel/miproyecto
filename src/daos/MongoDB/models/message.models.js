import { Schema, model } from "mongoose";

const messageCollection = "messages";

const messageSchema = new Schema({
  user: String,
  message: String,
  fecha: { type: String, default: getFormattedDate },
  hora: { type: String, default: getFormattedTime },
});

function getFormattedDate() {
  const now = new Date();
  return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
}

function getFormattedTime() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

const messageModel = model(messageCollection, messageSchema);

export default messageModel;
