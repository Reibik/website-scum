// assets/js/home.js

// === НАСТРОЙКИ: ID СЕРВЕРОВ (BattleMetrics) ===
const SERVER_1_ID = '37330681'; // ELON #1 [PvE]
const SERVER_2_ID = '37511306'; // ELON #2 [PvP]

// Функция копирования IP (использует toast.js, если есть)
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        if (typeof showToast === 'function') {
            showToast('IP скопирован: ' + text, 'success');
        } else {
            alert('IP скопирован: ' + text);
        }
    }).catch(err => {
        console.error('Ошибка копирования', err);
    });
}

// Главная функция обновления статистики
async function updateHomeStats() {
    await updateServerVisuals(SERVER_1_ID, 'playerCount1');
    await updateServerVisuals(SERVER_2_ID, 'playerCount2');
}

// Логика обновления одной карточки
async function updateServerVisuals(serverId, counterElementId) {
    const countEl = document.getElementById(counterElementId);
    if (!countEl) return;

    // Находим карточку-родителя, чтобы менять прогресс-бар и бейдж
    const card = countEl.closest('.server-card-pro');
    const progressBar = card ? card.querySelector('.progress-fill') : null;
    const badge = card ? card.querySelector('.status-badge') : null;

    try {
        const response = await fetch(`https://api.battlemetrics.com/servers/${serverId}`);
        if (!response.ok) throw new Error('API Error');
        
        const json = await response.json();
        const data = json.data.attributes;
        
        const players = data.players;
        const max = data.maxPlayers;
        const isOnline = data.status === 'online';

        if (isOnline) {
            // 1. Обновляем цифры
            countEl.innerText = `${players} / ${max}`;
            countEl.style.color = "var(--primary)";

            // 2. Обновляем статус (бейдж)
            if (badge) {
                badge.className = 'status-badge online';
                badge.innerHTML = `<span class="pulse-dot"></span> ONLINE`;
            }

            // 3. Обновляем полоску прогресса
            if (progressBar) {
                const percent = Math.min((players / max) * 100, 100);
                progressBar.style.width = `${percent}%`;

                // Если сервер почти полон (>90%), делаем полоску красной
                if (percent > 90) {
                    progressBar.style.background = '#ff3333';
                    progressBar.style.boxShadow = '0 0 10px #ff3333';
                } else {
                    progressBar.style.background = 'var(--primary)';
                    progressBar.style.boxShadow = '0 0 10px var(--primary)';
                }
            }

        } else {
            // Если сервер ОФФЛАЙН
            setOfflineVisuals(countEl, badge, progressBar);
        }

    } catch (e) {
        console.error(`Ошибка обновления сервера ${serverId}:`, e);
        setOfflineVisuals(countEl, badge, progressBar);
    }
}

// Вспомогательная функция для режима "Offline"
function setOfflineVisuals(countEl, badge, progressBar) {
    countEl.innerText = "OFFLINE";
    countEl.style.color = "#ff3333";

    if (badge) {
        badge.className = 'status-badge offline';
        badge.innerHTML = `<span class="pulse-dot" style="background: #ff3333; box-shadow: 0 0 10px #ff3333;"></span> OFFLINE`;
        badge.style.borderColor = "#ff3333";
        badge.style.color = "#ff3333";
        badge.style.background = "rgba(255, 51, 51, 0.1)";
    }

    if (progressBar) {
        progressBar.style.width = "0%";
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateHomeStats(); // Первый запуск сразу
    setInterval(updateHomeStats, 60000); // Повтор каждую минуту
});