const audio = document.getElementById('myAudio');
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const lyricsPanel = document.getElementById('lyricsPanel');
const knob = document.getElementById('knob');
const fill = document.getElementById('slider-fill');
const track = document.querySelector('.slider-wrapper');

// 1. Decoration
function initBackground() {
    const icons = ['☁️', '✨', '🎁', '🌸', '⭐', '🎈'];
    for (let i = 0; i < 15; i++) {
        const floaty = document.createElement('div');
        floaty.innerText = icons[Math.floor(Math.random() * icons.length)];
        floaty.style.position = 'absolute';
        floaty.style.left = Math.random() * 100 + 'vw';
        floaty.style.top = Math.random() * 100 + 'vh';
        floaty.style.opacity = '0.4';
        floaty.style.fontSize = '24px';
        floaty.style.zIndex = '1';
        floaty.animate([{ transform: 'translateY(0)' }, { transform: `translateY(-30px)` }, { transform: 'translateY(0)' }], { duration: 3000 + Math.random() * 2000, iterations: Infinity });
        document.body.appendChild(floaty);
    }
}
initBackground();

// 2. Music Player
let isSeeking = false;
playBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); playBtn.innerText = '⏸'; }
    else { audio.pause(); playBtn.innerText = '▶'; }
});
audio.addEventListener('timeupdate', () => {
    if (!isSeeking) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        if(audio.duration) durationEl.innerText = formatTime(audio.duration);
    }
});
const handleSeek = (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
    let percentage = (clientX - rect.left) / rect.width;
    percentage = Math.max(0, Math.min(percentage, 1));
    progressBar.style.width = `${percentage * 100}%`;
    if (audio.duration) audio.currentTime = percentage * audio.duration;
};
progressContainer.addEventListener('mousedown', (e) => { isSeeking = true; handleSeek(e); });
progressContainer.addEventListener('touchstart', (e) => { isSeeking = true; handleSeek(e); });
window.addEventListener('mousemove', (e) => { if (isSeeking) handleSeek(e); });
window.addEventListener('touchmove', (e) => { if (isSeeking) { e.preventDefault(); handleSeek(e); } }, {passive: false});
window.addEventListener('mouseup', () => isSeeking = false);
window.addEventListener('touchend', () => isSeeking = false);

function formatTime(t) {
    const m = Math.floor(t / 60); const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}
function toggleLyrics() {
    lyricsPanel.classList.toggle('open');
    document.getElementById('lyricsToggleBtn').innerText = lyricsPanel.classList.contains('open') ? 'Hide Lyrics' : 'Show Lyrics';
}

// 3. Unlock Logic
let isDraggingSlider = false;
const dragSlider = (e) => {
    if (!isDraggingSlider) return;
    const rect = track.getBoundingClientRect();
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
    let x = clientX - rect.left - 20;
    const maxX = rect.width - 50;
    x = Math.max(5, Math.min(x, maxX));
    knob.style.left = x + 'px';
    fill.style.width = (x + 20) + 'px';
    if (x >= maxX - 5) unlock();
};
knob.addEventListener('mousedown', () => isDraggingSlider = true);
knob.addEventListener('touchstart', () => isDraggingSlider = true);
window.addEventListener('mousemove', dragSlider);
window.addEventListener('touchmove', (e) => { if (isDraggingSlider) { e.preventDefault(); dragSlider(e); } }, {passive: false});
window.addEventListener('mouseup', () => { isDraggingSlider = false; knob.style.left = '5px'; fill.style.width = '0'; });
window.addEventListener('touchend', () => { isDraggingSlider = false; knob.style.left = '5px'; fill.style.width = '0'; });

function createHeart(isBurst) {
    const heart = document.createElement('div');
    heart.className = 'heart'; heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    const duration = isBurst ? (Math.random() * 1 + 1) : 3;
    heart.style.animationDuration = duration + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
}

function unlock() {
    isDraggingSlider = false;
    const stage1 = document.getElementById('stage1');
    if (stage1.classList.contains('hidden')) return;
    const flash = document.createElement('div');
    flash.className = 'transition-flash';
    document.body.appendChild(flash);
    flash.animate([{ opacity: 0 }, { opacity: 0.6 }, { opacity: 0 }], { duration: 400 });
    for(let i=0; i<15; i++) createHeart(true);
    stage1.style.opacity = '0';
    setInterval(() => createHeart(false), 500);
    setTimeout(() => { stage1.classList.add('hidden'); document.getElementById('stage2').classList.remove('hidden'); flash.remove(); }, 400);
}