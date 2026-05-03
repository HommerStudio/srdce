// =========================================================
// 1. MULTI-LANGUAGE SYSTEM (English / Czech)
// =========================================================
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'en';

langToggle.addEventListener('click', () => {
    // Switch the language state
    currentLang = currentLang === 'en' ? 'cs' : 'en';
    
    // Update the toggle button text
    langToggle.textContent = currentLang === 'en' ? 'CS' : 'EN';

    // Find all elements with translation data attributes and swap the text
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
});

// =========================================================
// 2. CUSTOM AUDIO UPLOAD & WEB AUDIO API
// =========================================================
const audioUpload = document.getElementById('audio-upload');
const audioEl = document.getElementById('bg-audio');
const playBtn = document.getElementById('play-btn');

let audioContext, analyser, dataArray;

audioUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Create a local URL for the uploaded file so it plays instantly
        const objectUrl = URL.createObjectURL(file);
        audioEl.src = objectUrl;
        
        // Show the play button once audio is loaded
        playBtn.classList.remove('hidden');
    }
});

playBtn.addEventListener('click', () => {
    // Initialize the Web Audio API on the first click (browser security requirement)
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        
        const source = audioContext.createMediaElementSource(audioEl);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        analyser.fftSize = 256; // Defines how detailed the audio data is
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }

    // Toggle Play/Pause
    if (audioEl.paused) {
        audioContext.resume();
        audioEl.play();
        playBtn.textContent = '⏸'; // Pause icon
    } else {
        audioEl.pause();
        playBtn.textContent = '▶'; // Play icon
    }
});

// =========================================================
// 3. AUDIO-REACTIVE BACKGROUND (Squid Ink & Glowing Embers)
// =========================================================
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
canvasContainer.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Make the canvas fill the screen and resize dynamically
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Create floating "embers"
const embers = [];
for (let i = 0; i < 60; i++) {
    embers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 10, // Large blobs for a liquid wax feel
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        color: Math.random() > 0.5 ? '#d97736' : '#b5944f' // Ember orange and antique brass
    });
}

// The main animation loop
function animate() {
    requestAnimationFrame(animate);

    // Get the audio frequency data if music is playing
    let audioIntensity = 0;
    if (analyser && !audioEl.paused) {
        analyser.getByteFrequencyData(dataArray);
        // Calculate the average volume/intensity
        audioIntensity = dataArray.reduce((a, b) => a + b) / dataArray.length;
    }

    // Draw the "Squid Ink" background. We use a slight transparency (0.1) 
    // to create a fading trail effect, making the movement look like liquid.
    ctx.fillStyle = `rgba(11, 12, 16, ${0.15})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw and animate each ember
    embers.forEach((ember, i) => {
        // Move embers. They speed up when the music gets louder!
        const speedBoost = 1 + (audioIntensity / 50);
        ember.x += ember.vx * speedBoost;
        ember.y += ember.vy * speedBoost;

        // Bounce off screen edges
        if (ember.x < 0 || ember.x > canvas.width) ember.vx *= -1;
        if (ember.y < 0 || ember.y > canvas.height) ember.vy *= -1;

        // Make the radius pulse to the beat of the music
        let currentRadius = ember.radius;
        if (analyser && !audioEl.paused) {
            // Use specific frequency bands for different embers
            const freqValue = dataArray[i % dataArray.length];
            currentRadius += freqValue / 4; 
        }

        // Render the glowing ember
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, currentRadius, 0, Math.PI * 2);
        
        // Use a radial gradient so it looks like a soft, glowing light, not a hard circle
        const gradient = ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, currentRadius);
        gradient.addColorStop(0, ember.color);
        gradient.addColorStop(1, 'rgba(11, 12, 16, 0)'); // Fades into the squid ink
        
        ctx.fillStyle = gradient;
        ctx.fill();
    });
}

// Start the animation
animate();
