import { initializeInput, isKeyPressed } from "./input.js";
import { createPlayer, drawPlayer, updatePlayer } from "./player.js";
import { createSwarm, updateSwarm, drawSwarm, checkCollisions } from "./aliens.js";
import { initAudio, playExplosionSound } from "./audio.js";
import { createParticleSystem, updateParticles, drawParticles, createExplosion } from "./particles.js";

// ==========================================
// CONFIGURATION INITIALE DU JEU
// ==========================================

console.log("Jeu : Démarrage de l'initialisation...");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

initializeInput();
let player = createPlayer(canvas);
let swarm = createSwarm();
let particleSystem = createParticleSystem();

// États possibles du jeu : 'START_SCREEN', 'PLAYING', 'GAME_OVER', 'VICTORY'
let gameState = "START_SCREEN";
let score = 0;
let lives = 3; // Le joueur commence avec 3 vies
console.log("Jeu : État initial configuré sur -> " + gameState);

// ==========================================
// COMPORTEMENT & LOGIQUE (UPDATE)
// ==========================================

function resetGame() {
    score = 0;
    lives = 3;
    player = createPlayer(canvas);
    swarm = createSwarm();
    particleSystem = createParticleSystem();
    gameState = "PLAYING";
}

function update() {
    // Gestion des écrans hors-jeu (attente de la touche Entrée)
    if (gameState === "START_SCREEN" || gameState === "GAME_OVER" || gameState === "VICTORY") {
        if (isKeyPressed("Enter")) {
            initAudio(); // Initialise l'audio (les navigateurs exigent une action de l'utilisateur)
            resetGame();
        }
        return; // On fige l'action du jeu
    }

    // --- Logique du jeu en cours (PLAYING) ---
    updatePlayer(player, canvas, isKeyPressed);
    updateSwarm(swarm, canvas);
    updateParticles(particleSystem);

    // Vérification des collisions entre le tir du joueur et les aliens
    if (player.projectile) {
        const hit = checkCollisions(swarm, player.projectile, particleSystem, playExplosionSound, createExplosion);
        if (hit) {
            // Le tir disparaît s'il a touché
            player.projectile = null;
            score += 10; // On augmente le score
        }
    }

    // Vérification des collisions entre les tirs ennemis et le joueur
    for (let i = swarm.projectiles.length - 1; i >= 0; i--) {
        const p = swarm.projectiles[i];
        if (p.x < player.x + player.width &&
            p.x + p.width > player.x &&
            p.y < player.y + player.height &&
            p.y + p.height > player.y) {
            
            // Le joueur est touché !
            swarm.projectiles.splice(i, 1);
            lives--;
            
            // Explosion de particules et son !
            createExplosion(particleSystem, player.x + player.width / 2, player.y + player.height / 2, "#00ff00", 30);
            playExplosionSound();

            // Réinitialise la position du joueur au centre
            player.x = (canvas.width - player.width) / 2;
            console.log("Jeu : Le joueur a été touché ! Vies restantes : " + lives);
            
            break; // On sort de la boucle pour ne perdre qu'une seule vie à la fois
        }
    }

    // Vérification de défaite (0 vie)
    if (lives <= 0) {
        gameState = "GAME_OVER";
    }

    // Vérification de défaite (Les aliens touchent le joueur)
    for (const alien of swarm.aliens) {
        if (alien.active && swarm.y + alien.relativeY + alien.height >= player.y) {
            gameState = "GAME_OVER";
            break;
        }
    }

    // Vérification de victoire (Plus aucun alien actif)
    let allDead = true;
    for (const alien of swarm.aliens) {
        if (alien.active) {
            allDead = false;
            break;
        }
    }
    if (allDead) {
        gameState = "VICTORY";
    }
}

// ==========================================
// AFFICHAGE & RENDU (RENDER)
// ==========================================

function render() {
    // 1. On efface l'écran en dessinant un rectangle noir sur tout le canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Rendu de l'écran de démarrage seul
    if (gameState === "START_SCREEN") {
        drawStartScreen();
        return; // On ne dessine pas le jeu derrière
    }

    // 3. Rendu du jeu en cours (vaisseau, aliens, scores)
    drawPlayer(ctx, player);
    drawSwarm(ctx, swarm);
    drawParticles(ctx, particleSystem);

    // Affichage du score en haut à gauche
    ctx.fillStyle = "#ffffff";
    ctx.font = '16px "Press Start 2P"';
    ctx.textAlign = "left";
    ctx.fillText("SCORE: " + score, 10, 30);

    // Affichage des vies en haut à droite
    ctx.textAlign = "right";
    ctx.fillText("VIES: " + lives, canvas.width - 10, 30);

    // 4. Écrans superposés de fin de partie
    if (gameState === "GAME_OVER") {
        drawGameOverScreen();
    } else if (gameState === "VICTORY") {
        drawVictoryScreen();
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

// Dessin de l'écran Game Over
function drawGameOverScreen() {
    ctx.textAlign = "center";
    ctx.fillStyle = "#ff0000"; // Rouge
    ctx.font = '40px "Press Start 2P"';
    ctx.fillText("GAME OVER", canvas.width / 2, 250);

    if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = "#ffffff";
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText("PRESS ENTER TO RESTART", canvas.width / 2, 340);
    }
}

// Dessin de l'écran de Victoire
function drawVictoryScreen() {
    ctx.textAlign = "center";
    ctx.fillStyle = "#00ff00"; // Vert
    ctx.font = '40px "Press Start 2P"';
    ctx.fillText("VICTORY!", canvas.width / 2, 250);

    ctx.fillStyle = "#ffffff";
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText("FINAL SCORE: " + score, canvas.width / 2, 300);

    if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillText("PRESS ENTER TO PLAY AGAIN", canvas.width / 2, 360);
    }
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
