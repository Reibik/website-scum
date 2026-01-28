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