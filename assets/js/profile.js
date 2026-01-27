const user = {
    username: 'Player123',
    status: 'PREMIUM',
    donate: 'PREMIUM',
    balance: 1200,
    history: [
        'PREMIUM — 499 ₽',
        'STARTER — 199 ₽'
    ]
};

document.getElementById('username').textContent = user.username;
document.getElementById('status').textContent = user.status;
document.getElementById('donate').textContent = user.donate;
document.getElementById('balance').textContent = user.balance;

const history = document.getElementById('history');
user.history.forEach(h => {
    const div = document.createElement('div');
    div.textContent = h;
    history.appendChild(div);
});
