// assets/js/news.js

// === БАЗА ДАННЫХ НОВОСТЕЙ ===
// Чтобы добавить новость, просто скопируй блок { ... } и вставь его в начало списка.
const newsData = [
    {
        id: 1,
        title: "Глобальный Вайп и Обновление 0.95",
        date: "28 Января 2025",
        category: "update", // варианты: update, event, info
        text: "Серверы были успешно вайпнуты. Мы обновили экономику, добавили новые зоны лута и изменили настройки роботов. Заходите и оцените!",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format" 
    },
    {
        id: 2,
        title: "Турнир 'Король Горы' - Призовой фонд",
        date: "25 Января 2025",
        category: "event",
        text: "В эту субботу в 19:00 МСК пройдет масштабный PvP турнир в секторе B3. Победитель получает топ-лут и 1000 коинов на баланс.",
        image: "https://images.unsplash.com/photo-1533236897111-3e94666b2edf?q=80&w=600&auto=format"
    },
    {
        id: 3,
        title: "Технические работы завершены",
        date: "20 Января 2025",
        category: "info",
        text: "Перенос оборудования в новый дата-центр завершен. Пинг стал ниже, а FPS стабильнее. Приятной игры!",
        image: null // Можно ставить null, если картинки нет
    }
];

// === ЛОГИКА ОТРИСОВКИ (НЕ ТРОГАТЬ) ===
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('newsGrid');

    if (!grid) return;

    newsData.forEach(news => {
        // Определяем текст и цвет бейджика
        let badgeText = "Info";
        let badgeClass = "badge-info";

        if (news.category === 'update') { badgeText = "Обновление"; badgeClass = "badge-update"; }
        if (news.category === 'event') { badgeText = "Ивент"; badgeClass = "badge-event"; }

        // Если есть картинка - вставляем, если нет - ставим заглушку цветом
        const imageHtml = news.image 
            ? `<div class="news-image" style="background-image: url('${news.image}')"></div>` 
            : `<div class="news-image" style="background: linear-gradient(45deg, #1a1a20, #2a2a30);"></div>`;

        // Создаем HTML карточки
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            ${imageHtml}
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-badge ${badgeClass}">${badgeText}</span>
                    <span class="news-date">${news.date}</span>
                </div>
                <h2>${news.title}</h2>
                <p>${news.text}</p>
                
                <a href="https://discord.com/invite/tkCmnaQRdX" class="read-more">Подробнее в Discord →</a>
            </div>
        `;

        grid.appendChild(card);
    });
});