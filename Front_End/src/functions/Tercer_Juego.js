import confetti from 'canvas-confetti';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';


// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Constantes / Variables
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// lista de palabras quemadas con su respectiva imagen
const palabras = [
  { palabra: "Barco", imagen: "img/tercerJuego/barco.png" },
  { palabra: "Manglar", imagen: "img/tercerJuego/manglar.png" },
  { palabra: "Almejas", imagen: "img/tercerJuego/almejas.png" },
  { palabra: "Bailarina", imagen: "img/tercerJuego/bailarina.png" },
  { palabra: "Camaron", imagen: "img/tercerJuego/camaron.png" },
  { palabra: "Delfin", imagen: "img/tercerJuego/delfin.png" },
  { palabra: "Faro", imagen: "img/tercerJuego/faro.png" },
  { palabra: "Ferry", imagen: "img/tercerJuego/ferry.png" },
  { palabra: "Langosta", imagen: "img/tercerJuego/langosta.png" },
  { palabra: "Marimba", imagen: "img/tercerJuego/marimba.png" },
  { palabra: "Panga", imagen: "img/tercerJuego/panga.png" },
  { palabra: "Parroquia", imagen: "img/tercerJuego/parroquia.png" },
  { palabra: "Tiburon", imagen: "img/tercerJuego/tiburon.png" },
  { palabra: "Velero", imagen: "img/tercerJuego/velero.png" },
  { palabra: "Yate", imagen: "img/tercerJuego/yate.png" },
];


let rondaActual = 0;
let aciertos = 0;
const maxRondas = 7;
let palabrasUsadas = []; //esto se usara para guardar las palabras utilizadas y evitar que se repitan
let dropActivo = true; // esta "bandera" controla si la zona esta activa o no, para evitar multipls drops en una ronda


// Audios
let musica = new Audio('audio/musica.mp3');
let victorySound = new Audio('audio/victoria.mp3');
let loseSound = new Audio('audio/derrota.mp3');


// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Mensajes para de modales
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// mensaje de la victoria
function messageVictory() {
  return `
        <p>🤯 Has completado el juego con ${aciertos} aciertos de ${maxRondas} posibles 🤯, ¡increíble!</p>
        <p> Puedes volver a intentarlo y tratar de mejorar tu récord. 😏</p>
        <p> <b>Muchas gracias por jugar, esperamos que te hayas divertido 🥰</b></p>`;
}


// mensaje de la victoria
function messageVictoryFull() {
  return `
        <p>🤯 Has acertado todo, ¡eres fascinante! 🤯 </p>
        <p> No nos queda mas que alabarte, esperamos que hayas aprendido con nosotros.</p>
        <p> <b>Muchas gracias por jugar, esperamos que te hayas divertido 🥰</b></p>`;
}

// modal para el inicio de la pantalla
const modalBienvenida = `
    <div class="modal fade" id="ModalBienvenida" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 w-100"> ¡Bienvenido al Juego de Adivinanza! </h1>
                </div>
                <div class="modal-body">
                    <p> Te daremos una palabra, tienes que saber cual de las tres imagenes es la correcta</p>
                    <p> Haz clic en "Comenzar" para iniciar con el juego y la música 🎵</p>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Comenzar</button>
                </div>
            </div>
        </div>
    </div>
    `;


// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Funciones principales
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$




// funcion encargada de dar la bienvenida al juego
// tambien, sera encargada de "disparar" la musica, porque en algunos navegadores no lo lee automaticamente
function mostrarModalBienvenida() {

  // insertamos el modal de bienvenida al final del body
  document.body.insertAdjacentHTML("beforeend", modalBienvenida);

  // creamos la instancia para mostrar ese modal recien insertado
  const bienvenidaModal = new Modal(document.getElementById('ModalBienvenida'));
  bienvenidaModal.show();

  // volvemos a obtener el elemento DOM del modal de bienvenida para...
  // escuchar los eventos al momento en el que se cierra
  const modalElement = document.getElementById('ModalBienvenida');
  modalElement.addEventListener('hidden.bs.modal', () => {

    // inicializamos la musica de fondo
    musica.loop = true;
    musica.volume = 0.15;
    musica.play();
    configurarEventos();
    iniciarJuego();

  });
}


