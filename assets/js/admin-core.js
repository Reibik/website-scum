// assets/js/admin-core.js

// 1. ЛОГИН
function adminLogin() {
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;
    const errorText = document.getElementById('loginError');

    auth.signInWithEmailAndPassword(email, pass)
        .catch((error) => {
            errorText.innerText = "ACCESS DENIED: " + error.message;
        });
}

auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('dashboard-wrapper').style.display = 'flex';
        initDashboard(); 
    } else {
        document.getElementById('login-overlay').style.display = 'flex';
        document.getElementById('dashboard-wrapper').style.display = 'none';
    }
});

// 2. ЗАПУСК ВСЕХ ФУНКЦИЙ
function initDashboard() {
    initLiveVisitors();
    initContentManager();
    initSystemControl();
    initVisuals(); // НОВОЕ
    initChart();
    
    // Запуск мониторинга серверов
    updateServerStats();
    setInterval(updateServerStats, 30000); 
}

// 3. BATTLEMETRICS (ОНЛАЙН)
function updateServerStats() {
    // !!! ВСТАВЬ СЮДА СВОИ ID !!!
    const serverId1 = '71882'; 
    const serverId2 = '77278';

    fetch(`https://api.battlemetrics.com/servers/${serverId1}`)
        .then(res => res.json()).then(data => {
            const online = data.data.attributes.players;
            const el = document.getElementById('server1Online');
            if(el) { el.innerText = online; el.style.color = online > 0 ? '#00ff41' : '#ff3333'; }
        }).catch(()=>{});

    fetch(`https://api.battlemetrics.com/servers/${serverId2}`)
        .then(res => res.json()).then(data => {
            const online = data.data.attributes.players;
            const el = document.getElementById('server2Online');
            if(el) { el.innerText = online; el.style.color = online > 0 ? '#00ff41' : '#ff3333'; }
        }).catch(()=>{});
}

// 4. ЖИВОЙ СЧЕТЧИК
let chart;
function initLiveVisitors() {
    db.ref('visitors').on('value', (snapshot) => {
        const count = snapshot.numChildren();
        document.getElementById('liveVisitors').innerText = count;
        if(chart) {
            const now = new Date().toLocaleTimeString();
            if (chart.data.labels.length > 50) { chart.data.labels.shift(); chart.data.datasets[0].data.shift(); }
            chart.data.labels.push(now); chart.data.datasets[0].data.push(count); chart.update();
        }
    });
}
function initChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Online', data: [], borderColor: '#00ff41', backgroundColor: 'rgba(0, 255, 65, 0.1)', borderWidth: 2, tension: 0.4, fill: true, pointRadius: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { y: { beginAtZero: true, grid: { color: '#333' } }, x: { display: false } }, plugins: { legend: { display: false } } }
    });
}

// 5. КОНТЕНТ (НОВОСТИ И СТРОКА)
function initContentManager() {
    db.ref('settings/ticker').on('value', (snap) => {
        document.getElementById('currentTicker').innerText = snap.val() || "Пусто";
        document.getElementById('tickerInput').value = snap.val() || "";
    });

    const list = document.getElementById('adminNewsList');
    db.ref('news').orderByChild('timestamp').on('value', (snap) => {
        list.innerHTML = "";
        snap.forEach((child) => {
            const post = child.val();
            const item = document.createElement('div');
            item.style.cssText = "background: #222; padding: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #333;";
            item.innerHTML = `<div style="font-size: 0.85rem; color: #ccc;">${post.date} <br> <b style="color: #fff;">${post.title}</b></div><button onclick="deleteNews('${post.id}')" style="background: #ff3333; border: none; color: #fff; padding: 5px; cursor: pointer;">🗑️</button>`;
            list.prepend(item);
        });
    });
}
function updateTicker() { db.ref('settings/ticker').set(document.getElementById('tickerInput').value).then(()=>alert("Ticker Updated")); }
function addNews() {
    const title = document.getElementById('newsTitle').value;
    if (!title) return alert("Заголовок обязателен!");
    const newKey = db.ref().child('news').push().key;
    db.ref('news/' + newKey).set({
        id: newKey, title, date: document.getElementById('newsDate').value || new Date().toISOString().split('T')[0],
        category: document.getElementById('newsCategory').value, image: document.getElementById('newsImage').value || '', text: document.getElementById('newsText').value, timestamp: Date.now()
    }).then(() => { alert("News Posted!"); document.getElementById('newsTitle').value = ""; });
}
function deleteNews(id) { if(confirm("Delete?")) db.ref('news/' + id).remove(); }

// 6. СИСТЕМА (ТЕХРАБОТЫ И АЛЕРТЫ)
function initSystemControl() {
    db.ref('settings/maintenance').on('value', (snap) => {
        const isActive = snap.val();
        document.getElementById('maintenanceToggle').checked = isActive;
        const s = document.getElementById('maintenanceStatus'); s.innerText = isActive ? "LOCKED" : "ONLINE"; s.style.color = isActive ? "#ff3333" : "#00ff41";
    });
}
function toggleMaintenance() { db.ref('settings/maintenance').set(document.getElementById('maintenanceToggle').checked); }
function sendGlobalAlert() {
    const text = document.getElementById('alertText').value;
    if(text) db.ref('settings/alert').set({ message: text, timestamp: Date.now() }).then(() => { alert("Alert Sent!"); document.getElementById('alertText').value = ""; });
}

// 7. ВИЗУАЛ И DISCORD (НОВОЕ)
function initVisuals() {
    db.ref('settings/atmosphere').on('value', (snap) => {
        const mode = snap.val() || 'default';
        document.getElementById('currentAtmosphere').innerText = mode.toUpperCase();
    });
    const saved = localStorage.getItem('saved_webhook');
    if (saved) document.getElementById('discordWebhook').value = saved;
}

function setAtmosphere(mode) { db.ref('settings/atmosphere').set(mode); }

function sendToDiscord(type) {
    const url = document.getElementById('discordWebhook').value;
    const msg = document.getElementById('discordMsg').value;
    if (!url || !msg) return alert("Нужен Webhook и текст!");
    localStorage.setItem('saved_webhook', url);

    fetch(url, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "ELON COMMANDER", avatar_url: "https://i.postimg.cc/L4TtXw7n/Gemini-Generated-Image-vvg9bpvvg9bpvvg9.png",
            embeds: [{ title: type === 'alert' ? "⚠️ SYSTEM ALERT" : "📢 BCU NEWS", description: msg, color: type === 'alert' ? 16724787 : 5793266, timestamp: new Date().toISOString() }]
        })
    }).then(res => { if(res.ok) alert("Discord Sent!"); else alert("Error!"); });
}