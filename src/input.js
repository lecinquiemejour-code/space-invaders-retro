const TRACKED_KEYS = new Set([
    "ArrowLeft",
    "ArrowRight",
    "KeyQ",
    "KeyD",
    "Space",
    "Enter",
]);

// Un Set ne conserve chaque touche qu'une seule fois, même si le clavier
// répète les événements pendant que l'utilisateur la maintient enfoncée.
const pressedKeys = new Set();

function handleKeyDown(event) {
    if (!TRACKED_KEYS.has(event.code)) {
        return;
    }

    // Empêche les flèches et Espace de faire défiler la page pendant le jeu.
    event.preventDefault();

    if (!pressedKeys.has(event.code)) {
        pressedKeys.add(event.code);
        console.log(`Entrée clavier : ${event.code} appuyée`);
    }
}

function handleKeyUp(event) {
    if (!TRACKED_KEYS.has(event.code)) {
        return;
    }

    event.preventDefault();
    pressedKeys.delete(event.code);
    console.log(`Entrée clavier : ${event.code} relâchée`);
}

export function initializeInput() {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    console.log("Entrées clavier : écoute activée");
}

export function isKeyPressed(code) {
    return pressedKeys.has(code);
}