// encargado de la logica del juego
function iniciarJuego() {

  // verificar que el juego no haya terminado
  if (rondaActual < maxRondas) {

    const palabra = obtenerPalabraAleatoria(); // elegimos una palabra al azar
    mostrarPalabra(palabra); // muestra el texto de esa palabra en pantalla
    prepararDropZone(palabra); // prepara el area donde soltara la imagen correcta
    mostrarOpciones(palabra); // generar las tres imagenes

  } else { // en caso de que ya haya terminado la partida

    if (aciertos > (maxRondas) / 2) {  // revisa si mas del 50% fue acertado

      if (aciertos === maxRondas) { // verifica si fue vistoria completa

        // llenamos el modal de victoria
        document.getElementById('ModalBody').innerHTML = messageVictoryFull();

        // llamamos el canvas de confettis
        launchConfetti();

        // esperamos el tiempo suficiente, a que aparezca el modal de victoria
        // para que el confeti aparezca junto o sobre el
        setTimeout(() => {
          const canvas = document.querySelector("canvas"); // buscamos el elemento canvas
          if (canvas) {
            canvas.classList.add("confetti-canvas"); // le agregamos la clase de css que se creo, y le dimos un z-index mayor al modal
          }
        }, 50);// esperamos 50 milisegundos


        musica.pause(); // pausamos la musica de fondo
        musica.currentTime = 0; // reiniciamos el tiempo de reproduccion

        victorySound.play(); // mreproducimos la musica de victoria

        const modal = new Modal(document.getElementById('ModalFelicitaciones'));
        modal.show();


      } else { // victoria pero no total

        // llenamos el modal de victoria
        document.getElementById('ModalBody').innerHTML = messageVictory();

        // llamamos el canvas de confettis
        launchConfetti();

        // esperamos el tiempo suficiente, a que aparezca el modal de victoria
        // para que el confeti aparezca junto o sobre el
        setTimeout(() => {
          const canvas = document.querySelector("canvas"); // buscamos el elemento canvas
          if (canvas) {
            canvas.classList.add("confetti-canvas"); // le agregamos la clase de css que se creo, y le dimos un z-index mayor al modal
          }
        }, 50);// esperamos 50 milisegundos


        musica.pause(); // pausamos la musica de fondo
        musica.currentTime = 0; // reiniciamos el tiempo de reproduccion

        victorySound.play(); // mreproducimos la musica de victoria

        const modal = new Modal(document.getElementById('ModalFelicitaciones'));
        modal.show();

      }

    } else { // en caso de derrota (50% o menos)

      musica.pause(); // pausamos la musica de fondo
      musica.currentTime = 0;  // reiniciamos su tiempo de reproduccion

      loseSound.play(); // reproducimos la musica de derrota

      // llamamos el modal de derrota
      const modal = new Modal(document.getElementById('ModalDerrota'));
      modal.show();
    }

  }



}

// ============================
// Funciones de la ronda
// ============================


// ellige una palabra al azar
function obtenerPalabraAleatoria() {

  // filtrar palabras para obtener solo las que no se han usado
  const disponibles = palabras.filter(p => !palabrasUsadas.includes(p.palabra));

  //  elegir una palabra al azar de la lista d edisponibles
  const seleccion = disponibles[Math.floor(Math.random() * disponibles.length)];
  
  // agregamos la palabra elegida a la list de usadas para no repetirla
  palabrasUsadas.push(seleccion.palabra);

  // retornamos la plabra seleccionada
  return seleccion;
}

// mostrar el texo de la plabra que debe adivinar el jugador
function mostrarPalabra(palabra) {
  // la palabra obtenida en el evento alaetorio, sera enviada al html
  document.getElementById("palabraMostrar").innerText = palabra.palabra;
}


