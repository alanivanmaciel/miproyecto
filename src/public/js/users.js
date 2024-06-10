const socket = io();
const idSocket = socket.id

function deleteUser(uid) {
    socket.emit('deleteUser', uid)
}

function editUser(uid) {
    socket.emit('getUser', uid)
}

socket.on('getUsers', (data) => {
    const tableContainer = document.getElementById("users");
    if (tableContainer && Array.isArray(data.users)) {
        tableContainer.innerHTML = ""

        const users = data.users

        if (users.lenght === 0) {
            const noUsersMessage = document.createElement("p");
            noUsersMessage.textContent = "No hay usuarios listados.";
            productList.appendChild(noUsersMessage);
        } else {
            const table = document.createElement("table");
            table.classList.add('tableUsers')

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['Nombre', 'Apellido', 'Email', 'Perfil', 'Estado'];
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            users.forEach(user => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.isActive}</td>
                    <td>${user.cartId}</td>
                    <td>
                        <button type="button" onclick="editUser('${user.id}')">Editar</button>
                        <button type="button" onclick="deleteUser('${user.id}')">Eliminar</button>
                        <button class="buttonHref"><a href="/api/users/premium/${user.id}">Update ${user.role === 'user' ? 'premium' : 'user'}</a></button>
                    </td>
                `;

                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            tableContainer.appendChild(table);
        }
    }
});

socket.on('dataUser', (user) => {
    Swal.fire({
        title: 'Datos de usuario',
        html: `
        <form id="userForm" action="/api/users/${user._id}/documents" method="post" enctype="multipart/form-data">
            <img src="${user.imgProfile}" alt="Profile Image" style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%;"><br>
            <label for="firstname">Nombre:</label>
            <input type="text" id="firstname" name="firstname" value="${user.firstname}" required><br>
            <label for="lastname">Apellido:</label>
            <input type="text" id="lastname" name="lastname" value="${user.lastname}" required><br>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" value="${user.password}" required><br>
            <label>Perfil: ${user.role}</label><br>
            <label>Email: ${user.email}</label><br>
            <label>Estado: ${user.isActive}</label><br>
            <label for="file">Identificacion:</label>
            <input type="file" name="identificacion" id="documents" multiple required><br>
            <label for="file">Comprobantes:</label><br>
            <label for="file">Domicilio:</label>
            <input type="file" name="domicilio" id="documents" multiple required><br>
            <label for="file">Estado de cuenta:</label>
            <input type="file" name="estDeCuenta" id="documents" multiple required><br>
        </form>
        `,
        showCancelButton: true,
        confirmButtonText: "Guardar cambios",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            const form = document.getElementById('userForm');
            const formData = new FormData(form);

            return fetch(form.action, {
                method: 'POST',
                body: formData
            }).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).catch(error => {
                Swal.showValidationMessage(
                    `Request failed: ${error}`
                );
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Éxito',
                text: 'Usuario actualizado correctamente.',
                icon: 'success'
            });
        }
    });
})

socket.on("userInactive", () => {
    Swal.fire({
        icon: "warning",
        title: "El usuario ya esta inactivo.",
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
            popup: "custom-toast",
        },
    });
})

document.getElementById('logout').addEventListener('click', async () => {
    let cookie = 'CookieToken'
    document.cookie = cookie + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
})