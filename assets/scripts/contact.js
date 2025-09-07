// Replace social icon with hash icon
document.addEventListener('DOMContentLoaded', function() {
    const socialIcons = document.querySelectorAll('[data-feather="social"]');
    socialIcons.forEach(icon => {
        icon.setAttribute('data-feather', 'hash');
    });
    feather.replace();
});
