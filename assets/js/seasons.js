// assets/js/seasons.js

document.addEventListener('DOMContentLoaded', () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Месяцы в JS от 0 до 11, поэтому +1

    const body = document.body;
    const overlay = document.createElement('div');
    overlay.className = 'season-overlay';
    body.appendChild(overlay);

    // --- ЛОГИКА ПРОВЕРКИ ДАТ ---

    // 1. НОВЫЙ ГОД (с 20 Декабря по 15 Января)
    if ((month === 12 && day >= 1) || (month === 1 && day <= 31)) {
        console.log("Сезон: Новый Год ❄️");
        startSnow(overlay);
    }

    // 2. ХЭЛЛОУИН (с 25 Октября по 5 Ноября)
    else if ((month === 10 && day >= 25) || (month === 11 && day <= 5)) {
        console.log("Сезон: Хэллоуин 🎃");
        body.classList.add('season-halloween');
        startBats(overlay);
    }

    // 3. 9 МАЯ (День Победы)
    else if (month === 5 && day === 9) {
        console.log("Сезон: 9 Мая 🎆");
        startFireworks(overlay);
    }

    // 4. 14 ФЕВРАЛЯ (День Влюбленных)
    else if (month === 2 && day === 14) {
        console.log("Сезон: 14 Февраля ❤️");
        startHearts(overlay);
    }
});

// --- ФУНКЦИИ ЭФФЕКТОВ ---

// Снег
function startSnow(container) {
    const flakeCount = 50; // Количество снежинок
    for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.style.left = Math.random() * 100 + 'vw';
        flake.style.width = Math.random() * 5 + 2 + 'px';
        flake.style.height = flake.style.width;
        flake.style.animationDuration = Math.random() * 3 + 2 + 's'; // Скорость падения
        flake.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(flake);
    }
}

// Летучие мыши
function startBats(container) {
    const batCount = 10;
    for (let i = 0; i < batCount; i++) {
        const bat = document.createElement('div');
        bat.className = 'bat';
        bat.style.top = Math.random() * 50 + 'vh'; // Летают только в верхней половине
        bat.style.animationDuration = Math.random() * 10 + 5 + 's';
        bat.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(bat);
    }
}

// Сердечки
function startHearts(container) {
    const count = 30;
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.animationDuration = Math.random() * 5 + 3 + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(heart);
    }
}

// Салют (простая имитация цветных вспышек)
function startFireworks(container) {
    setInterval(() => {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = Math.random() * 100 + 'vw';
        firework.style.top = Math.random() * 80 + 'vh';
        // Случайный цвет салюта
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        firework.style.boxShadow = `0 0 0 0 ${color}`;
        
        container.appendChild(firework);
        
        // Удаляем элемент после анимации
        setTimeout(() => firework.remove(), 1000);
    }, 500); // Запускаем каждые полсекунды
}