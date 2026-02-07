// assets/js/ui.js

// 1. ПОДСВЕТКА МЕНЮ
document.querySelectorAll('.nav a').forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
});

// 2. КНОПКА НАВЕРХ
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.id = 'scrollTopBtn'; btn.innerHTML = '▲'; btn.title = "Наверх";
    document.body.appendChild(btn);
    window.onscroll = function() { btn.style.display = (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) ? "block" : "none"; };
    btn.onclick = function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };
});

// 3. МОБИЛЬНОЕ МЕНЮ
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const btn = document.querySelector('.mobile-menu-btn');
    nav.classList.toggle('active'); btn.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
}

// 4. МОДАЛЬНЫЕ ОКНА
function openModal(id) { const m = document.getElementById(id); if(m){ m.classList.add('active'); document.body.style.overflow = 'hidden'; }}
function closeModal(id) { const m = document.getElementById(id); if(m){ m.classList.remove('active'); document.body.style.overflow = 'auto'; }}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active')); document.body.style.overflow = 'auto'; }});

// 5. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement; 
    if (localStorage.getItem('site_theme') === 'light') html.setAttribute('data-theme', 'light');
    if (toggleBtn) toggleBtn.addEventListener('click', () => {
        if (html.getAttribute('data-theme') === 'light') { html.removeAttribute('data-theme'); localStorage.setItem('site_theme', 'dark'); }
        else { html.setAttribute('data-theme', 'light'); localStorage.setItem('site_theme', 'light'); }
    });
});

// --- SOCKET.IO SYNC (REAL-TIME) ---
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, подключена ли библиотека
    if (typeof io === 'undefined') return;

    const socket = io(); // Соединяемся с сервером

    // 1. Инициализация (получаем текущее состояние при входе)
    socket.on('init_state', (state) => {
        updateTickerUI(state.ticker);
        applyAtmosphere(state.atmosphere);
        if (state.maintenance) showMaintenanceScreen();
    });

    // 2. Слушаем обновления
    socket.on('ticker_update', (text) => updateTickerUI(text));
    socket.on('atmosphere_update', (mode) => applyAtmosphere(mode));
    
    socket.on('maintenance_update', (isActive) => {
        if (isActive) showMaintenanceScreen();
        else removeMaintenanceScreen();
    });

    socket.on('global_alert', (text) => showGlobalAlert(text));
});

// Вспомогательная функция для тикера
function updateTickerUI(text) {
    const t = document.querySelector('.ticker-content');
    if (t && text) {
        t.innerHTML = Array(4).fill(`<span class="ticker-item">⚡ <b>SYSTEM MESSAGE:</b> ${text}</span>`).join('');
    }
}

// (Функции showMaintenanceScreen, showGlobalAlert и applyAtmosphere оставляем как были)

// ФУНКЦИИ UI
function showMaintenanceScreen() {
    if (document.getElementById('m-overlay')) return;
    const d = document.createElement('div'); d.id = 'm-overlay';
    d.innerHTML = `<div style="text-align:center;color:#ff3333;"><h1 style="font-family:'Orbitron';font-size:3rem;">SYSTEM LOCKED</h1><p style="font-family:'Rajdhani';font-size:1.5rem;color:#fff;">ВЕДУТСЯ ТЕХРАБОТЫ</p><div class="loader-ring" style="margin:30px auto;"></div></div>`;
    d.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#050505;z-index:999999;display:flex;justify-content:center;align-items:center;";
    document.body.appendChild(d); document.body.style.overflow = 'hidden';
}
function removeMaintenanceScreen() { const s = document.getElementById('m-overlay'); if(s) { s.remove(); document.body.style.overflow = 'auto'; } }

function showGlobalAlert(msg) {
    const d = document.createElement('div'); d.className = 'global-alert-popup';
    d.innerHTML = `<div class="alert-icon">⚠️</div><div><h3>ВНИМАНИЕ / ATTENTION</h3><p>${msg}</p></div><button onclick="this.parentElement.remove()">OK</button>`;
    document.body.appendChild(d);
    try { new Audio('assets/audio/hover.mp3').play(); } catch(e){}
    setTimeout(() => { if(d) d.remove(); }, 10000);
}

function applyAtmosphere(mode) {
    const b = document.body;
    b.classList.remove('mode-red-alert', 'mode-toxic', 'mode-glitch');
    if (mode !== 'default') b.classList.add(`mode-${mode}`);
}
// --- USER AUTH SYSTEM ---
document.addEventListener('DOMContentLoaded', () => {
    checkUserLogin();
});

async function checkUserLogin() {
    try {
        const res = await fetch('/api/user');
        const data = await res.json();
        const container = document.getElementById('user-profile');

        if (data.loggedIn && container) {
            const u = data.user;
            // Рисуем мини-профиль
            container.innerHTML = `
                <div class="user-mini-card" onclick="location.href='/profile.html'"> <img src="${u.avatar}" class="user-avatar">
                    <div class="user-info">
                        <span class="user-name">${u.displayName}</span>
                        <span class="user-balance">${u.balance} COINS</span>
                    </div>
                </div>
                <a href="/logout" style="margin-left:5px; color:#666; font-size:0.8rem; text-decoration:none;">✖</a>
            `;
        }
    } catch (e) { console.error("Auth check failed", e); }
}