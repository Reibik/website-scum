// Копирование IP
function copyIP(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("IP скопирован: " + text);
    });
}

// Функция обновления онлайна для главной страницы
async function updateServers() {
    const id1 = '37330681'; 
    const id2 = '37511306';

    try {
        const res1 = await fetch(`https://api.battlemetrics.com/servers/${id1}`);
        const data1 = await res1.json();
        document.getElementById('playerCount1').innerText = 
            `${data1.data.attributes.players}/${data1.data.attributes.maxPlayers}`;
    } catch (e) {
        console.error('Ошибка Server 1', e);
        document.getElementById('playerCount1').innerText = "Offline";
    }

    try {
        const res2 = await fetch(`https://api.battlemetrics.com/servers/${id2}`);
        const data2 = await res2.json();
        document.getElementById('playerCount2').innerText = 
            `${data2.data.attributes.players}/${data2.data.attributes.maxPlayers}`;
    } catch (e) {
        console.error('Ошибка Server 2', e);
        document.getElementById('playerCount2').innerText = "Offline";
    }
}

// Запуск
updateServers();
setInterval(updateServers, 30000);