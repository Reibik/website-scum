document.addEventListener('DOMContentLoaded', () => {
    // Находим все карточки серверов на странице
    const serverCards = document.querySelectorAll('.server-card');

    serverCards.forEach(card => {
        const serverId = card.getAttribute('data-id'); // Берем ID из HTML
        if (serverId) {
            fetchServerData(serverId, card);
        }
    });
});

async function fetchServerData(id, cardElement) {
    const apiUrl = `https://api.battlemetrics.com/servers/${id}`;
    
    // Элементы внутри текущей карточки, которые будем менять
    const playersElement = cardElement.querySelector('.players');
    const dotElement = cardElement.querySelector('.status-dot');
    const barElement = cardElement.querySelector('.progress-bar');

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Ошибка сети');
        
        const data = await response.json();
        const info = data.data.attributes;

        // 1. Обновляем цифры онлайна
        const currentPlayers = info.players;
        const maxPlayers = info.maxPlayers;
        playersElement.innerText = `${currentPlayers} / ${maxPlayers}`;

        // 2. Обновляем полоску прогресса
        // Ограничиваем 100%, чтобы не вылезало
        const percentage = Math.min((currentPlayers / maxPlayers) * 100, 100);
        barElement.style.width = `${percentage}%`;

        // 3. Статус (Онлайн/Оффлайн)
        if (info.status === 'online') {
            dotElement.classList.remove('loading');
            dotElement.classList.add('online');
            dotElement.style.background = '#00ff41';
            dotElement.style.boxShadow = '0 0 10px #00ff41';
        } else {
            setOfflineStyle(playersElement, dotElement, barElement);
        }

    } catch (error) {
        console.error(`Не удалось загрузить сервер ${id}:`, error);
        setOfflineStyle(playersElement, dotElement, barElement);
    }
}

function setOfflineStyle(playersRef, dotRef, barRef) {
    playersRef.innerText = 'OFFLINE';
    playersRef.style.color = '#ff3333';
    
    dotRef.classList.remove('loading');
    dotRef.style.background = '#ff3333';
    dotRef.style.boxShadow = 'none';
    
    barRef.style.width = '0%';
}