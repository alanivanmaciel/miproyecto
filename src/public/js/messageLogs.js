const socket = io();

const h2 = document.querySelector('#user')
user = h2.textContent

socket.on("messageLogs", (data) => {
  let messageLogs = document.querySelector("#messageLogs");
  let mensajes = "";
  data.forEach((mensaje) => {
    mensajes += `<li>${mensaje.user} dice: ${mensaje.message} - ${mensaje.hora}</li>`;
  });
  messageLogs.innerHTML = mensajes;
});

const chatbox = document.querySelector("#chatbox");

chatbox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      socket.emit("message", { user, message: chatbox.value });
      chatbox.value = "";
    }
  }
});