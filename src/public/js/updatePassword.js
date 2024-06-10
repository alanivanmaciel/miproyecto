const password = document.querySelector("#password");
const confirmInput = document.querySelector("#confirmPassword");
const message = document.querySelector("#status")
const buttonConfirm = document.querySelector("#confirm")

confirmInput.addEventListener("keyup", (evt) => {

  const confirmPassword = evt.target.value;

  if (password.value.trim().length <= 0) {
    password.style.border = "2px solid red"
    buttonConfirm.disabled = true
    buttonConfirm.style.backgroundColor = "#ccc"
    message.innerHTML = '<p>Ingrese la nueva contraseña en ambos campos.</p>'
  } else if (confirmPassword !== password.value) {
    password.style.border = "2px solid #ebebeb"
    confirmInput.style.border = "2px solid red"
    buttonConfirm.style.backgroundColor = "#ccc"
    buttonConfirm.disabled = true
    message.innerHTML = '<p>Las contraseñas ingresadas no coinciden.</p>'
  } else {
    buttonConfirm.style.backgroundColor = "#216ce7"
    buttonConfirm.disabled = false
    message.innerHTML = ''
  }
});