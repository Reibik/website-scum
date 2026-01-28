document.querySelectorAll('.nav a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});
// Логика кнопки "Наверх"
document.addEventListener('DOMContentLoaded', () => {
    // 1. Создаем кнопку и добавляем в body
    const btn = document.createElement('button');
    btn.id = 'scrollTopBtn';
    btn.innerHTML = '▲';
    btn.title = "Наверх";
    document.body.appendChild(btn);

    // 2. Показываем кнопку при прокрутке
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    };

    // 3. Клик - плавный скролл наверх
    btn.onclick = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
});