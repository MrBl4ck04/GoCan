document.addEventListener("DOMContentLoaded", function () {
  // Obtener el ID de usuario desde localStorage
  const idUsuario = localStorage.getItem("id_usuario");

  // Inicializar el contador al cargar la página
  if (idUsuario) {
    fetch(
      `http://localhost/GoCan/src/modules/php/favoritos.php?id_usuario=${idUsuario}`
    )
      .then((response) => response.json())
      .then((data) => {
        document.querySelector(".btn-badge").textContent = data.cantidad;
      })
      .catch((error) =>
        console.error("Error al cargar la cantidad de productos:", error)
      );
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Obtener elementos
  var fav = document.getElementById("modal");
  var openfavBtn = document.getElementById("openFavBtn");
  var closeModalBtn = document.querySelector(".close-btn");
  var toggleSearchBtn = document.getElementById("toggleSearchBtn");
  var searchBtn = document.getElementById("searchBtn");
  var searchInput = document.getElementById("searchInput");
  var searchContainer = document.querySelector(".search-container");

  // Abrir el modal al hacer clic en el botón
  openfavBtn.addEventListener("click", function () {
    fetchFavoritos();
    fav.style.display = "block";
  });

  // Cerrar el modal al hacer clic en el botón de cerrar
  closeModalBtn.addEventListener("click", function () {
    fav.style.display = "none";
  });

  // Cerrar el modal al hacer clic fuera del contenido del modal
  window.addEventListener("click", function (event) {
    if (event.target === fav) {
      fav.style.display = "none";
    }
  });
  // Mostrar la barra de búsqueda al hacer clic en el botón de búsqueda
  toggleSearchBtn.addEventListener("click", function () {
    if (searchContainer.style.display === "none") {
      searchContainer.style.display = "flex";
      searchInput.focus();
    } else {
      searchContainer.style.display = "none";
      searchInput.value = ""; // Limpiar la búsqueda cuando se oculta
      fetchFavoritos(); // Mostrar todos los productos favoritos
    }
  });

  // Buscar productos al presionar Enter en el campo de búsqueda
  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchProducts();
    }
  });

  // Buscar productos al hacer clic en el botón de búsqueda
  searchBtn.addEventListener("click", function () {
    searchProducts();
  });

  // Buscar productos al hacer clic en el botón de búsqueda
  searchBtn.addEventListener("click", function () {
    searchProducts();
  });
  function fetchFavoritos() {
    fetch("http://localhost/GoCan/src/modules/php/favoritos.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_usuario: localStorage.getItem("id_usuario") }),
    })
      .then((response) => response.json())
      .then((data) => {
        displayProducts(data);
      })
      .catch((error) => console.error("Error fetching favoritos:", error));
  }

  // Función para mostrar productos
  function displayProducts(products) {
    favoritosBody.innerHTML = ""; // Limpiar el contenido anterior
    products.forEach(function (producto) {
      var productoDiv = document.createElement("div");
      productoDiv.classList.add("producto");

      var deleteIcon = document.createElement('span');
      deleteIcon.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
      deleteIcon.classList.add('delete-icon');
      deleteIcon.addEventListener('click', function() {
        eliminarProducto(producto.id_producto, productoDiv);
      });

      var nombre = document.createElement("h3");
      nombre.textContent = producto.nombre;
      nombre.classList.add("nombre");

      var descripcion = document.createElement("p");
      descripcion.textContent = producto.descripcion;
      descripcion.classList.add("descripcion");

      var costo = document.createElement("p");
      costo.textContent = "Costo: " + parseFloat(producto.precio).toFixed(2); // Formatear a un decimal
      costo.classList.add("precio");

      var imagen = document.createElement("img");
      imagen.src = producto.imagen;
      imagen.classList.add("producto-imagen");


      var infoDiv = document.createElement("div");
      infoDiv.classList.add("producto-info");
      infoDiv.appendChild(nombre);
      infoDiv.appendChild(descripcion);
      infoDiv.appendChild(costo);

      productoDiv.appendChild(deleteIcon);
      productoDiv.appendChild(imagen);
      productoDiv.appendChild(infoDiv);

      favoritosBody.appendChild(productoDiv);
    });
  }

  function eliminarProducto(id_producto, productoDiv) {
    fetch('http://localhost/GoCan/src/modules/php/favoritos.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_producto: id_producto })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        favoritosBody.removeChild(productoDiv); // Eliminar el producto del display
      } else {
        console.error('Error eliminando el producto:', data.error);
      }
    })
    .catch(error => console.error('Error:', error));
  }

  // Función para buscar productos
  function searchProducts() {
    var input = document.getElementById("searchInput");
    var filter = input.value.toLowerCase();
    var productos = favoritosBody.getElementsByClassName("producto");
    var filteredProducts = [];

    for (var i = 0; i < productos.length; i++) {
      var nombre = productos[i].getElementsByClassName("nombre")[0];
      if (nombre && nombre.textContent.toLowerCase().includes(filter)) {
        filteredProducts.push({
          nombre: nombre.textContent,
          descripcion:
            productos[i].getElementsByClassName("descripcion")[0].textContent,
          precio: productos[i]
            .getElementsByClassName("precio")[0]
            .textContent.split(": ")[1],
          imagen: productos[i].getElementsByClassName("producto-imagen")[0].src,
        });
      }
    }

    displayProducts(filteredProducts);
  }
});
