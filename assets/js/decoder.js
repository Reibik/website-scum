// assets/js/decoder.js

// Набор символов для эффекта (Кириллица + Латиница + Цифры + Символы)
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZабвгдежзийклмнопрстуфхцчшщъыьэюя0123456789@#$%&";

function runMatrixEffect(element) {
    // Если анимация уже идет - не запускаем новую (чтобы не баговало)
    if (element.dataset.animating === "true") return;
    
    element.dataset.animating = "true";
    let iteration = 0;
    
    // Сохраняем оригинальный текст в data-атрибут, если его там еще нет
    if (!element.dataset.value) {
        element.dataset.value = element.innerText;
    }
    
    const originalText = element.dataset.value;
    
    // Очищаем предыдущий таймер
    clearInterval(element.interval);

    element.interval = setInterval(() => {
        element.innerText = originalText
            .split("")
            .map((letter, index) => {
                // Если буква уже расшифрована (индекс меньше итерации) - оставляем её
                if (index < iteration) {
                    return originalText[index];
                }
                // Иначе показываем случайный символ
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

        // Условие остановки
        if (iteration >= originalText.length) {
            clearInterval(element.interval);
            element.dataset.animating = "false"; // Разрешаем повторный запуск
        }

        // Скорость расшифровки (чем больше дробь, тем быстрее)
        iteration += 1 / 3; 
        
    }, 30); // Скорость обновления кадров (мс)
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. Логотип (эффект при наведении)
    const logo = document.querySelector('.logo');
    if (logo) {
        // Сохраняем исходный текст ("ELON PROJECT")
        logo.dataset.value = logo.innerText;
        
        logo.onmouseover = event => {
            runMatrixEffect(event.currentTarget); // currentTarget берет именно ссылку, а не span внутри
        };
    }

    // 2. Любые заголовки с классом 'hacker-text' (эффект при появлении)
    const hackerElements = document.querySelectorAll('.hacker-text');
    hackerElements.forEach(el => {
        el.dataset.value = el.innerText;
        
        // Запускаем при наведении
        el.onmouseover = event => {
            runMatrixEffect(event.target);
        };
        
        // МОЖНО РАСКОММЕНТИРОВАТЬ: Запуск один раз при загрузке страницы
			runMatrixEffect(el);
    });
});