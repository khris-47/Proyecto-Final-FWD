
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal as BootstrapModal } from 'bootstrap';

import musicaURL from '../assets/audio/musica.mp3';
import victoryURL from '../assets/audio/victoria.mp3';

const totalCards = 12;

let cards = [];
let valuesUsed = [];
let currentMove = 0;
let selectedCards = [];
let success = 0;
let tries = 0;

const musica = new Audio(musicaURL);
const victorySound = new Audio(victoryURL);

const cardTemplate = `
    <div class="card">
        <div class="back"></div>
        <div class="face"></div>
    </div>`;

function messageVictory() {
    return `
        <p>🤯 Has completado el juego en ${tries} intentos 🤯, ¡increíble!</p>
        <p> Puedes volver a intentarlo y tratar de mejorar tu récord. 😏 </p>
        <p> O puedes jugar la version dificil y demostrar de que estas hecho 💪😎</p>
        <p> <b>Muchas gracias por jugar, esperamos que te hayas divertido 🥰</b></p>`;
}

const modalBienvenida = `
    <div class="modal fade" id="ModalBienvenida" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 w-100"> ¡Bienvenido al Juego de Memoria Version Facil! 😇</h1>
                </div>
                <div class="modal-body">
                    <p> Esto esta dedicado para que aprendas cuales tipos de embarcacion hay en el golfo de nicoya, mientras te diviertes con nosotros </p>
                    <p> En esta version, puedes fallar las veces que quieras</p>
                    <p> Haz clic en "Comenzar" para iniciar el juego y la música 🎵</p>
                </div>
                <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Comenzar</button>
                </div>
            </div>
        </div>
    </div>
    `;

function launchConfetti() {
    confetti({
        particleCount: 350,
        spread: 70,
        origin: { y: 0.8 }
    });
}

function activate(evento) {
    if (currentMove < 2 && evento.currentTarget.classList.contains("card")) {
        evento.currentTarget.classList.add("active");

        if (!selectedCards[0] || selectedCards[0] !== evento.currentTarget) {
            selectedCards.push(evento.currentTarget);

            if (++currentMove === 2) {
                tries++;

                const img1 = selectedCards[0].querySelector(".face").innerHTML;
                const img2 = selectedCards[1].querySelector(".face").innerHTML;

                if (img1 === img2) {
                    selectedCards = [];
                    currentMove = 0;
                    success++;

                    if (success === totalCards / 2) {
                        document.getElementById('ModalBody').innerHTML = messageVictory();
                        launchConfetti();

                        setTimeout(() => {
                            const canvas = document.querySelector("canvas");
                            if (canvas) {
                                canvas.classList.add("confetti-canvas");
                            }
                        }, 50);

                        musica.pause();
                        musica.currentTime = 0;

                        victorySound.play();

                        const modal = new BootstrapModal(document.getElementById('ModalFelicitaciones'));
                        modal.show();
                    }
                } else {
                    setTimeout(() => {
                        selectedCards[0].classList.remove("active");
                        selectedCards[1].classList.remove("active");
                        selectedCards = [];
                        currentMove = 0;
                    }, 600);
                }
            }
        }
    }
}

function randomValue() {
    let rnd = Math.floor(Math.random() * totalCards * 0.5);
    let values = valuesUsed.filter(value => value === rnd);
    if (values.length < 2) {
        valuesUsed.push(rnd);
    } else {
        randomValue();
    }
}

function inicializarJuego() {
    const container = document.querySelector("#cards-container");
    container.innerHTML = "";

    cards = [];
    valuesUsed = [];
    currentMove = 0;
    selectedCards = [];
    success = 0;
    tries = 0;

    for (let i = 0; i < totalCards; i++) {
        let div = document.createElement("div");
        div.innerHTML = cardTemplate;
        const card = div.firstElementChild;

        cards.push(card);
        container.appendChild(card);
        randomValue();

        card.querySelector(".face").innerHTML = `<img src="/img/juegos/primerJuego/img${valuesUsed[i] + 1}.png" alt="img${valuesUsed[i] + 1}" />`;
        card.addEventListener("click", activate);
    }
}

export function mostrarModalBienvenida() {
    document.body.insertAdjacentHTML("beforeend", modalBienvenida);

    const bienvenidaModal = new BootstrapModal(document.getElementById('ModalBienvenida'));
    bienvenidaModal.show();

    const modalElement = document.getElementById('ModalBienvenida');
    modalElement.addEventListener('hidden.bs.modal', () => {
        musica.loop = true;
        musica.volume = 0.15;
        musica.play();
        inicializarJuego();
    });
}

if (typeof window !== 'undefined') {
    window.mostrarModalBienvenida = mostrarModalBienvenida;
}

export default function JuegoMemoria() {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            window.addEventListener("DOMContentLoaded", mostrarModalBienvenida);
            initialized.current = true;
        }
    }, []);

    return (
        <div id="cards-container" className="d-flex flex-wrap justify-content-center"></div>
    );
}
