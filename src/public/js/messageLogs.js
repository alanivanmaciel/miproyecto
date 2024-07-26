const socket = io();

const h2 = document.querySelector('#user')
user = h2.textContent

socket.on("messageLogs", (data) => {
  let messageLogs = document.querySelector("#messageLogs");
  let mensajes = "";
  data.forEach((mensaje) => {
    let userMessage
    if (user === mensaje.user.trim()) {
      userMessage = 'Tu'
    } else {
      userMessage = mensaje.user.trim()
    }
    mensajes += `<li>${userMessage}: ${mensaje.message} - ${mensaje.hora}</li>`;
  });
  messageLogs.innerHTML = mensajes;
});

const chatbox = document.querySelector("#chatbox");

chatbox.addEventListener("keyup", (evt) => {
  console.log(evt.key);
  
  if (evt.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      socket.emit("message", { user, message: chatbox.value });
      chatbox.value = "";
    }
  }
});

function scrollToBottom() {
  const messageLogs = document.getElementById('messageLogs');
  messageLogs.scrollTop = messageLogs.scrollHeight;
}

// Desplazar al final cuando la página se carga
window.onload = scrollToBottom;

//***********Style SweetAlert************//

const style = document.createElement('style');
style.innerHTML = 'body.swal2-height-auto { height: 100vh !important; }';
document.getElementsByTagName('head')[0].appendChild(style);

//***********Style SweetAlert************//

//***********Expandir Sidebar************//

const expand_btn = document.querySelector(".expand-btn");

let activeIndex;

expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
});

const current = window.location.href;

const allLinksA = document.querySelectorAll(".sidebar-links a");

allLinksA.forEach((elem) => {
    elem.addEventListener("click", function () {
        const hrefLinkClick = elem.href;

        allLinksA.forEach((link) => {
            if (link.href == hrefLinkClick) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    });
});

const mainItems = document.querySelectorAll(
    '.main-item'
);

mainItems.forEach((mainItem) => {
    mainItem.addEventListener('click', () => {
        mainItem.classList.toggle(
            'main-item--open'
        );
    })
});

//***********Expandir Sidebar************//