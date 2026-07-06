const PLAYER_WIDTH = 52;
const PLAYER_HEIGHT = 28;
const PLAYER_SPEED = 5;
const BOTTOM_MARGIN = 28;

// Propriétés du projectile
const PROJECTILE_WIDTH = 4;
const PROJECTILE_HEIGHT = 15;
const PROJECTILE_SPEED = 10;

export function createPlayer(canvas) {
    return {
        x: (canvas.width - PLAYER_WIDTH) / 2,
        y: canvas.height - PLAYER_HEIGHT - BOTTOM_MARGIN,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        speed: PLAYER_SPEED,
        projectile: null,
    };
}

export function updatePlayer(player, canvas, isKeyPressed) {
    const movingLeft = isKeyPressed("ArrowLeft") || isKeyPressed("KeyQ");
    const movingRight = isKeyPressed("ArrowRight") || isKeyPressed("KeyD");

    // Si une seule des deux directions est pressée, on déplace le vaisseau
    if (movingLeft !== movingRight) {
        const direction = movingLeft ? -1 : 1;
        const nextX = player.x + direction * player.speed;

        // Le bornage garantit que le vaisseau reste entièrement dans le Canvas.
        player.x = Math.max(0, Math.min(nextX, canvas.width - player.width));
    }

    // Gestion du tir : Espace appuyé + aucun tir en cours
    if (isKeyPressed("Space") && player.projectile === null) {
        player.projectile = {
            x: player.x + player.width / 2 - PROJECTILE_WIDTH / 2,
            y: player.y - PROJECTILE_HEIGHT,
            width: PROJECTILE_WIDTH,
            height: PROJECTILE_HEIGHT,
            speed: PROJECTILE_SPEED
        };
        console.log("Joueur : Tir d'un projectile !");
    }

    // Déplacement du projectile vers le haut s'il existe
    if (player.projectile !== null) {
        player.projectile.y -= player.projectile.speed;

        // On détruit le tir s'il sort complètement de l'écran par le haut
        if (player.projectile.y + player.projectile.height < 0) {
            player.projectile = null;
            console.log("Joueur : Le tir est sorti de l'écran.");
        }
    }
}

export function drawPlayer(ctx, player) {
    ctx.fillStyle = "#00ff00";

    // Silhouette composée de rectangles nets pour conserver le style pixel-art.
    ctx.fillRect(player.x + 22, player.y, 8, 6);
    ctx.fillRect(player.x + 16, player.y + 6, 20, 6);
    ctx.fillRect(player.x + 8, player.y + 12, 36, 6);
    ctx.fillRect(player.x, player.y + 18, player.width, 10);

    // Dessin du projectile (en blanc) s'il y en a un
    if (player.projectile !== null) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            player.projectile.x,
            player.projectile.y,
            player.projectile.width,
            player.projectile.height
        );
    }
}
