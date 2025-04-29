// Funciones de seguridad URL
function contieneURL(texto) {
  const patronURL = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  return patronURL.test(texto);
}
function validarTextoSinURL(texto) {
  if (contieneURL(texto)) {
    mostrarVentanaEmergente("⚠️ Por seguridad, no se permiten URLs en los comentarios o respuestas.");
    return false;
  }
  return true;
}


//*PRUEBA*
// Funciones de seguridad números

// Esta función verifica si el texto contiene números del 0 al 9

function contienenum(texto) {
  const patronNum = /(1234567890)/g;
  return patronNum.test(texto);
}
function validarTextoSinNum(texto) {
  if (contienenum(texto)) {  
    mostrarVentanaEmergente("⚠️ Por seguridad, no se permiten números en los comentarios o respuestas.");
    return false;
  }
  return true;
}

//RESULTADO: NO FUNCIONA, NO SE MUESTRA EL MENSAJE DE ERROR EN LA VENTANA EMERGENTE Y DEJA PUBLICAR EL COMENTARIO
//*FIN PRUEBA*



// Función para mostrar la ventana emergente personalizada
function mostrarVentanaEmergente(mensaje) {
  // Crear fondo del modal
  const fondoModal = document.createElement("div");
  fondoModal.classList.add("fondo-modal");

  // Crear contenido del modal
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const mensajeP = document.createElement("p");
  mensajeP.textContent = mensaje;

  const botonCerrar = document.createElement("button");
  botonCerrar.textContent = "Cerrar";
  botonCerrar.classList.add("boton-cerrar");
  botonCerrar.onclick = () => document.body.removeChild(fondoModal);

  modal.appendChild(mensajeP);
  modal.appendChild(botonCerrar);
  fondoModal.appendChild(modal);
  document.body.appendChild(fondoModal);
}

// Función principal para publicar comentario
function publicarComentario() {
  const comentarioInput = document.getElementById("comentario");
  const texto = comentarioInput.value.trim();

  if (texto === "" || !validarTextoSinURL(texto)) return;

  const comentarioData = {
    texto,
    likes: 0,
    reacciones: { "❤️": 0, "😂": 0, "😮": 0, "😢": 0 }
  };

  agregarComentarioAlDOM(comentarioData);
  comentarioInput.value = "";
}

// Agregar comentario al DOM
function agregarComentarioAlDOM(data) {
  const comentarioDiv = document.createElement("div");
  comentarioDiv.classList.add("comentario");

  const textoP = document.createElement("p");
  textoP.innerHTML = data.texto; // Para soportar emojis escritos

  // Contenedor de reacciones
  const reaccionesDiv = document.createElement("div");
  reaccionesDiv.classList.add("reacciones");

  for (let emoji in data.reacciones) {
    const reaccionSpan = document.createElement("span");
    reaccionSpan.classList.add("reaccion");
    reaccionSpan.innerHTML = `${emoji} <span class="like-contador">${data.reacciones[emoji]}</span>`;

    reaccionSpan.onclick = () => {
      if (data.reacciones[emoji] < 1) { // Limitar a 5 reacciones por tipo
        data.reacciones[emoji]++;
        reaccionSpan.querySelector(".like-contador").textContent = data.reacciones[emoji];
      } else {
        mostrarVentanaEmergente("¡Has alcanzado el límite de reacciones para este emoji!");
      }
    };

    reaccionesDiv.appendChild(reaccionSpan);
  }

  // Contenedor de respuestas
  const respuestasContenedor = document.createElement("div");
  respuestasContenedor.classList.add("respuestas");

  // Input para respuesta
  const inputRespuesta = document.createElement("input");
  inputRespuesta.type = "text";
  inputRespuesta.placeholder = "Escribe una respuesta...";
  inputRespuesta.classList.add("input-respuesta");

  // Botón para enviar respuesta
  const botonRespuesta = document.createElement("button");
  botonRespuesta.textContent = "Responder";
  botonRespuesta.classList.add("boton-responder");

  botonRespuesta.onclick = () => {
    crearRespuesta(inputRespuesta, respuestasContenedor);
  };

  comentarioDiv.appendChild(textoP);
  comentarioDiv.appendChild(reaccionesDiv);
  comentarioDiv.appendChild(inputRespuesta);
  comentarioDiv.appendChild(botonRespuesta);
  comentarioDiv.appendChild(respuestasContenedor);

  const lista = document.getElementById("lista_comentarios");
  lista.prepend(comentarioDiv);
}

// Crear una nueva respuesta
function crearRespuesta(input, contenedorRespuestas) {
  const respuestaTexto = input.value.trim();

  if (respuestaTexto !== "" && validarTextoSinURL(respuestaTexto)) {
    const nuevaRespuesta = document.createElement("div");
    nuevaRespuesta.classList.add("respuesta");
    nuevaRespuesta.textContent = respuestaTexto;
    contenedorRespuestas.appendChild(nuevaRespuesta);
    input.value = "";
  }
}
