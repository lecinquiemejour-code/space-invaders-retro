const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

export function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    // Reprend le contexte si le navigateur l'avait suspendu
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

export function playShootSound() {
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'square'; // Son très rétro (ondes carrées)
    
    // Fréquence qui descend vite (le fameux 'piou!')
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
    
    // Le volume baisse très vite
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

export function playExplosionSound() {
    if (!audioCtx) return;

    // Pour une explosion, on génère un "bruit blanc" (plein de fréquences au hasard)
    const bufferSize = audioCtx.sampleRate * 0.2; // 0.2 seconde
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Filtre pour rendre le bruit plus sourd (passe-bas)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noise.start();
}