// muestra las opciones en la parte inferior 
function mostrarOpciones(correcta) {

  // obtenemos el contenedor donde se mostraran las imagenes y lo limpiamos
  const opcionesContainer = document.getElementById("opcionesContainer");
  opcionesContainer.innerHTML = "";

  // seleccionamos dos palabras que no sean las correctas para usarlas como distractores
  const distractores = palabras
    .filter(p => p.palabra !== correcta.palabra) // exluye la palabra correcta que viene con el llamado de la funcion
    .sort(() => 0.5 - Math.random()) // mezcla aleatoria
    .slice(0, 2); // toma solo dos

  // combinamos las tres palabras y las volvemos a mezclar
  const opciones = [...distractores, correcta].sort(() => 0.5 - Math.random());

  // por cada opcion (3), creamos una tarjeta con su imgaen
  opciones.forEach(op => {

    const div = document.createElement("div"); // creamos un div como conteedor de la imagen
    div.className = "card p-2"; // le damos el estilo de tarjeta
    div.style = "border: black solid;"

    const img = document.createElement("img"); // creamos un elemento de imagen
    img.src = op.imagen; // establecemos la ruta de la imagen 
    img.className = "card-img"; // estilo de css
    img.draggable = true; // hacemos que la imagen sea arrastrable
    img.dataset.palabra = op.palabra; // guardamos la palabra asociada en el dataset para poder leerla al hacer el drop

    // evento que se dispara al comenzar a arrastrar la imagen
    img.ondragstart = (e) => e.dataTransfer.setData("text", e.target.dataset.palabra);

    div.appendChild(img); // insertamos la imagen dentro del div
    opcionesContainer.appendChild(div); // metemos la tarjeta al contenedor principal
  });
}


// ============================
// Interaccion Drag y Drop
// ============================

// prepara la zona donde se soltara la imagen
function prepararDropZone(palabraCorrecta) {
  // obtenemos el contenido donde se arrastrara la imgen
  const dropZone = document.getElementById("dropZone");

  // lo limpiamos por si hy texto o imagenes
  dropZone.innerHTML = "";

  // guardamos la palabra correcta como atributo personalizado (para luego validar el drop)
  dropZone.dataset.respuesta = palabraCorrecta.palabra;
}

// manejamos el evento de soltar la imagen sobre la zona de respuesat
function manejarDrop(e) {

  // si el drop esta desactivado, ignorar el evento
  if (!dropActivo) return;

  e.preventDefault(); // evitamos el comportamiento por defecto del navegador

  dropActivo = false; // bloquear nuevos drops hasta qye termine la ronda

  // obtenemos la palabra asociada a la imgane arrastrada
  const palabra = e.dataTransfer.getData("text")?.trim();

  // obtenemos la palabra correcta guardad en el area de drop
  const respuesta = document.getElementById("dropZone").dataset.respuesta?.trim();

  // comparamos la palabra arrastrada con la respuesta correcta
  if (palabra === respuesta) {

    aciertos++;// aumentamos el contador de aciertos

    efectoAcierto(); // mostramos el efeto de acierto

  } else {
    efectoFallo(); // mostramos el efecto de error
  }

  rondaActual++; // avanzamos a la siguiente ronda


  setTimeout(() => {
    dropActivo = true; // reactivar el drop
    iniciarJuego(); // volvemos a iniciar e flujo del juego
  }, 1000); // esperar a que pasen los efectos visuales antes de seguir

}

// Configura los eventos drag & drop en la zona de destino
function configurarEventos() {

  // obtenemos la zona del drop
  const dropZone = document.getElementById("dropZone");

  // le damos el evento correspondiente para que un elemento pueda ser soltado en esta zona
  dropZone.ondragover = (e) => e.preventDefault();

  //  asociamos la funcion que manejara el evento cuando se suelta una imagen
  dropZone.ondrop = manejarDrop;
}



// ============================
// Efectos Visuales
// ============================

// pantalla verde para acierto
function efectoAcierto() {

  // llamamos el div correspondiente
  const overlay = document.getElementById('pantalla-overlay');

  // agregamos la clase que aplica el evento requerido
  overlay.classList.add('acierto');

  //quitamos esa clase despues de 1 segundo
  setTimeout(() => {
    overlay.classList.remove('acierto');
  }, 1000);
}

// pantalla roja para el fallo
function efectoFallo() {

  // llamamos el div correspondiente
  const overlay = document.getElementById('pantalla-overlay');

  // le agregamos la clase de fallo
  overlay.classList.add('fallo');

  // agregamos el efecto de vibracion al cuerpo del documento
  document.body.classList.add('shake-error');

  //qitamos las clases despues de 1 segundo
  setTimeout(() => {
    overlay.classList.remove('fallo');
    document.body.classList.remove('shake-error');
  }, 1000);
}


// render de confetis para cuando gane 
function launchConfetti() {
  // libreria externa de canvas
  confetti({
    particleCount: 350, //cantidad de particulas
    spread: 70, //angulo de dispercion
    origin: { y: 0.8 } // punto de origen
  });
}


// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Inicializacion 
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

window.addEventListener("DOMContentLoaded", () => {
  mostrarModalBienvenida();
});
