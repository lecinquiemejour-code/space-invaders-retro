import { initializeInput, isKeyPressed } from "./input.js";
import { createPlayer, drawPlayer, updatePlayer } from "./player.js";
import { createSwarm, updateSwarm, drawSwarm, checkCollisions } from "./aliens.js";
import { createShields, drawShields, checkShieldCollision } from "./shields.js";
import { initAudio, playExplosionSound, stopSaucerSound } from "./audio.js";
import { createParticleSystem, updateParticles, drawParticles, createExplosion } from "./particles.js";
import { createSaucer, updateSaucer, drawSaucer } from "./saucer.js";

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
let shields = createShields(canvas.width, canvas.height);
let saucer = createSaucer();

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
    shields = createShields(canvas.width, canvas.height); // On reconstruit les boucliers neufs
    saucer = createSaucer();
    gameState = "PLAYING";
}

function update() {
    // Gestion des écrans hors-jeu (attente de la touche Entrée)
    if (gameState === "START_SCREEN" || gameState === "GAME_OVER" || gameState === "VICTORY") {
        stopSaucerSound(); // On s'assure que la soucoupe est silencieuse
        if (isKeyPressed("Enter")) {
            initAudio(); // Initialise l'audio (les navigateurs exigent une action de l'utilisateur)
            resetGame();
        }
        return; // On fige l'action du jeu
    }

    // --- Logique du jeu en cours (PLAYING) ---
    // Si le joueur est vivant, il peut jouer. S'il est en train d'exploser, on bloque ses commandes le temps des particules.
    if (player.state === "ALIVE") {
        updatePlayer(player, canvas, isKeyPressed);
    } else {
        player.respawnTimer--;
        if (player.respawnTimer <= 0) {
            if (lives <= 0) {
                gameState = "GAME_OVER"; // L'écran Game Over s'affiche APRES l'animation d'explosion
            } else {
                player.state = "ALIVE";
                player.x = (canvas.width - player.width) / 2;
                player.projectile = null;
            }
        }
    }

    updateSwarm(swarm, canvas);
    updateParticles(particleSystem);
    updateSaucer(saucer, canvas.width);

    // Vérification des collisions entre le tir du joueur et les aliens
    if (player.projectile) {
        // 1. Est-ce que le tir touche un bouclier ?
        if (checkShieldCollision(shields, player.projectile)) {
            player.projectile = null; // Le tir est absorbé par le bouclier
        } 
        // 2. Sinon, est-ce que le tir touche un alien ?
        else {
            const hit = checkCollisions(swarm, player.projectile, particleSystem, playExplosionSound, createExplosion);
            if (hit) {
                // Le tir disparaît s'il a touché
                player.projectile = null;
                score += 10; // On augmente le score
            }
        }
    }

    // Vérification de la collision avec la soucoupe rouge
    if (player.projectile && saucer.active) {
        if (player.projectile.x < saucer.x + saucer.width &&
            player.projectile.x + player.projectile.width > saucer.x &&
            player.projectile.y < saucer.y + saucer.height &&
            player.projectile.y + player.projectile.height > saucer.y) {
            
            // Soucoupe détruite !
            player.projectile = null;
            saucer.active = false;
            saucer.timer = 0;
            createExplosion(particleSystem, saucer.x + saucer.width/2, saucer.y + saucer.height/2, "#ff0000", 40);
            playExplosionSound();
            stopSaucerSound();
            
            // Score bonus aléatoire
            const points = [50, 100, 150, 300];
            score += points[Math.floor(Math.random() * points.length)];
        }
    }

    // Vérification des collisions entre les tirs ennemis et le joueur (ou les boucliers)
    for (let i = swarm.projectiles.length - 1; i >= 0; i--) {
        const p = swarm.projectiles[i];
        
        // 1. Le tir tape-t-il un bouclier ?
        if (checkShieldCollision(shields, p)) {
            swarm.projectiles.splice(i, 1); // Le bouclier absorbe le tir
            continue; // On passe au tir suivant
        }

        // 2. Le tir tape-t-il le joueur ?
        if (player.state === "ALIVE" &&
            p.x < player.x + player.width &&
            p.x + p.width > player.x &&
            p.y < player.y + player.height &&
            p.y + p.height > player.y) {
            
            // Le joueur est touché !
            swarm.projectiles.splice(i, 1);
            lives--;
            
            // Effet spectaculaire de destruction du vaisseau
            createExplosion(particleSystem, player.x + player.width / 2, player.y + player.height / 2, "#00ff00", 60);
            playExplosionSound();

            // On change l'état au lieu de le téléporter direct (pour voir les particules !)
            player.state = "DEAD";
            player.respawnTimer = 60; // 1 seconde de pause avant de réapparaître ou Game Over
            
            break; // On sort de la boucle pour ne perdre qu'une seule vie à la fois
        }
    }

    // Vérification de défaite immédiate (Les aliens touchent le joueur)
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

    // 3. Rendu du jeu en cours
    drawPlayer(ctx, player);
    drawShields(ctx, shields);
    drawSaucer(ctx, saucer);
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
