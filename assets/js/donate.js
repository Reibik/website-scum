document.querySelectorAll('.donate-card button').forEach(btn => {
    btn.addEventListener('click', () => {
        const pack = btn.dataset.pack;
        alert(`Покупка пакета: ${pack}\n\n(Дальше подключаем оплату и авто-выдачу)`);
    });
});
