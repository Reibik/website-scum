// assets/js/donate.js

function buyPack(packName, price) {
    // 1. Спрашиваем никнейм
    const nickname = prompt(`Вы выбрали набор "${packName}" за ${price}₽.\nВведите ваш никнейм в SCUM для выдачи:`);

    if (nickname && nickname.trim() !== "") {
        // 2. Если ник введен, подтверждаем
        const confirmBuy = confirm(`Никнейм: ${nickname}\nНабор: ${packName}\nК оплате: ${price}₽\n\nПерейти к оплате?`);
        
        if (confirmBuy) {
            // ЗДЕСЬ БУДЕТ ССЫЛКА НА ОПЛАТУ
            // Если у тебя есть DonationAlerts или Tebex, вставь ссылку ниже:
            // window.location.href = "https://www.donationalerts.com/r/твой_ник";
            
            alert("Сейчас вы будете перенаправлены на страницу оплаты (или в Discord для создания тикета).");
            
            // Пока перекидываем в Discord
            window.open("https://discord.com/invite/tkCmnaQRdX", "_blank");
        }
    } else {
        // Если нажал отмена или не ввел ник
        if (nickname !== null) {
            alert("Пожалуйста, введите никнейм, чтобы мы знали, кому выдать донат!");
        }
    }
}