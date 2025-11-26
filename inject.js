(function() {
    // This runs in the actual page context
    const originalAddSourceBuffer = MediaSource.prototype.addSourceBuffer;

    MediaSource.prototype.addSourceBuffer = function(mimeString) {
        // Intercept the MIME type (e.g., 'video/mp4; codecs="avc1..."')
        if (typeof mimeString === 'string' && mimeString.includes('codecs')) {
            window.postMessage({
                type: 'STREAM_SENTRY_CODEC',
                codec: mimeString
            }, '*');
        }
        // Call the original browser function so video still works
        return originalAddSourceBuffer.apply(this, arguments);
    };
})();