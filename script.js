// =========================================================
// 1. MULTI-LANGUAGE SYSTEM (With Smooth Cinematic Fades)
// =========================================================
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'en';

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'cs' : 'en';
    langToggle.textContent = currentLang === 'en' ? 'CS' : 'EN';

    const elements = document.querySelectorAll('[data-en]');
    
    elements.forEach(el => {
        // Smooth fade out
        el.style.transition = 'opacity 0.4s ease';
        el.style.opacity = 0;
        
        setTimeout(() => {
            // Swap text while invisible
            el.textContent = el.getAttribute(`data-${currentLang}`);
            // Smooth fade back in
            el.style.opacity = 1;
        }, 400);
    });
});

// =========================================================
// 2. PREMIUM AUDIO SYSTEM (Smoothed Web Audio API)
// =========================================================
const audioEl = document.getElementById('bg-audio');
const playBtn = document.getElementById('play-btn');

let audioContext, analyser, dataArray;
let smoothAudioValue = 0;

playBtn.addEventListener('click', () => {
    // Initialize Web Audio API on first interaction
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        
        const source = audioContext.createMediaElementSource(audioEl);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // High-end smoothing for cinematic audio reactions
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.85; 
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }

    if (audioEl.paused) {
        audioContext.resume();
        audioEl.play();
        playBtn.textContent = '⏸'; // Pause
    } else {
        audioEl.pause();
        playBtn.textContent = '▶'; // Play
    }
});

// =========================================================
// 3. TOP-LINE CANVAS RENDERING (Fluid Swirls & Mouse Physics)
// =========================================================
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
canvasContainer.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Mouse tracking for interactive physics
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Premium Ember Class with Orbital Mathematics
class SwirlingEmber {
    constructor() {
        // Random starting angles for organic distribution
        this.angle = Math.random() * Math.PI * 2;
        // Distance from the center of the swirl
        this.orbitRadius = Math.random() * (window.innerWidth * 0.4) + 50;
        this.baseRadius = Math.random() * 30 + 10;
        this.speed = (Math.random() * 0.002) + 0.0005;
        
        // Start near the center
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        
        // Colors: Antique Brass vs Glowing Ember
        this.colorRGB = Math.random() > 0.5 ? '181, 148, 79' : '217, 119, 54';
    }

    update(audioIntensity) {
        // The embers slowly follow the user's mouse for a fluid, living feel
        this.centerX += (mouse.x - this.centerX) * 0.015;
        this.centerY += (mouse.y - this.centerY) * 0.015;

        // Swirling math (Lissajous curves concept)
        this.angle += this.speed * (1 + (audioIntensity * 0.02));
        
        // Calculate position based on sine/cosine waves
        this.x = this.centerX + Math.cos(this.angle) * (this.orbitRadius + (audioIntensity * 0.5));
        this.y = this.centerY + Math.sin(this.angle) * (this.orbitRadius + (audioIntensity * 0.5));

        // Draw the ember with a premium radial gradient
        const currentRadius = this.baseRadius + (audioIntensity * 0.3);
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentRadius);
        
        gradient.addColorStop(0, `rgba(${this.colorRGB}, 0.8)`);
        gradient.addColorStop(0.4, `rgba(${this.colorRGB}, 0.3)`);
        gradient.addColorStop(1, 'rgba(11, 12, 16, 0)'); // Fades into squid ink background

        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// Generate the embers
const embers = [];
for (let i = 0; i < 70; i++) {
    embers.push(new SwirlingEmber());
}

// Main Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Fetch and smooth audio data
    let currentAudioVolume = 0;
    if (analyser && !audioEl.paused) {
        analyser.getByteFrequencyData(dataArray);
        currentAudioVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    }
    
    // Smooth the volume transition so it doesn't jitter
    smoothAudioValue += (currentAudioVolume - smoothAudioValue) * 0.1;

    // The "Squid Ink" effect: highly transparent dark layer creates liquid motion trails
    ctx.fillStyle = `rgba(11, 12, 16, 0.12)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw all embers
    embers.forEach(ember => ember.update(smoothAudioValue));
}

animate();
