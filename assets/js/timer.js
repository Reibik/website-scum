// assets/js/timer.js

document.addEventListener('DOMContentLoaded', () => {
    // === НАСТРОЙКИ ===
    // Твои рестарты: 03:00, 09:00, 15:00, 21:00
    const restartHours = [3, 9, 15, 21]; 
    
    const timerElement = document.getElementById('restart-timer');
    const barElement = document.getElementById('restart-bar');
    const statusElement = document.querySelector('.restart-status');

    function updateCountdown() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // 1. Ищем следующий рестарт
        let nextRestartHour = restartHours.find(h => h > currentHour);
        
        // Если время больше 21:00, то следующий рестарт в 03:00 утра
        if (nextRestartHour === undefined) {
            nextRestartHour = restartHours[0]; 
        }

        // 2. Создаем дату следующего рестарта
        const nextRestart = new Date();
        nextRestart.setHours(nextRestartHour, 0, 0, 0);

        // Если следующий рестарт завтра (например, сейчас 22:00, а рестарт в 03:00)
        if (nextRestartHour <= currentHour) {
            nextRestart.setDate(nextRestart.getDate() + 1);
        }

        // 3. Считаем разницу
        const diff = nextRestart - now;

        // Если вдруг время отрицательное (баг с миллисекундами), ставим 0
        if (diff < 0) {
             timerElement.innerText = "00:00:00";
             return;
        }

        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        timerElement.innerText = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // 4. Логика тревоги (Красный цвет)
        const totalMinutesLeft = (hours * 60) + minutes;

        barElement.classList.remove('warning', 'danger');
        if (statusElement) statusElement.innerText = "ВСЕ СИСТЕМЫ ПОДКЛЮЧЕНЫ К СЕТИ";

        // Если осталось меньше 30 мин - Желтый
        if (totalMinutesLeft < 30) {
            barElement.classList.add('warning');
        }
        
        // Если осталось меньше 10 мин - Красный + Мигание
        if (totalMinutesLeft < 10) {
            barElement.classList.add('danger');
            if (statusElement) statusElement.innerText = "⚠ СКОРО ПЕРЕЗАГРУЗКА";
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
});