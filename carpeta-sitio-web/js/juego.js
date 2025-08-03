/**
 * 🎮 Juego de Memoria — Patri Boníssima
 * 
 * Este juego interactivo invita a reconstruir visualmente el universo de Patri Boníssima
 * encontrando pares de imágenes iguales. Está desarrollado con JavaScript y Bootstrap.
 *
 * 🔸 ¿Cómo funciona?
 * - El jugador da clic en dos cartas para intentar encontrar un par.
 * - Si las imágenes coinciden, las cartas quedan descubiertas y se reproduce un sonido.
 * - Si no coinciden, se vuelven a tapar y se descuenta puntaje.
 * - El objetivo es encontrar todos los pares en el menor tiempo posible.
 *
 * ✨ Elementos destacados:
 * - Puntaje inicial de 100, que disminuye con errores.
 * - Temporizador que cuenta los segundos desde el inicio del juego.
 * - Botón “Jugar de nuevo” que reinicia la partida.
 * - Sonido al hacer match.
 * 
 * 📦 Diseño:
 * - Usa clases de Bootstrap para grilla responsiva.
 * - Estilo visual integrado con el resto del sitio (colores, tipografías).
 *
 * Autoría original: Patricia Boníssima
 */

// 🎴 Datos de las cartas (pares duplicados con id e imagen)
const cardsData = [
  { id: 1, content: 'img/ani.png' },
  { id: 1, content: 'img/ani.png' },
  { id: 2, content: 'img/fest.png' },
  { id: 2, content: 'img/fest.png' },
  { id: 3, content: 'img/nosso.png' },
  { id: 3, content: 'img/nosso.png' },
  { id: 4, content: 'img/seja.png' },
  { id: 4, content: 'img/seja.png' }
];

// 🧠 Variables de control del juego
let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;

// 🕒 TEMPORIZADOR
let startTime = null;
let timerInterval = null;

// 🔊 SONIDO de acierto
const matchSound = new Audio('sonido/campa.wav');

// ⭐ PUNTAJE inicial
let score = 100;

/* ------------------ FUNCIONES ------------------ */

// Inicia el temporizador (actualiza cada segundo)
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `⏱ Tiempo: ${elapsed}s`;
  }, 1000);
}

// Detiene el temporizador
function stopTimer() {
  clearInterval(timerInterval);
}

// Baraja aleatoriamente las cartas
function shuffle(array) {
  return [...array].sort(() => 0.5 - Math.random());
}

// Crea dinámicamente una carta (estructura visual)
function createCard(data) {
  const col = document.createElement('div');
  col.className = 'col-6 col-md-4 col-lg-3 card-flip';
  col.dataset.id = data.id;
  col.addEventListener('click', () => handleClick(col));

  col.innerHTML = `
    <div class="card-inner border rounded shadow">
      <div class="card-front"></div>
      <div class="card-back">
        <img src="${data.content}" alt="imagen">
      </div>
    </div>
  `;
  return col;
}

// Maneja la lógica al hacer clic en una carta
function handleClick(card) {
  if (lockBoard || card.classList.contains('flipped')) return;

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  if (firstCard.dataset.id === card.dataset.id) {
    matchedPairs++;
    matchSound.play();
    document.getElementById('message').textContent = '¡Bien! Par correcto 🎉';
    firstCard = null;

    // Si se completan todos los pares
    if (matchedPairs === cardsData.length / 2) {
      const finalTime = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById('message').textContent = `🎊 ¡Ganaste en ${finalTime} segundos!`;
      document.getElementById('restartBtn').classList.remove('d-none');
      stopTimer();
    }
  } else {
    // ❌ Par incorrecto: se resta puntaje y se voltean de nuevo
    score = Math.max(0, score - 5);
    updateScore();

    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      card.classList.remove('flipped');
      firstCard = null;
      lockBoard = false;
      document.getElementById('message').textContent = '';
    }, 1000);
  }
}

// Actualiza el puntaje visual en pantalla
function updateScore() {
  const scoreDiv = document.getElementById('score');
  if (scoreDiv) {
    scoreDiv.textContent = `⭐ Puntaje: ${score}`;
  }
}

// Inicia o reinicia el juego
function startGame() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  matchedPairs = 0;
  firstCard = null;
  lockBoard = false;
  score = 100;

  document.getElementById('message').textContent = '';
  document.getElementById('restartBtn').classList.add('d-none');
  stopTimer();
  document.getElementById('timer').textContent = '⏱ Tiempo: 0s';
  updateScore();
  startTimer();

  shuffle(cardsData).forEach(data => {
    board.appendChild(createCard(data));
  });
}

// 🚀 Ejecuta al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  const timer = document.getElementById('timer');

  // Crea el contenedor de puntaje si no existe
  if (timer && !document.getElementById('score')) {
    const scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    scoreDiv.className = 'fw-bold text-warning mt-1';
    scoreDiv.style.fontFamily = "'Lexend'";
    scoreDiv.style.textShadow = '1px 1px hotpink';
    scoreDiv.textContent = '⭐ Puntaje: 100';
    timer.parentNode.insertBefore(scoreDiv, timer.nextSibling);
  }

  // Configura botón de reinicio y arranca el juego
  document.getElementById('restartBtn').addEventListener('click', startGame);
  startGame();
});
