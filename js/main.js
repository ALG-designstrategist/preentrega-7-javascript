// ==========================================
// SIMULADOR: CATÁLOGO DINÁMICO CON EL DOM
// ==========================================

// 1. Colección inicial de datos
const catalogoInicial = [
  { id: 1, nombre: "Dead by Daylight", precio: 20, categoria: "Terror" },
  { id: 2, nombre: "Killing Floor 2", precio: 30, categoria: "Acción" },
  { id: 3, nombre: "Doom Eternal", precio: 40, categoria: "Shooter" },
  { id: 4, nombre: "Resident Evil 4", precio: 45, categoria: "Terror" }
];

let catalogo = [...catalogoInicial];

// 2. Selección precisa de elementos del DOM
const contenedorItems = document.getElementById("contenedor-items");
const formulario = document.getElementById("formulario-juego");
const nombreInput = document.getElementById("nombre-input");
const precioInput = document.getElementById("precio-input");
const categoriaInput = document.getElementById("categoria-input");
const inputBusqueda = document.getElementById("input-busqueda");
const mensajeFeedback = document.getElementById("mensaje-feedback");

// 3. Función de Feedback Visual
function mostrarFeedback(mensaje, tipo = "exito") {
  mensajeFeedback.textContent = mensaje;
  mensajeFeedback.className = `feedback ${tipo}`;
  
  setTimeout(() => {
    mensajeFeedback.className = "feedback oculto";
  }, 3000);
}

// 4. Renderizado Dinámico con template strings y backticks
function renderizarCatalogo(lista) {
  contenedorItems.innerHTML = "";

  if (lista.length === 0) {
    contenedorItems.innerHTML = `<p style="color: #94a3b8;">No se encontraron títulos disponibles.</p>`;
    return;
  }

  lista.forEach(juego => {
    const card = document.createElement("div");
    card.classList.add("card-juego");
    card.innerHTML = `
      <div>
        <span class="categoria-tag">${juego.categoria}</span>
        <h3>${juego.nombre}</h3>
        <p class="precio-tag">$${juego.precio}</p>
      </div>
      <button class="btn btn-eliminar" data-id="${juego.id}">Eliminar</button>
    `;
    contenedorItems.appendChild(card);
  });

  asignarEventosEliminar();
}

// 5. Manejo de Eventos: Eliminar elemento
function asignarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  botonesEliminar.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const idAEliminar = parseInt(e.target.getAttribute("data-id"));
      const juegoEliminado = catalogo.find(j => j.id === idAEliminar);
      
      catalogo = catalogo.filter(j => j.id !== idAEliminar);
      
      renderizarCatalogo(catalogo);
      if (juegoEliminado) {
        mostrarFeedback(`Se eliminó "${juegoEliminado.nombre}" del catálogo.`, "eliminado");
      }
    });
  });
}

// 6. Manejo de Eventos: Agregar nuevo elemento (submit / click)
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevoNombre = nombreInput.value.trim();
  const nuevoPrecio = parseFloat(precioInput.value);
  const nuevaCategoria = categoriaInput.value.trim();

  if (nuevoNombre && !isNaN(nuevoPrecio) && nuevaCategoria) {
    const nuevoJuego = {
      id: Date.now(),
      nombre: nuevoNombre,
      precio: nuevoPrecio,
      categoria: nuevaCategoria
    };

    catalogo.push(nuevoJuego);
    renderizarCatalogo(catalogo);
    mostrarFeedback(`¡"${nuevoNombre}" agregado correctamente al catálogo!`, "exito");

    formulario.reset();
    nombreInput.focus();
  }
});

// 7. Evento de Teclado: Búsqueda y filtrado en tiempo real
inputBusqueda.addEventListener("keyup", (e) => {
  const termino = e.target.value.toLowerCase().trim();
  const filtrados = catalogo.filter(juego =>
    juego.nombre.toLowerCase().includes(termino) ||
    juego.categoria.toLowerCase().includes(termino)
  );
  renderizarCatalogo(filtrados);
});

// Renderizado inicial al cargar
renderizarCatalogo(catalogo);