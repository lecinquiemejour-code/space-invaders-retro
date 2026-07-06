const PLAYER_WIDTH = 52;
const PLAYER_HEIGHT = 28;
const PLAYER_SPEED = 5;
const BOTTOM_MARGIN = 28;

export function createPlayer(canvas) {
    return {
        x: (canvas.width - PLAYER_WIDTH) / 2,
        y: canvas.height - PLAYER_HEIGHT - BOTTOM_MARGIN,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        speed: PLAYER_SPEED,
    };
}

export function updatePlayer(player, canvas, isKeyPressed) {
    const movingLeft = isKeyPressed("ArrowLeft") || isKeyPressed("KeyQ");
    const movingRight = isKeyPressed("ArrowRight") || isKeyPressed("KeyD");

    // Si les deux directions sont pressées, elles s'annulent pour éviter
    // qu'une touche ait arbitrairement priorité sur l'autre.
    if (movingLeft === movingRight) {
        return;
    }

    const direction = movingLeft ? -1 : 1;
    const nextX = player.x + direction * player.speed;

    // Le bornage garantit que le vaisseau reste entièrement dans le Canvas.
    player.x = Math.max(0, Math.min(nextX, canvas.width - player.width));
}

export function drawPlayer(ctx, player) {
    ctx.fillStyle = "#00ff00";

    // Silhouette composée de rectangles nets pour conserver le style pixel-art.
    ctx.fillRect(player.x + 22, player.y, 8, 6);
    ctx.fillRect(player.x + 16, player.y + 6, 20, 6);
    ctx.fillRect(player.x + 8, player.y + 12, 36, 6);
    ctx.fillRect(player.x, player.y + 18, player.width, 10);
}
