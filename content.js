// content.js

// 1. Inject the Spy Script (Always runs to catch codec at start)
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);

// 2. Create the UI Overlay (Hidden by default)
const box = document.createElement('div');
box.id = 'ss-overlay';
box.style.display = 'none'; // <--- HIDDEN BY DEFAULT
box.innerHTML = `
    <div class="ss-header">Crunch 🥨</div>
    <div class="ss-row" title="How much bigger is the video stream than your actual screen?">
        <span>Efficiency:</span> <span id="ss-eff">-</span>
    </div>
    <div class="ss-row" title="Actual resolution of the video file">
        <span>Source Res:</span> <span id="ss-res">-</span>
    </div>
    <div class="ss-row" title="Smoothness (Drops / Total)">
        <span>Drops:</span> <span id="ss-drop">-</span>
    </div>
    <div class="ss-row" title="Seconds of video pre-loaded">
        <span>Buffer:</span> <span id="ss-buf">-</span>
    </div>
    <div class="ss-row" title="Video compression format">
        <span>Codec:</span> <span id="ss-codec" style="font-size:10px">Waiting...</span>
    </div>
`;
document.body.appendChild(box);

// State
let currentCodec = "Standard/H.264";

// 3. Listen for Toggle Click from Background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "TOGGLE_CRUNCH") {
        if (box.style.display === 'none') {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    }
});

// 4. Listen for Codec from inject.js
window.addEventListener('message', (e) => {
    if (e.data.type === 'STREAM_SENTRY_CODEC') {
        let raw = e.data.codec;
        // Updated Logic to catch vp09 and others
        if (raw.includes('vp09') || raw.includes('vp9')) currentCodec = "VP9";
        else if (raw.includes('av01')) currentCodec = "AV1";
        else if (raw.includes('avc1')) currentCodec = "H.264";
        else if (raw.includes('hvc1')) currentCodec = "HEVC";
        else currentCodec = raw.split(';')[1] || raw;
    }
});

// 5. The Loop
setInterval(() => {
    // Optimization: Don't calculate if box is hidden
    if (box.style.display === 'none') return;

    const video = document.querySelector('video');
    const elEff = document.getElementById('ss-eff');
    const elRes = document.getElementById('ss-res');
    const elDrop = document.getElementById('ss-drop');
    const elBuf = document.getElementById('ss-buf');
    const elCodec = document.getElementById('ss-codec');

    if (!video || video.paused) {
        box.style.opacity = '0.5';
        if(!video) return;
    } else {
        box.style.opacity = '1';
    }

    // --- Metric 1: Efficiency & Resolution ---
    const sourceH = video.videoHeight;
    // FIX: Multiply by devicePixelRatio for correct scaling
    const displayH = video.getBoundingClientRect().height * window.devicePixelRatio; 
    
    if (sourceH && displayH) {
        elRes.innerText = `${video.videoWidth}x${sourceH}p`;
        
        const ratio = sourceH / displayH;
        if (ratio > 1.2) {
            elEff.innerText = `${ratio.toFixed(1)}x (Waste)`;
            elEff.className = 'ss-bad';
        } else if (ratio < 0.8) {
            elEff.innerText = `${ratio.toFixed(1)}x (Blurry)`;
            elEff.className = 'ss-warn';
        } else {
            elEff.innerText = `1.0x (Perfect)`;
            elEff.className = 'ss-good';
        }
    }

    // --- Metric 2: Dropped Frames ---
    if (video.getVideoPlaybackQuality) {
        const q = video.getVideoPlaybackQuality();
        const dropPct = (q.droppedVideoFrames / q.totalVideoFrames) * 100 || 0;
        elDrop.innerText = `${q.droppedVideoFrames} (${dropPct.toFixed(2)}%)`;
        elDrop.className = dropPct > 1 ? 'ss-bad' : 'ss-good';
    }

    // --- Metric 3: Buffer Health ---
    let bufferLeft = 0;
    const time = video.currentTime;
    for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= time && video.buffered.end(i) >= time) {
            bufferLeft = video.buffered.end(i) - time;
            break;
        }
    }
    elBuf.innerText = `${bufferLeft.toFixed(1)}s`;
    elBuf.className = bufferLeft < 5 ? 'ss-bad' : 'ss-good';

    // --- Metric 4: Codec ---
    elCodec.innerText = currentCodec;

}, 1000);