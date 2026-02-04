// assets/js/updater.js

const CHECK_INTERVAL = 60000; // Проверять каждые 60 секунд
let isUpdateVisible = false;

async function checkForUpdates() {
    try {
        // Добавляем ?t=... чтобы сам файл версии не закешировался
        const response = await fetch('version.json?t=' + new Date().getTime());
        const data = await response.json();
        const serverVersion = data.version;
        const localVersion = localStorage.getItem('site_version');

        // Если это первый заход - просто сохраняем версию
        if (!localVersion) {
            localStorage.setItem('site_version', serverVersion);
            return;
        }

        // Если версии отличаются и уведомление еще не висит
        if (serverVersion !== localVersion && !isUpdateVisible) {
            showUpdateNotification(serverVersion);
        }

    } catch (error) {
        console.warn('Не удалось проверить обновления:', error);
    }
}

function showUpdateNotification(newVersion) {
    isUpdateVisible = true;

    // Создаем плашку уведомления (если у тебя есть toast.css, используем похожие стили)
    const toast = document.createElement('div');
    toast.className = 'update-toast';
    toast.innerHTML = `
        <div class="update-content">
            <span class="update-icon">⚡</span>
            <div>
                <div class="update-title">ДОСТУПНО ОБНОВЛЕНИЕ</div>
                <div class="update-desc">Загружена новая версия сайта</div>
            </div>
        </div>
        <button class="btn-refresh" onclick="applyUpdate('${newVersion}')">ОБНОВИТЬ ↻</button>
    `;

    document.body.appendChild(toast);

    // Звук уведомления (если есть audio.js)
    const audio = new Audio('assets/audio/hover.mp3'); 
    audio.volume = 0.2;
    audio.play().catch(() => {});
}

function applyUpdate(newVersion) {
    // 1. Сохраняем новую версию
    localStorage.setItem('site_version', newVersion);
    
    // 2. Очищаем кеш (специфичный для ServiceWorker, если есть)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
        });
    }

    // 3. Перезагружаем страницу принудительно
    location.reload(true);
}

// Запуск проверки при загрузке и интервал
document.addEventListener('DOMContentLoaded', () => {
    checkForUpdates();
    setInterval(checkForUpdates, CHECK_INTERVAL);
});