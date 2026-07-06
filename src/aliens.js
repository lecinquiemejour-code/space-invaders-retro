const ALIEN_ROWS = 5;
const ALIEN_COLS = 11;
const ALIEN_WIDTH = 30;
const ALIEN_HEIGHT = 20;
const ALIEN_PADDING = 15;

const SWARM_START_X = 50;
const SWARM_START_Y = 50;
const DESCENT_STEP = 20;

export function createSwarm() {
    const swarm = {
        x: SWARM_START_X,
        y: SWARM_START_Y,
        width: ALIEN_COLS * ALIEN_WIDTH + (ALIEN_COLS - 1) * ALIEN_PADDING,
        height: ALIEN_ROWS * ALIEN_HEIGHT + (ALIEN_ROWS - 1) * ALIEN_PADDING,
        direction: 1, // 1 pour aller à droite, -1 pour aller à gauche
        speed: 15, // Taille du saut en pixels
        moveTimer: 0, // Compteur pour le mouvement saccadé
        moveInterval: 40, // Nombre de rafraîchissements d'écran avant de bouger
        aliens: []
    };

    // Couleurs demandées par le PRD : magenta, cyan, jaune
    const colors = ["#ff00ff", "#ff00ff", "#00ffff", "#00ffff", "#ffff00"];

    for (let row = 0; row < ALIEN_ROWS; row++) {
        for (let col = 0; col < ALIEN_COLS; col++) {
            swarm.aliens.push({
                relativeX: col * (ALIEN_WIDTH + ALIEN_PADDING),
                relativeY: row * (ALIEN_HEIGHT + ALIEN_PADDING),
                width: ALIEN_WIDTH,
                height: ALIEN_HEIGHT,
                color: colors[row],
                active: true
            });
        }
    }

    return swarm;
}

export function updateSwarm(swarm, canvas) {
    swarm.moveTimer++;

    // Mouvement saccadé : on ne bouge que toutes les X frames
    if (swarm.moveTimer >= swarm.moveInterval) {
        swarm.moveTimer = 0; // Réinitialisation du chronomètre
        
        let hitWall = false;
        
        // Calcul du prochain pas
        const nextX = swarm.x + (swarm.speed * swarm.direction);

        // Vérification des bords de l'écran
        if (nextX <= 0 || nextX + swarm.width >= canvas.width) {
            hitWall = true;
        }

        if (hitWall) {
            // Changement de direction et descente
            swarm.direction *= -1;
            swarm.y += DESCENT_STEP;
            console.log("Essaim : Touche le mur, l'armée descend !");
        } else {
            // Avance horizontale normale
            swarm.x = nextX;
        }
    }
}

export function drawSwarm(ctx, swarm) {
    for (const alien of swarm.aliens) {
        if (alien.active) {
            ctx.fillStyle = alien.color;
            
            const x = swarm.x + alien.relativeX;
            const y = swarm.y + alien.relativeY;

            // Dessin d'un alien façon pixel art au lieu d'un simple carré
            // Haut du crâne
            ctx.fillRect(x + 8, y, 14, 4);
            // Tête
            ctx.fillRect(x + 4, y + 4, 22, 6);
            
            // On creuse les yeux (en noir)
            ctx.fillStyle = "#000000";
            ctx.fillRect(x + 8, y + 6, 4, 4);
            ctx.fillRect(x + 18, y + 6, 4, 4);
            
            // On remet la couleur de l'alien pour le bas du corps
            ctx.fillStyle = alien.color;
            ctx.fillRect(x, y + 10, 30, 6);
            
            // Les deux tentacules/pattes
            ctx.fillRect(x + 4, y + 16, 6, 4);
            ctx.fillRect(x + 20, y + 16, 6, 4);
        }
    }
}
