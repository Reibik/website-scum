const news = [
    {
        title: 'Запуск сервера ELON #2 (PvP)',
        text: 'Мы открыли второй сервер с полноценным PvP, мехами и динамическими ивентами.',
        type: 'hot',
        date: '10.01.2026'
    },
    {
        title: 'Обновление экономики',
        text: 'Полностью переработан лут, торговцы и цены. Экономика стала честнее.',
        type: 'update',
        date: '08.01.2026'
    },
    {
        title: 'Новый сайт проекта',
        text: 'Мы запустили новый официальный сайт ELON SCUM PROJECT.',
        type: 'new',
        date: '05.01.2026'
    }
];

const grid = document.getElementById('newsGrid');

news.forEach(n => {
    const card = document.createElement('div');
    card.className = `news-card ${n.type}`;

    card.innerHTML = `
        <div class="news-tag">${n.type.toUpperCase()}</div>
        <div class="news-title">${n.title}</div>
        <div class="news-text">${n.text}</div>
        <div class="news-date">${n.date}</div>
    `;

    grid.appendChild(card);
});
