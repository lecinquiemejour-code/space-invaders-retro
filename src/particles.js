export function createParticleSystem() {
    return {
        particles: []
    };
}

export function createExplosion(ps, x, y, color, count = 20) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1; // Vitesse d'éparpillement
        
        ps.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0, // Transparence (de 1.0 à 0.0)
            decay: Math.random() * 0.05 + 0.02, // Vitesse de disparition
            color: color,
            size: Math.random() * 3 + 1 // Taille du débris (1 à 4 px)
        });
    }
}

export function updateParticles(ps) {
    for (let i = ps.particles.length - 1; i >= 0; i--) {
        const p = ps.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        
        // Supprime la particule quand elle est totalement transparente
        if (p.life <= 0) {
            ps.particles.splice(i, 1);
        }
    }
}

export function drawParticles(ctx, ps) {
    for (const p of ps.particles) {
        ctx.globalAlpha = p.life; // Applique la transparence
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1.0; // Reset de la transparence pour le reste du jeu
}
