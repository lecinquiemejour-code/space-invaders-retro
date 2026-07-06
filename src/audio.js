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

let saucerOsc = null;
let saucerGain = null;
let lfoOsc = null;

export function startSaucerSound() {
    if (!audioCtx) return;
    if (saucerOsc) return; // Déjà en train de jouer

    saucerOsc = audioCtx.createOscillator();
    saucerGain = audioCtx.createGain();

    saucerOsc.type = 'triangle'; // Un son plus doux que le carré
    saucerOsc.frequency.setValueAtTime(300, audioCtx.currentTime);
    
    // On crée un LFO (Low Frequency Oscillator) pour moduler la fréquence et faire Wou-Wou
    lfoOsc = audioCtx.createOscillator();
    lfoOsc.type = 'sine';
    lfoOsc.frequency.setValueAtTime(4, audioCtx.currentTime); // 4 variations par seconde
    
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(100, audioCtx.currentTime); // L'amplitude de la variation (+- 100 Hz)
    
    lfoOsc.connect(lfoGain);
    lfoGain.connect(saucerOsc.frequency);
    lfoOsc.start();
    
    // Volume bas pour la soucoupe (c'est un son de fond)
    saucerGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

    saucerOsc.connect(saucerGain);
    saucerGain.connect(audioCtx.destination);
    
    saucerOsc.start();
}

export function stopSaucerSound() {
    if (saucerOsc) {
        saucerOsc.stop();
        saucerOsc.disconnect();
        saucerOsc = null;
    }
    if (lfoOsc) {
        lfoOsc.stop();
        lfoOsc.disconnect();
        lfoOsc = null;
    }
}
