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

/* ========================= */
/* EVENTOS MÓVILES */
/* ========================= */

function addTapEvent(element, callback){

    if(!element) return;

    element.addEventListener("click", callback);

    element.addEventListener("touchstart", (e) => {

        e.preventDefault();

        callback();

    }, { passive:false });
}

/* ========================= */
/* DISPLAY */
/* ========================= */

function updateDisplay(seconds){

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    timerDisplay.textContent =
        String(mins).padStart(2,"0")
        + ":"
        +
        String(secs).padStart(2,"0");

    if(seconds <= 10 && seconds > 0){

        timerDisplay.style.color = "red";

    }else{

        timerDisplay.style.color = "#111";
    }
}

/* ========================= */
/* FORMATO MARCAS */
/* ========================= */

function formatTime(seconds){

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return (
        String(mins).padStart(2,"0")
        + ":"
        +
        String(secs).padStart(2,"0")
    );
}

/* ========================= */
/* TEMPORIZADOR */
/* ========================= */

function runTimer(){

    if(isPaused) return;

    totalSeconds--;

    if(totalSeconds < 0){
        totalSeconds = 0;
    }

    updateDisplay(totalSeconds);

    if(totalSeconds <= 0){

        clearInterval(countdown);

        countdown = null;

        isRunning = false;
        isPaused = false;

        startBtn.textContent = "▶";

        timerDisplay.textContent = "00:00";

        alert("⏰ Tiempo finalizado");
    }
}

/* ========================= */
/* INICIAR / PAUSAR */
/* ========================= */

addTapEvent(startBtn, () => {

    if(!isRunning && totalSeconds === 0){

        const minutes =
            parseFloat(minutesInput.value);

        if(isNaN(minutes) || minutes <= 0){

            alert("Ingrese una cantidad válida de minutos.");
            return;
        }

        totalSeconds =
            Math.round(minutes * 60);

        updateDisplay(totalSeconds);

        isRunning = true;
        isPaused = false;

        startBtn.textContent = "⏸";

        countdown =
            setInterval(runTimer, 1000);

        return;
    }

    if(isRunning && !isPaused){

        isPaused = true;

        startBtn.textContent = "▶";

        return;
    }

    if(isRunning && isPaused){

        isPaused = false;

        startBtn.textContent = "⏸";
    }
});

/* ========================= */
/* MARCAS */
/* ========================= */

addTapEvent(lapBtn, () => {

    if(!isRunning) return;

    lapCounter++;

    const li =
        document.createElement("li");

    li.textContent =
        "#" +
        lapCounter +
        " - Tiempo restante: " +
        formatTime(totalSeconds);

    lapsList.prepend(li);
});

/* ========================= */
/* RESET */
/* ========================= */

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

/* ========================= */
/* FULLSCREEN */
/* ========================= */

addTapEvent(fullscreenBtn, async () => {

    try{

        if(!document.fullscreenElement){

            await document.documentElement.requestFullscreen();

        }else{

            await document.exitFullscreen();
        }

    }catch(error){

        console.log("Fullscreen no soportado");
    }
});

/* ========================= */
/* MENÚ MÓVIL */
/* ========================= */

addTapEvent(menuBtn, () => {

    controls.classList.toggle("show");

    if(controls.classList.contains("show")){

        menuBtn.textContent = "✕";

    }else{

        menuBtn.textContent = "☰";
    }
});

/* ========================= */
/* MODO PRESENTACIÓN */
/* ========================= */

function hidePresentationControls(){

    controls.classList.remove("show");

    menuBtn.style.display = "none";
}

function showPresentationControls(){

    controls.classList.add("show");

    clearTimeout(presentationTimeout);

    presentationTimeout = setTimeout(() => {

        if(presentationMode){

            controls.classList.remove("show");
        }

    }, 3000);
}

addTapEvent(presentationBtn, () => {

    presentationMode = !presentationMode;

    document.body.classList.toggle(
        "presentation-mode"
    );

    if(presentationMode){

        presentationBtn.textContent = "❌";

        hidePresentationControls();

    }else{

        presentationBtn.textContent = "🖥";

        menuBtn.style.display = "";
    }
});

/* ========================= */
/* TOQUE EN PANTALLA */
/* ========================= */

document.addEventListener("click", (e) => {

    if(!presentationMode) return;

    if(
        e.target.closest(".controls") ||
        e.target.closest("#fullscreenBtn")
    ){
        return;
    }

    showPresentationControls();
});

/* ========================= */
/* ESTADO INICIAL */
/* ========================= */

updateDisplay(0);