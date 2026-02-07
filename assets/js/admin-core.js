// assets/js/admin-core.js
const socket = io();
let chart;

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAccess();
});

// === 1. ПРОВЕРКА ДОСТУПА ===
async function checkAdminAccess() {
    const gateMsg = document.getElementById('gate-msg');
    try {
        const res = await fetch('/api/user');
        const data = await res.json();

        // Не вошел
        if (!data.loggedIn) {
            gateMsg.innerText = "ТРЕБУЕТСЯ АВТОРИЗАЦИЯ";
            gateMsg.style.color = "red";
            document.getElementById('admin-login-btn').classList.remove('hidden');
            return;
        }

        // Вошел, но не Админ
        if (data.user.role !== 'admin') {
            gateMsg.innerHTML = `<span style="color:red; font-size:1.5rem;">ДОСТУП ЗАПРЕЩЕН</span><br>Ваша роль: ${data.user.role.toUpperCase()}`;
            document.querySelector('.loader-ring').style.display = 'none';
            return;
        }

        // Админ
        unlockPanel(data.user);

    } catch (e) { console.error(e); }
}

function unlockPanel(user) {
    document.getElementById('gatekeeper').style.display = 'none';
    document.getElementById('dashboard-wrapper').classList.remove('hidden');
    document.getElementById('dashboard-wrapper').style.display = 'flex';
    
    // Профиль в сайдбаре
    document.getElementById('adm-avatar').src = user.avatar;
    document.getElementById('adm-name').innerText = user.displayName;
    const role = document.getElementById('adm-role');
    role.innerText = "COMMANDER";
    role.classList.add('role-admin');

    initDashboard();
}

// === 2. ЗАПУСК ДАШБОРДА ===
function initDashboard() {
    updateServerStats();
    setInterval(updateServerStats, 30000);
    loadNewsList();
    initChart();
    
    const savedHook = localStorage.getItem('saved_webhook');
    if(savedHook) document.getElementById('discordWebhook').value = savedHook;
}

// === 3. SOCKET.IO ===
socket.on('stats_update', (data) => {
    document.getElementById('liveVisitors').innerText = data.online;
    addDataToChart(data.online);
});

function updateTicker() {
    const text = document.getElementById('tickerInput').value;
    if(text) { socket.emit('admin_update_ticker', text); alert("Обновлено!"); }
}

function toggleMaintenance() {
    const status = document.getElementById('maintenanceToggle').checked;
    socket.emit('admin_toggle_maintenance', status);
    const lbl = document.getElementById('maintenanceStatus');
    lbl.innerText = status ? "LOCKED" : "ONLINE";
    lbl.style.color = status ? "red" : "#00ff41";
}

function sendGlobalAlert() {
    const text = document.getElementById('alertText').value;
    if(text) { socket.emit('admin_global_alert', text); alert("Отправлено!"); }
}

function setAtmosphere(mode) {
    socket.emit('admin_set_atmosphere', mode);
    document.getElementById('currentAtmosphere').innerText = mode.toUpperCase();
}

// === 4. НОВОСТИ (API) ===
async function loadNewsList() {
    const list = document.getElementById('adminNewsList');
    const res = await fetch('/api/news');
    const data = await res.json();
    list.innerHTML = "";
    data.forEach(p => {
        const div = document.createElement('div');
        div.style.cssText = "background:#222; padding:10px; margin-bottom:5px; border:1px solid #333; display:flex; justify-content:space-between; align-items:center;";
        div.innerHTML = `<span style="font-size:0.8rem; color:#ccc;">${p.date} | ${p.title}</span> <button onclick="deleteNews('${p._id}')" style="background:red;border:none;color:#fff;cursor:pointer;padding:2px 5px;">✖</button>`;
        list.appendChild(div);
    });
}

async function addNews() {
    const payload = {
        title: document.getElementById('newsTitle').value,
        date: document.getElementById('newsDate').value,
        category: document.getElementById('newsCategory').value,
        image: document.getElementById('newsImage').value,
        text: document.getElementById('newsText').value
    };
    await fetch('/api/news', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    alert("Новость добавлена!");
    loadNewsList();
}

async function deleteNews(id) {
    if(confirm("Удалить?")) {
        await fetch(`/api/news/${id}`, { method: 'DELETE' });
        loadNewsList();
    }
}

// === 5. DISCORD ===
function sendToDiscord(type) {
    const url = document.getElementById('discordWebhook').value;
    const msg = document.getElementById('discordMsg').value;
    if(!url || !msg) return alert("Заполни поля!");
    localStorage.setItem('saved_webhook', url);
    
    fetch(url, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "ELON BOT",
            embeds: [{ title: type==='alert'?"⚠️ ALERT":"📢 NEWS", description: msg, color: type==='alert'?16711680:5793266 }]
        })
    }).then(() => alert("Отправлено!"));
}

// === 6. ГРАФИКИ И BATTLEMETRICS ===
function updateServerStats() {
    // ЗАМЕНИ НА СВОИ ID
    fetch('https://api.battlemetrics.com/servers/71882').then(r=>r.json()).then(d=>{
        document.getElementById('server1Online').innerText = d.data.attributes.players;
    });
    fetch('https://api.battlemetrics.com/servers/77278').then(r=>r.json()).then(d=>{
        document.getElementById('server2Online').innerText = d.data.attributes.players;
    });
}

function initChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Live Users', data: [], borderColor: '#00ff41', borderWidth: 2, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { display: false } } }
    });
}

function addDataToChart(val) {
    if(!chart) return;
    const now = new Date().toLocaleTimeString();
    if(chart.data.labels.length > 20) { chart.data.labels.shift(); chart.data.datasets[0].data.shift(); }
    chart.data.labels.push(now); chart.data.datasets[0].data.push(val); chart.update();
}