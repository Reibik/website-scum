// assets/js/toast.js

// 1. Создаем контейнер при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
});

// 2. Главная функция вызова уведомления
// showToast("Текст сообщения", "тип");
// Типы: 'success', 'error', 'info', 'warning'
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    
    // Создаем элемент
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Подбираем иконку
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
        <div style="display:flex; align-items:center;">
            <span class="toast-icon">${icon}</span>
            <span>${message}</span>
        </div>
    `;

    // Добавляем в контейнер
    container.appendChild(toast);

    // Удаляем через 3 секунды
    setTimeout(() => {
        toast.classList.add('hide'); // Запускаем анимацию исчезновения
        toast.addEventListener('animationend', () => {
            toast.remove(); // Удаляем из HTML после анимации
        });
    }, 3000);
}

// Глобальная функция копирования для использования везде
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('IP скопирован в буфер!', 'success');
    }).catch(err => {
        showToast('Ошибка копирования', 'error');
        console.error(err);
    });
}