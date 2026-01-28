// assets/js/servers.js

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.server-card');

    cards.forEach(card => {
        const serverId = card.getAttribute('data-id'); // Берет ID из HTML
        updateServerCard(card, serverId);
    });

    // Обновляем каждые 60 секунд
    setInterval(() => {
        cards.forEach(card => {
            const serverId = card.getAttribute('data-id');
            updateServerCard(card, serverId);
        });
    }, 60000);
});

async function updateServerCard(card, id) {
    const playersEl = card.querySelector('.players');
    const labelEl = card.querySelector('.label');
    const barEl = card.querySelector('.progress-bar');
    const dotEl = card.querySelector('.status-dot');

    try {
        const response = await fetch(`https://api.battlemetrics.com/servers/${id}`);
        
        if (!response.ok) throw new Error('Network error');
        
        const json = await response.json();
        const data = json.data.attributes;
        const isOnline = data.status === 'online';

        if (isOnline) {
            // Онлайн
            const current = data.players;
            const max = data.maxPlayers;
            const percent = Math.min((current / max) * 100, 100);

            playersEl.innerText = `${current} / ${max}`;
            labelEl.innerText = 'Игроков онлайн';
            barEl.style.width = `${percent}%`;
            
            // Цвет точки и полоски в зависимости от заполненности
            if (percent > 90) {
                barEl.style.backgroundColor = '#ff3333'; // Красный (полный)
            } else {
                barEl.style.backgroundColor = 'var(--primary)'; // Оранжевый
            }

            dotEl.className = 'status-dot online'; // Зеленая точка
        } else {
            // Оффлайн
            throw new Error('Server offline');
        }

    } catch (error) {
        // Если ошибка или сервер выключен
        playersEl.innerText = "OFFLINE";
        playersEl.style.color = "#ff3333";
        labelEl.innerText = "Сервер недоступен";
        barEl.style.width = "0%";
        dotEl.className = 'status-dot offline'; // Красная точка
    }
}