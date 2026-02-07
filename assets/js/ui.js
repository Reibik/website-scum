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

// --- FIREBASE SYNC (ГЛАВНАЯ МАГИЯ) ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase === 'undefined') return;
    const db = firebase.database();

    // БЕГУЩАЯ СТРОКА
    const t = document.querySelector('.ticker-content');
    if (t) db.ref('settings/ticker').on('value', (s) => { const txt = s.val(); if(txt) t.innerHTML = Array(4).fill(`<span class="ticker-item">⚡ <b>SYSTEM MESSAGE:</b> ${txt}</span>`).join(''); });

    // ТЕХРАБОТЫ (Кроме админки)
    if (!window.location.pathname.includes('admin.html')) {
        db.ref('settings/maintenance').on('value', (s) => { if(s.val()) showMaintenanceScreen(); else removeMaintenanceScreen(); });
    }

    // АЛЕРТЫ
    db.ref('settings/alert').on('value', (s) => {
        const d = s.val();
        if (d && localStorage.getItem('last_alert_time') != d.timestamp) {
            showGlobalAlert(d.message); localStorage.setItem('last_alert_time', d.timestamp);
        }
    });

    // ВИЗУАЛЬНАЯ АТМОСФЕРА (НОВОЕ)
    db.ref('settings/atmosphere').on('value', (s) => {
        applyAtmosphere(s.val() || 'default');
    });
});

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