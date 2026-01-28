// assets/js/donate.js

function buyPack(packName, price) {
    // 1. Спрашиваем никнейм
    const nickname = prompt(`Вы выбрали набор "${packName}" за ${price}₽.\nВведите ваш никнейм в SCUM для выдачи:`);

    if (nickname && nickname.trim() !== "") {
        // Подтверждение
        const confirmBuy = confirm(`Никнейм: ${nickname}\nНабор: ${packName}\nК оплате: ${price}₽\n\nПерейти к оплате?`);
        
        if (confirmBuy) {
            // Уведомление об успехе перед переходом
            showToast('Переход к оплате...', 'success');
            window.location.href = "https://www.donationalerts.com/r/jungler";
            setTimeout(() => {
                window.open("https://discord.com/invite/tkCmnaQRdX", "_blank");
            }, 1000);
        }
    } else {
        // Если ник не введен
        if (nickname !== null) {
            showToast('Ошибка: Введите никнейм!', 'error');
        }
    }
}
// Функция для блока "Фонд Развития"
function donateDev() {
    const input = document.getElementById('devAmount');
    const amount = input.value;

    if (!amount || amount < 50) {
        // Если у тебя подключен toast.js, используй showToast
        if (typeof showToast === 'function') {
            showToast('Минимальная сумма пожертвования: 50₽', 'warning');
        } else {
            alert('Минимальная сумма пожертвования: 50₽');
        }
        return;
    }

    // Если у тебя подключен toast.js
    if (typeof showToast === 'function') {
        showToast(`Переход к оплате: ${amount}₽`, 'success');
    }

    // Задержка для красоты и переадресация
    // ЗАМЕНИ ССЫЛКУ на твою реальную (DonationAlerts, Qiwi, Boosty или канал Discord)
    setTimeout(() => {
        // Пример ссылки на DonationAlerts с предустановленной суммой
        window.open(`https://www.donationalerts.com/r/jungler?amount=${amount}`, '_blank');
        
        // Или просто в Дискорд, как раньше:
        //window.open("https://discord.com/invite/tkCmnaQRdX", "_blank");
    }, 1000);
}