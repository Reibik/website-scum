// assets/js/tracker.js

document.addEventListener('DOMContentLoaded', () => {
    // Генерируем случайный ID для гостя, если его нет
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
        visitorId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitor_id', visitorId);
    }

    // Ссылка на этого пользователя в базе данных
    const presenceRef = db.ref('visitors/' + visitorId);
    const connectedRef = db.ref('.info/connected');

    // Когда соединение установлено
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            // 1. Добавляем себя в список "visitors"
            presenceRef.set({
                state: 'online',
                last_seen: Date.now(),
                page: window.location.pathname
            });

            // 2. Если интернет пропадет или вкладку закроют — удалить запись автоматически
            presenceRef.onDisconnect().remove();
        }
    });
});