
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
let presentationTimeout = null;


/* EVENTOS MÓVILES */


function addTapEvent(element, callback) {
    if (!element) return;

    element.addEventListener("click", (event) => {
        callback(event);
    });

    element.addEventListener("touchstart", (event) => {
        event.preventDefault();
        callback(event);
    }, { passive: false });
}


/* DISPLAY */


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


/* FORMATO MARCAS */


function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return (
        String(mins).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );
}


/* TEMPORIZADOR */


function runTimer() {
    if (isPaused) return;

    totalSeconds--;

    if (totalSeconds < 0) {
        totalSeconds = 0;
    }

    updateDisplay(totalSeconds);

    if (totalSeconds <= 0) {
        clearInterval(countdown);

        countdown = null;

        isRunning = false;
        isPaused = false;

        startBtn.textContent = "▶";
        timerDisplay.textContent = "00:00";

        alert("⏰ Tiempo finalizado");
    }
}


/* INICIAR / PAUSAR */


addTapEvent(startBtn, () => {
    if (!isRunning && totalSeconds === 0) {
        const minutes = parseFloat(minutesInput.value);

        if (isNaN(minutes) || minutes <= 0) {
            alert("Ingrese una cantidad válida de minutos.");
            return;
        }

        totalSeconds = Math.round(minutes * 60);

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


/* MARCAS */


addTapEvent(lapBtn, () => {
    if (!isRunning) return;

    lapCounter++;

    const li = document.createElement("li");

    li.textContent =
        "#" +
        lapCounter +
        " - Tiempo restante: " +
        formatTime(totalSeconds);

    lapsList.prepend(li);
});


/* RESET */


addTapEvent(resetBtn, () => {
    clearInterval(countdown);

    countdown = null;

    totalSeconds = 0;

    isPaused = false;
    isRunning = false;

    lapCounter = 0;

    startBtn.textContent = "▶";

    minutesInput.value = "";

    timerDisplay.textContent = "00:00";
    timerDisplay.style.color = "#111";

    lapsList.innerHTML = "";
});


/* FULLSCREEN */


addTapEvent(fullscreenBtn, async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.log("Fullscreen no soportado");
    }
});


/* MENÚ DESPLEGABLE */


addTapEvent(menuBtn, (event) => {
    // Evita que el clic llegue al documento y reabra el menú.
    if (event) {
        event.stopPropagation();
    }

    const isOpen = controls.classList.toggle("show");

    menuBtn.textContent = isOpen ? "✕" : "☰";

    if (isOpen && presentationMode) {
        clearTimeout(presentationTimeout);
    }
});


/* MODO PRESENTACIÓN */


function hidePresentationControls() {
    clearTimeout(presentationTimeout);

    controls.classList.remove("show");
    menuBtn.textContent = "☰";

    // No ocultar el botón: debe poder abrirse nuevamente.
    menuBtn.style.display = "flex";
}

function showPresentationControls() {
    controls.classList.add("show");
    menuBtn.textContent = "✕";

    clearTimeout(presentationTimeout);

    presentationTimeout = setTimeout(() => {
        if (presentationMode) {
            controls.classList.remove("show");
            menuBtn.textContent = "☰";
        }
    }, 3000);
}

addTapEvent(presentationBtn, (event) => {
    if (event) {
        event.stopPropagation();
    }

    presentationMode = !presentationMode;

    document.body.classList.toggle(
        "presentation-mode",
        presentationMode
    );

    clearTimeout(presentationTimeout);

    if (presentationMode) {
        presentationBtn.textContent = "❌";

        // Mantener el botón del menú disponible en escritorio.
        menuBtn.style.display = "flex";

        hidePresentationControls();
    } else {
        presentationBtn.textContent = "🖥";

        controls.classList.remove("show");
        menuBtn.textContent = "☰";

        // Restaurar el estilo normal definido por CSS.
        menuBtn.style.display = "";
    }
});


/* CLICS EN MODO PRESENTACIÓN */

document.addEventListener("click", (event) => {
    if (!presentationMode) return;

    // No interferir con el botón que abre o cierra el menú.
    if (event.target.closest("#menuBtn")) {
        return;
    }

    // Permitir usar los controles sin cerrar ni reabrir el menú.
    if (event.target.closest(".controls")) {
        return;
    }

    if (event.target.closest("#fullscreenBtn")) {
        return;
    }

    // Un clic fuera de los controles los muestra temporalmente.
    showPresentationControls();
});


/* ESTADO INICIAL */


updateDisplay(0);
