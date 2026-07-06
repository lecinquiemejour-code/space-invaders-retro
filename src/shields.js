export function createShields(canvasWidth, canvasHeight) {
    // On crée un "canevas invisible" en mémoire qui sert juste pour les boucliers
    // Ça permet de faire des trous ("gommer") sans effacer le reste du jeu !
    const shieldCanvas = document.createElement('canvas');
    shieldCanvas.width = canvasWidth;
    shieldCanvas.height = canvasHeight;
    const shieldCtx = shieldCanvas.getContext('2d', { willReadFrequently: true });

    shieldCtx.fillStyle = "#00ff00"; // Vert classique
    const shieldWidth = 60;
    const shieldHeight = 40;
    
    // On calcule l'espacement pour répartir 4 boucliers uniformément
    const spacing = (canvasWidth - (4 * shieldWidth)) / 5;
    const y = canvasHeight - 120; // Juste au-dessus de la position du vaisseau

    for (let i = 0; i < 4; i++) {
        const x = spacing + i * (shieldWidth + spacing);

        // 1. Dessin complet d'un bloc rectangulaire
        shieldCtx.fillRect(x, y, shieldWidth, shieldHeight);
        
        // 2. On gomme (destination-out) l'arche en bas au centre pour laisser passer le vaisseau
        shieldCtx.globalCompositeOperation = 'destination-out';
        shieldCtx.beginPath();
        shieldCtx.arc(x + shieldWidth / 2, y + shieldHeight, 15, 0, Math.PI, true);
        shieldCtx.fill();
        
        // 3. On gomme les coins en haut pour faire un effet biseauté
        shieldCtx.beginPath();
        shieldCtx.moveTo(x, y);
        shieldCtx.lineTo(x + 10, y);
        shieldCtx.lineTo(x, y + 10);
        shieldCtx.fill();

        shieldCtx.beginPath();
        shieldCtx.moveTo(x + shieldWidth, y);
        shieldCtx.lineTo(x + shieldWidth - 10, y);
        shieldCtx.lineTo(x + shieldWidth, y + 10);
        shieldCtx.fill();
        
        // On remet le pinceau en mode "dessin normal" pour le prochain bouclier
        shieldCtx.globalCompositeOperation = 'source-over';
    }

    return {
        canvas: shieldCanvas,
        ctx: shieldCtx
    };
}

export function drawShields(ctx, shields) {
    // On dessine l'ensemble du calque des boucliers sur l'écran principal
    ctx.drawImage(shields.canvas, 0, 0);
}

export function checkShieldCollision(shields, projectile) {
    if (!projectile || !shields.ctx) return false;

    // Éviter de lire des pixels en dehors du canevas
    if (projectile.y < 0 || projectile.y >= shields.canvas.height) return false;
    
    // On regarde "les pixels" du calque bouclier exactement là où se trouve le projectile
    const safeX = Math.max(0, Math.floor(projectile.x));
    const safeY = Math.max(0, Math.floor(projectile.y));
    const w = Math.max(1, Math.ceil(projectile.width));
    const h = Math.max(1, Math.ceil(projectile.height));

    const imgData = shields.ctx.getImageData(safeX, safeY, w, h);

    // On parcourt les pixels. imgData.data contient [Rouge, Vert, Bleu, Alpha] pour chaque pixel.
    for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] > 0) { // Si l'Alpha (opacité) est > 0, ça veut dire qu'il y a du vert !
            
            // On a touché le bouclier ! On gomme une zone circulaire pour simuler l'effritement
            shields.ctx.globalCompositeOperation = 'destination-out';
            shields.ctx.beginPath();
            
            // On centre le trou au milieu du projectile
            const cx = projectile.x + projectile.width / 2;
            const cy = projectile.y + projectile.height / 2;
            
            shields.ctx.arc(cx, cy, 8, 0, Math.PI * 2); // Un trou de 8 pixels de rayon
            shields.ctx.fill();
            shields.ctx.globalCompositeOperation = 'source-over'; // Retour à la normale
            
            return true; // Le projectile a percuté le bouclier
        }
    }
    return false;
}
