// ==========================================
// CONFIGURATION INITIALE DU JEU
// ==========================================

console.log("Jeu : Démarrage de l'initialisation...");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// États possibles du jeu : 'START_SCREEN', 'PLAYING', 'GAME_OVER', 'VICTORY'
let gameState = "START_SCREEN";
console.log("Jeu : État initial configuré sur -> " + gameState);

// ==========================================
// COMPORTEMENT & LOGIQUE (UPDATE)
// ==========================================

function update() {
    // Pour la feature F1, il n'y a pas encore de déplacement ou d'action de jeu.
    // Cette fonction servira à recalculer les positions à chaque image.
}

// ==========================================
// AFFICHAGE & RENDU (RENDER)
// ==========================================

function render() {
    // 1. On efface l'écran en dessinant un rectangle noir sur tout le canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Rendu de l'écran de démarrage
    if (gameState === "START_SCREEN") {
        drawStartScreen();
    }
}

// Dessin de l'écran d'accueil rétro
function drawStartScreen() {
    ctx.textAlign = "center";

    // Titre principal en vert fluo
    ctx.fillStyle = "#00ff00";
    ctx.font = '36px "Press Start 2P"';
    ctx.fillText("SPACE INVADERS", canvas.width / 2, 220);

    // Sous-titre blanc clignotant
    // L'expression Math.floor(Date.now() / 500) % 2 === 0 change d'état (vrai/faux)
    // toutes les 500 millisecondes (une demi-seconde) pour faire clignoter le texte.
    if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = "#ffffff";
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText("PRESS ENTER TO START", canvas.width / 2, 340);
    }

    // Crédits discrets en gris
    ctx.fillStyle = "#555555";
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText("VIBECODING L5J - PROJET DEBUTANT", canvas.width / 2, 520);
}

// ==========================================
// BOUCLE DE JEU PRINCIPALE (GAME LOOP)
// ==========================================

function gameLoop() {
    update();
    render();
    
    // Demande au navigateur d'appeler gameLoop avant le prochain rafraîchissement d'écran
    // Cela permet de caler l'animation de manière ultra-fluide à 60 images par seconde (60 FPS).
    requestAnimationFrame(gameLoop);
}

// Lancement de la boucle de jeu
console.log("Jeu : Lancement de la Game Loop.");
requestAnimationFrame(gameLoop);
