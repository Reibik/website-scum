function openModal() { document.getElementById('rulesModal').style.display = 'block'; }
function closeModal() { document.getElementById('rulesModal').style.display = 'none'; }
// Закрыть при клике вне окна
window.onclick = function(event) {
    if (event.target == document.getElementById('rulesModal')) {
        closeModal();
    }
}
document.querySelectorAll('.nav a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});
