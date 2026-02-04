// assets/js/updater.js

const CHECK_INTERVAL = 10000; // Проверяем каждые 10 секунд (для теста, потом верни 30000)
let isNotificationShown = false;

async function checkVersion() {
    console.log('[Updater] 🔍 Проверка обновлений...');

    try {
        // Добавляем время, чтобы браузер точно не брал файл из своего кеша
        const response = await fetch('version.json?t=' + new Date().getTime());
        
        if (!response.ok) {
            console.error('[Updater] ❌ Ошибка: Файл version.json не найден (404)');
            return;
        }

        const data = await response.json();
        const serverVersion = String(data.version); // Превращаем в строку на всякий случай
        const localVersion = localStorage.getItem('site_version');

        console.log(`[Updater] 📊 На сервере: ${serverVersion} | У тебя: ${localVersion}`);

        // Сценарий 1: Человек зашел первый раз
        if (!localVersion) {
            console.log('[Updater] 🆕 Первый заход. Сохраняем версию.');
            localStorage.setItem('site_version', serverVersion);
            return;
        }

        // Сценарий 2: Версии разные
        if (serverVersion !== localVersion) {
            console.log('[Updater] ⚡ НАЙДЕНО ОБНОВЛЕНИЕ!');
            
            if (!isNotificationShown) {
                showUpdateUI(serverVersion);
            }
        } else {
            console.log('[Updater] ✅ Версия актуальна.');
        }

    } catch (err) {
        console.error('[Updater] 💀 Ошибка скрипта:', err);
    }
}

function showUpdateUI(newVersion) {
    isNotificationShown = true;

    // Проверка: не создаем ли мы дубликаты
    if (document.querySelector('.update-notification')) return;

    const div = document.createElement('div');
    div.className = 'update-notification';
    div.innerHTML = `
        <div class="update-text">
            <strong>⚡ ОБНОВЛЕНИЕ v${newVersion}</strong>
            <span>Доступна новая версия сайта</span>
        </div>
        <button id="updateBtn">ОБНОВИТЬ ↻</button>
    `;

    document.body.appendChild(div);

    // Вешаем клик отдельно (надежнее)
    document.getElementById('updateBtn').onclick = () => applyUpdate(newVersion);
    
    // Звук
    try {
        const audio = new Audio('assets/audio/hover.mp3'); 
        audio.volume = 0.3;
        audio.play().catch(()=>{});
    } catch(e) {}
}

function applyUpdate(newVersion) {
    console.log('[Updater] 🔄 Обновляем...');
    localStorage.setItem('site_version', newVersion);
    location.reload();
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkVersion, 2000); // Первая проверка через 2 сек
    setInterval(checkVersion, CHECK_INTERVAL);
});