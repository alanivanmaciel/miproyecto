const socket = io();
const idSocket = socket.id

// document.getElementById('logout').addEventListener('click', async () => {
//   let cookie = 'CookieToken'
//   document.cookie = cookie + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
// })

function product(pid) {
  window.location.href = `/api/products/${pid}`
}

async function updateCategoryOptions() {
  const transactionType = document.getElementById('transactionType').value;
  const categorySelect = document.getElementById('category');

  // const categories = {
  //     Ingreso: ['Salario', 'Venta', 'Intereses', 'Dividendo'],
  //     Gasto: ['Alquiler', 'Comida', 'Transporte', 'Entretenimiento', 'Educación']
  // };

  try {
    const response = await fetch(`/api/config/${transactionType}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const categories = await response.json();
    console.log(categories);
    
    // Clear the existing options
    categorySelect.innerHTML = '';

    // Populate the new options based on the fetched categories
    categories.forEach(category => {
      
      const option = document.createElement('option');
      option.value = category; // Assuming your categories have a 'name' field
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
}

function addTransaction(data) {
  const user = data
  Swal.fire({
    title: 'Nuevo movimiento',
    html: `
    <form id="transactionForm" action="/" method="post" enctype="multipart/form-data">
      <label for="transactionType">Movimiento:</label>
      <select id="transactionType" name="transactionType" onchange="updateCategoryOptions()">
        <option value="" selected disabled>Eliga una opcion</option>                      
        <option value="Ingreso">Ingreso</option>
        <option value="Egreso">Gasto</option>
      </select><br>      
      <label for="category">Categoria:</label>
      <select id="category">
      </select><br>
      <label for="amount">Monto:</label>
      <input type="number" id="amount" name="amount" required><br>
      <label for="description">Detalle:</label>
      <input type="text" id="description" name="description"><br>
      <label for="month">Mes:</label>
      <select id="month">
        <option value="Enero">Enero</option>
        <option value="Febrero">Febrero</option>
        <option value="Marzo">Marzo</option>
        <option value="Abril">Abril</option>
        <option value="Mayo">Mayo</option>
        <option value="Junio">Junio</option>
        <option value="Julio">Julio</option>
        <option value="Agosto">Agosto</option>
        <option value="Septiembre">Septiembre</option>
        <option value="Octubre">Octubre</option>
        <option value="Noviembre">Noviembre</option>
        <option value="Diciembre">Diciembre</option>
      </select><br>
            
    </form>
    `,
    showCancelButton: true,
    confirmButtonText: "Guardar cambios",
    cancelButtonText: "Cancelar",

    preConfirm: () => {

      const transactionType = document.getElementById('transactionType').value;
      const category = document.getElementById('category').value;
      const amount = document.getElementById('amount').value;
      const description = document.getElementById('description').value;
      const month = document.getElementById('month').value;


      if (!category || !amount || !month) {
        Swal.showValidationMessage(
          `Hay campos que estan vacios.`
        );
      }
      socket.emit('addTransaction', {
        user,
        transactionType,
        category,
        amount,
        description,
        month
      })



    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Éxito',
        text: 'Movimiento registrado correctamente.',
        icon: 'success'
      });
    }
  });
}


function addCategory(user) {
  const userLogged = user
  const newCategory = document.querySelector("#newCategory").value
  const listCategory = document.querySelector("#categories")
  if (newCategory === '') {
    Swal.fire({
      title: 'Warning',
      text: 'No se puede añadir un campo vacio.',
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: "custom-toast",
      },
    });

  } else {
    const newCategoryElement = document.createElement("p");
    newCategoryElement.textContent = newCategory;
    listCategory.appendChild(newCategoryElement);
    console.log(userLogged, newCategory);

    socket.emit('newCategory', ({ newCategory, user: user }))



    document.querySelector("#newCategory").value = '';
  }

}

// Tab Configuration //

const allLinks = document.querySelectorAll(".tabs a");
const allTabs = document.querySelectorAll(".tab-content")
const tabContentWrapper = document.querySelector(".tab-content-wrapper");

const shiftTabs = (linkId) => {
  allTabs.forEach((tab, i) => {

    if (tab.id.includes(linkId)) {
      allTabs.forEach((tabItem) => {
        tabItem.style = `transform: translateY(-${i * 300}px);`;
      });
    }
  });
}

allLinks.forEach((elem) => {
  elem.addEventListener('click', function () {
    const linkId = elem.id;
    const hrefLinkClick = elem.href;

    allLinks.forEach((link, i) => {
      if (link.href == hrefLinkClick) {
        link.classList.add("active");
      } else {
        link.classList.remove('active');
      }
    });

    shiftTabs(linkId);
  });
});

const currentHash = window.location.hash;

let activeLink = document.querySelector(`.tabs a`);

if (currentHash) {
  const visibleHash = document.getElementById(
    `${currentHash.replace('#', '')}`
  );

  if (visibleHash) {
    activeLink = visibleHash;
  }
}

// activeLink.classList.toggle('active');

// shiftTabs(activeLink.id);

// Tab Configuration //

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