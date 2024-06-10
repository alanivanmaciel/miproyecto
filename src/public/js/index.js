const socket = io();
const idSocket = socket.id

// const owner = document.getElementById("owner").value;

socket.on("updateProducts", (data) => {
  const productList = document.getElementById("productList");
  if (productList && Array.isArray(data.products)) {
    productList.innerHTML = "";

    const products = data.products;

    if (products.length === 0) {
      const noProductsMessage = document.createElement("p");
      noProductsMessage.textContent = "No hay productos disponibles.";
      productList.appendChild(noProductsMessage);
    } else {
      products.forEach((product) => {
        const id = product._id.toString();
        const productContainer = document.createElement("div");
        const parametro = "id";
        productContainer.classList.add("cardProduct");
        productContainer.setAttribute(parametro, id);
        productContainer.innerHTML = ` 
        <div class="content">
          <div class="title">${product.title}</div>
          <div class="price">$${product.price}</div>
          <div class="description">${product.description}</div>
        </div>
        <button class="${data.displayAdmin}" type="button" onclick="addToCart(_id='${id}', email='${owner}')">Agregar al carrito</button>
        <button type="button" onclick="updateProductId('${id}','${product.code}','${product.title}','${product.description}','${product.price}','${product.thumbnail}','${product.stock}','${product.category}')">Actualizar producto</button>
        <button type="button" onclick="deleteProduct('${id}')">Eliminar producto</button>   
        </div>
        `;
        productList.appendChild(productContainer);
      });
      if (data.hasPrevPage) {
        const prevPageLink = document.createElement("a");
        prevPageLink.href = `/realtimeproducts?pageQuery=${data.prevPage}`;
        prevPageLink.textContent = "Anterior";
        productList.appendChild(prevPageLink);
      }
      const label = document.createElement("label");
      label.textContent = data.page;
      productList.appendChild(label);

      if (data.hasNextPage) {
        const nextPageLink = document.createElement("a");
        nextPageLink.href = `/realtimeproducts?pageQuery=${data.nextPage}`;
        nextPageLink.textContent = "Siguiente";
        productList.appendChild(nextPageLink);
      }

      if (data.deleted) {
        Swal.fire({
          icon: "success",
          title: `Producto eliminado correctamente.`,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "custom-toast",
          },
        });
      } else if (data.deleted === false) {

        Swal.fire({
          icon: "warning",
          title: `No tenes permisos para borrar este producto.`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

      }
    }
  } else {
    console.log("Error: La estructura de datos de 'data' no es válida.");
  }
});

function addProduct() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;


  socket.emit("addProduct", {
    title,
    description,
    code,
    price,
    thumbnail,
    stock,
    category,
    owner
  }
  );

  clear();

}

function addToCart(_id, email) {
  const quantity = document.getElementById('quantity').value;
  socket.emit("addToCart", { _id, email, quantity });
}

socket.on("exisitingCode", (data) => {
  Swal.fire({
    title: "Este producto ya existe!",
    text: `El codigo ${data.data} ya existe en el listado de productos.`,
  });
});

function clear() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("code").value = "";
  document.getElementById("price").value = "";
  document.getElementById("thumbnail").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("category").value = "";
}

function updateProductId(
  idProduct,
  code,
  title,
  description,
  price,
  thumbnail,
  stock,
  category
) {
  Swal.fire({
    title: "¿Desea actualizar este producto?",
    text: "Esta acción no se puede deshacer.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, actualizar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Actualizar producto",
        html: `
          <img src="${thumbnail}" alt="Profile Image" style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%;"><br>
          <label >ID: ${idProduct}</label><br>
          <label for="updateCode">Código:</label>
          <input type="text" id="updateCode" value="${code}" required><br>
          <label for="updateTitle">Título:</label>
          <input type="text" id="updateTitle" value="${title}" required><br>
          <label for="updateDescription">Descripción:</label>
          <input type="text" id="updateDescription" value="${description}" required><br>
          <label for="updatePrice">Precio:</label>
          <input type="number" id="updatePrice" value="${price}" required><br>
          <label for="updateThumbnail">Thumbnail:</label>
          <input type="file" id="product" name="product"><br>
          <label for="updateStock">Stock:</label>
          <input type="number" id="updateStock" value="${stock}" required><br>
          <label for="updateCategory">Categoría:</label>
          <input type="text" id="updateCategory" value="${category}" required><br>
        `,
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        preConfirm: async () => {

          const formData = new FormData();
          const fileInput = document.getElementById("product");
          if (fileInput.files.length > 0) {
            formData.append('product', fileInput.files[0]);
          }

          const response = await fetch('/api/products/upload', {
            method: 'POST',
            body: formData
          });
          const result = await response.json();

          if (result.status === 'success') {
            const updateProduct = {
              idProduct,
              code: document.getElementById("updateCode").value,
              title: document.getElementById("updateTitle").value,
              description: document.getElementById("updateDescription").value,
              price: document.getElementById("updatePrice").value,
              thumbnail: result.filePath,
              stock: document.getElementById("updateStock").value,
              category: document.getElementById("updateCategory").value,
            };

            socket.emit("updateProductId", updateProduct)

            Swal.fire(
              "Actualizado",
              "El producto ha sido actualizado correctamente.",
              "success"
            );
          } else {
            Swal.fire(
              "Error",
              "Hubo un problema al subir la imagen. Por favor, intenta nuevamente.",
              "error"
            );
          }

        },
      });
    }
  });
}

function deleteProduct(idProduct) {
  socket.emit("deleteProduct", { idProduct, owner });
}

socket.on("addToCartSucces", (cart) => {
  Swal.fire({
    icon: "success",
    title: "Producto agregado al carrito.",
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: "custom-toast",
    },
  });
});

socket.on("noAddUserPremium", () => {
  Swal.fire({
    icon: "warning",
    title: "No puede agregar al carrito un producto propio.",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
})

socket.on("codeEmpty", () => {
  Swal.fire({
    text: `El campo 'Codigo' no puede ser vacio.`,
  });
})

document.getElementById('logout').addEventListener('click', async () => {
  let cookie = 'CookieToken'
  document.cookie = cookie + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
})

function product(pid) {
  window.location.href = `/api/products/${pid}`
}
