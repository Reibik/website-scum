// assets/js/loader.js

window.addEventListener('load', () => {
    // Минимальная задержка 0.5 сек, чтобы анимацию успели заметить (красиво)
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Защита: если что-то зависло, убираем лоадер принудительно через 3 секунды
setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
        document.body.classList.add('loaded');
    }
}, 3000);