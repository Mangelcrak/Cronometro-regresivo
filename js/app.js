
const timerDisplay = document.getElementById("timer");
const minutesInput = document.getElementById("minutesInput");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const lapBtn = document.getElementById("lapBtn");
const presentationBtn = document.getElementById("presentationBtn");
const menuBtn = document.getElementById("menuBtn");

const controls = document.querySelector(".controls");
const lapsList = document.getElementById("lapsList");

let countdown = null;
let totalSeconds = 0;

let isPaused = false;
let isRunning = false;
let lapCounter = 0;

let presentationMode = false;
let menuOpen = false;

/* =========================
   EVENTOS DE RATÓN Y MÓVILES
========================= */

function addTapEvent(element, callback) {
    if (!element) return;

    let suppressClick = false;
    let suppressTimeout = null;

    element.addEventListener("touchstart", (event) => {
        event.preventDefault();

        suppressClick = true;
        clearTimeout(suppressTimeout);

        callback();

        suppressTimeout = setTimeout(() => {
            suppressClick = false;
        }, 500);
    }, { passive: false });

    element.addEventListener("click", () => {
        if (suppressClick) {
            suppressClick = false;
            clearTimeout(suppressTimeout);
            return;
        }

        callback();
    });
}

/* =========================
   DISPLAY DEL TEMPORIZADOR
========================= */

function updateDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    timerDisplay.textContent =
        String(mins).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0");

    if (seconds <= 10 && seconds > 0) {
        timerDisplay.style.color = "red";
    } else {
        timerDisplay.style.color = "#111";
    }
}

/* =========================
   FORMATO DE MARCAS
========================= */

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return (
        String(mins).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );
}

/* =========================
   TEMPORIZADOR
========================= */

function runTimer() {
    if (isPaused || !isRunning) return;

    totalSeconds = Math.max(0, totalSeconds - 1);

    updateDisplay(totalSeconds);

    if (totalSeconds <= 0) {
        clearInterval(countdown);

        countdown = null;
        isRunning = false;
        isPaused = false;

        startBtn.textContent = "▶";

        alert("⏰ Tiempo finalizado");
    }
}

/* =========================
   INICIAR Y PAUSAR
========================= */

addTapEvent(startBtn, () => {
    if (!isRunning && totalSeconds === 0) {
        const minutes = parseFloat(minutesInput.value);

        if (!Number.isFinite(minutes) || minutes <= 0) {
            alert("Ingrese una cantidad válida de minutos.");
            return;
        }

        totalSeconds = Math.round(minutes * 60);

        if (totalSeconds <= 0) {
            alert("El tiempo debe ser de al menos un segundo.");
            return;
        }

        updateDisplay(totalSeconds);

        isRunning = true;
        isPaused = false;

        startBtn.textContent = "⏸";
        countdown = setInterval(runTimer, 1000);

        return;
    }

    if (isRunning && !isPaused) {
        isPaused = true;
        startBtn.textContent = "▶";
        return;
    }

    if (isRunning && isPaused) {
        isPaused = false;
        startBtn.textContent = "⏸";
    }
});

/* =========================
   MARCAS DE TIEMPO
========================= */

addTapEvent(lapBtn, () => {
    if (!isRunning) return;

    lapCounter++;

    const li = document.createElement("li");

    li.textContent =
        "#" + lapCounter +
        " - Tiempo restante: " +
        formatTime(totalSeconds);

    lapsList.prepend(li);
});

/* =========================
   REINICIAR
========================= */

addTapEvent(resetBtn, () => {
    clearInterval(countdown);

    countdown = null;
    totalSeconds = 0;

    isPaused = false;
    isRunning = false;
    lapCounter = 0;

    startBtn.textContent = "▶";

    minutesInput.value = "";

    updateDisplay(0);

    lapsList.innerHTML = "";
});

/* =========================
   PANTALLA COMPLETA
========================= */

addTapEvent(fullscreenBtn, async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error("No fue posible activar la pantalla completa:", error);
    }
});

/* =========================
   MENÚ DESPLEGABLE
========================= */

function updateMenuButton() {
    if (presentationMode) {
        menuBtn.textContent = menuOpen
            ? "Cerrar opciones ✕"
            : "☰ Opciones";

        menuBtn.setAttribute("aria-expanded", String(menuOpen));
        menuBtn.setAttribute("aria-label",
            menuOpen ? "Cerrar opciones" : "Abrir opciones");

        return;
    }

    menuBtn.textContent = menuOpen ? "✕" : "☰";
    menuBtn.setAttribute("aria-expanded", String(menuOpen));
    menuBtn.setAttribute("aria-label",
        menuOpen ? "Cerrar menú" : "Abrir menú");
}

function setMenuOpen(open) {
    menuOpen = open;

    controls.classList.toggle("show", menuOpen);

    updateMenuButton();
}

addTapEvent(menuBtn, () => {
    setMenuOpen(!menuOpen);
});

/* =========================
   MODO PRESENTACIÓN
========================= */

addTapEvent(presentationBtn, () => {
    presentationMode = !presentationMode;

    document.body.classList.toggle(
        "presentation-mode",
        presentationMode
    );

    if (presentationMode) {
        presentationBtn.textContent = "❌";
        presentationBtn.title = "Salir del modo presentación";

        // El menú comienza plegado, pero permanece disponible.
        setMenuOpen(false);
    } else {
        presentationBtn.textContent = "🖥";
        presentationBtn.title = "Modo presentación";

        // Restaurar la vista normal y cerrar el menú.
        setMenuOpen(false);
    }
});

/* =========================
   ESTADO INICIAL
========================= */

setMenuOpen(false);
updateDisplay(0);
