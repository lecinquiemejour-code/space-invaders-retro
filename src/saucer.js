import { startSaucerSound, stopSaucerSound } from "./audio.js";

export function createSaucer() {
    return {
        active: false,
        x: 0,
        y: 40, // Tout en haut de l'écran
        width: 48,
        height: 20,
        speed: 2,
        timer: 0, // Compteur pour l'apparition aléatoire
        direction: 1 // 1: vers la droite, -1: vers la gauche
    };
}

export function updateSaucer(saucer, canvasWidth) {
    if (!saucer.active) {
        saucer.timer++;
        // Apparition aléatoire : Il faut attendre au moins ~10s (600 frames)
        if (saucer.timer > 600 && Math.random() < 0.002) {
            saucer.active = true;
            // Choix aléatoire du côté de départ
            saucer.direction = Math.random() > 0.5 ? 1 : -1;
            saucer.x = saucer.direction === 1 ? -saucer.width : canvasWidth;
            startSaucerSound();
        }
    } else {
        // La soucoupe vole
        saucer.x += saucer.speed * saucer.direction;
        
        // Si elle sort complètement de l'écran
        if ((saucer.direction === 1 && saucer.x > canvasWidth) || 
            (saucer.direction === -1 && saucer.x < -saucer.width)) {
            saucer.active = false;
            saucer.timer = 0; // Réinitialise le timer pour la prochaine
            stopSaucerSound();
        }
    }
}

export function drawSaucer(ctx, saucer) {
    if (!saucer.active) return;
    
    const x = saucer.x;
    const y = saucer.y;
    
    ctx.fillStyle = "#ff0000"; // Rouge
    // Forme iconique de la soucoupe avec des rectangles
    ctx.fillRect(x + 16, y, 16, 4);
    ctx.fillRect(x + 8, y + 4, 32, 4);
    ctx.fillRect(x + 4, y + 8, 40, 4);
    ctx.fillRect(x, y + 12, 48, 4);
    
    // Les deux lumières blanches en bas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 8, y + 16, 8, 4);
    ctx.fillRect(x + 32, y + 16, 8, 4);
}
