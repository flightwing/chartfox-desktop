// Preload script
window.addEventListener('load', () => {
    window.postMessage({
        type: 'chartfox_extension_enabled',
        version: '1.3.1'
    }, '*');
});
