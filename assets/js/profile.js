// assets/js/profile.js

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});

async function loadProfile() {
    try {
        const res = await fetch('/api/user');
        const data = await res.json();

        // Если не вошел - отправляем на главную
        if (!data.loggedIn) {
            window.location.href = '/';
            return;
        }

        const u = data.user;

        // Заполняем данными
        document.getElementById('p-avatar').src = u.avatar;
        document.getElementById('p-name').innerText = u.displayName;
        document.getElementById('p-balance').innerText = u.balance + " ₮";
        document.getElementById('p-steamid').innerText = u.steamId;
        
        // Роль и Кнопка Админа
        const roleElem = document.getElementById('p-role');
        roleElem.innerText = u.role.toUpperCase();

        if (u.role === 'admin') {
            roleElem.style.color = '#ff3333';
            roleElem.style.borderColor = '#ff3333';
            
            // ПОКАЗЫВАЕМ КНОПКУ
            const btn = document.getElementById('admin-entry-btn');
            if(btn) btn.style.display = 'block';
        }

        // Даты
        document.getElementById('p-regdate').innerText = new Date(u.firstLogin).toLocaleDateString('ru-RU');
        document.getElementById('p-lastlogin').innerText = new Date(u.lastLogin).toLocaleString('ru-RU');

    } catch (err) {
        console.error("Ошибка профиля:", err);
    }
}

function copySteamID() {
    const id = document.getElementById('p-steamid').innerText;
    navigator.clipboard.writeText(id).then(() => alert("SteamID скопирован!"));
}