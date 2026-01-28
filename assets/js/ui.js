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
// assets/js/ui.js

// ... (твой старый код кнопки "Наверх") ...

// --- ЛОГИКА МОБИЛЬНОГО МЕНЮ ---
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const btn = document.querySelector('.mobile-menu-btn');
    
    // Переключаем классы
    nav.classList.toggle('active');
    btn.classList.toggle('active');
    
    // Блокируем прокрутку сайта, когда меню открыто
    if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Закрывать меню, если кликнули по ссылке (чтобы оно уехало после перехода)
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.getElementById('mainNav');
        const btn = document.querySelector('.mobile-menu-btn');
        nav.classList.remove('active');
        btn.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});