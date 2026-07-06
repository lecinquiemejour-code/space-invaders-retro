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
        aliens: [],
        explosions: [], // Pour stocker les petites explosions temporaires
        projectiles: [] // Tirs ennemis
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

    // Mise à jour des explosions (elles durent quelques frames puis disparaissent)
    for (let i = swarm.explosions.length - 1; i >= 0; i--) {
        swarm.explosions[i].timer--;
        if (swarm.explosions[i].timer <= 0) {
            swarm.explosions.splice(i, 1);
        }
    }

    // Mise à jour des tirs ennemis
    for (let i = swarm.projectiles.length - 1; i >= 0; i--) {
        swarm.projectiles[i].y += 7; // Vitesse de descente du tir ennemi
        if (swarm.projectiles[i].y > canvas.height) {
            swarm.projectiles.splice(i, 1);
        }
    }

    // Décision de tir ennemi (aléatoire mais seulement par la première ligne)
    if (Math.random() < 0.02) { // environ 2% de chance par rafraîchissement
        // 1. Trouver les aliens en "première ligne" (le plus bas dans chaque colonne)
        const frontLineMap = {};
        for (const alien of swarm.aliens) {
            if (alien.active) {
                // On regroupe par coordonnée X (colonne) et on garde celui qui a le Y (bas) le plus grand
                if (!frontLineMap[alien.relativeX] || alien.relativeY > frontLineMap[alien.relativeX].relativeY) {
                    frontLineMap[alien.relativeX] = alien;
                }
            }
        }
        
        const frontLineAliens = Object.values(frontLineMap);
        
        // 2. Si on a trouvé des candidats, on en tire un au sort
        if (frontLineAliens.length > 0) {
            const shooter = frontLineAliens[Math.floor(Math.random() * frontLineAliens.length)];
            
            // 3. Création du projectile sous l'alien tireur
            swarm.projectiles.push({
                x: swarm.x + shooter.relativeX + shooter.width / 2 - 2,
                y: swarm.y + shooter.relativeY + shooter.height,
                width: 4,
                height: 15
            });
        }
    }
}

export function checkCollisions(swarm, projectile) {
    if (!projectile) return false;

    for (const alien of swarm.aliens) {
        if (!alien.active) continue;

        const alienX = swarm.x + alien.relativeX;
        const alienY = swarm.y + alien.relativeY;

        // Vérification de collision AABB (boîte englobante)
        if (projectile.x < alienX + alien.width &&
            projectile.x + projectile.width > alienX &&
            projectile.y < alienY + alien.height &&
            projectile.y + projectile.height > alienY) {
            
            // L'alien est touché !
            alien.active = false;
            
            // La grille accélère légèrement (intervalle plus court, minimum 5)
            swarm.moveInterval = Math.max(5, swarm.moveInterval - 1);
            
            // On ajoute une explosion à cet endroit
            swarm.explosions.push({
                x: alienX,
                y: alienY,
                timer: 15 // Durée d'affichage de l'explosion
            });

            return true; // Le projectile a touché quelque chose
        }
    }
    return false; // Aucun alien touché
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

    // Dessin des explosions en blanc
    ctx.fillStyle = "#ffffff";
    for (const exp of swarm.explosions) {
        // Une petite croix pour symboliser l'explosion de pixels
        ctx.fillRect(exp.x + 12, exp.y, 6, 20);
        ctx.fillRect(exp.x, exp.y + 7, 30, 6);
    }

    // Dessin des tirs ennemis (en rouge)
    ctx.fillStyle = "#ff0000";
    for (const p of swarm.projectiles) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
}
