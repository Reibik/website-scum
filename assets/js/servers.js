async function updateServers() {
    const cards = document.querySelectorAll('.server-card');

    for (const card of cards) {
        const id = card.dataset.id;
        const dot = card.querySelector('.status-dot');
        const playersEl = card.querySelector('.players');
        const bar = card.querySelector('.progress-bar');

        try {
            const res = await fetch(`https://api.battlemetrics.com/servers/${id}`);
            const data = await res.json();

            const players = data.data.attributes.players;
            const max = data.data.attributes.maxPlayers;

            playersEl.textContent = `${players} / ${max}`;
            bar.style.width = `${(players / max) * 100}%`;

            dot.className = 'status-dot online';
        } catch (e) {
            playersEl.textContent = 'OFFLINE';
            bar.style.width = '0%';
            dot.className = 'status-dot offline';
        }
    }
}

updateServers();
setInterval(updateServers, 30000);
