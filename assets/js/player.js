document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('bcu-player');
    const audio = document.getElementById('bg-music');
    const playBtn = document.getElementById('playBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const statusText = document.querySelector('.track-status');

    // Начальная громкость (30%)
    audio.volume = 0.3;

    // Функция развертывания/свертывания
    window.togglePlayer = function() {
        player.classList.toggle('collapsed');
    };

    // Функция Play/Pause
    window.toggleAudio = function() {
        if (audio.paused) {
            audio.play().then(() => {
                updateUI(true);
            }).catch(error => {
                console.log("Автовоспроизведение заблокировано браузером", error);
            });
        } else {
            audio.pause();
            updateUI(false);
        }
    };

    // Обновление интерфейса
    function updateUI(isPlaying) {
        if (isPlaying) {
            player.classList.add('playing');
            playBtn.innerText = "⏸"; // Значок паузы
            statusText.innerText = "PLAYING...";
            statusText.style.color = "#00ff41"; // Зеленый
        } else {
            player.classList.remove('playing');
            playBtn.innerText = "▶"; // Значок плей
            statusText.innerText = "PAUSED";
            statusText.style.color = "#666";
        }
    }

    // Регулировка громкости
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    // Если музыка закончилась - запускаем снова (хотя там стоит loop)
    audio.addEventListener('ended', () => {
        this.currentTime = 0;
        this.play();
    });
});