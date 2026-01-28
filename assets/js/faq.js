// assets/js/faq.js

document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentNode;
            const answer = item.querySelector('.faq-answer');

            // Проверяем, открыт ли этот вопрос
            const isActive = item.classList.contains('active');

            // (Опционально) Закрываем все остальные вопросы перед открытием нового
            closeAllFaq();

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px"; // Плавно открываем
            }
        });
    });

    function closeAllFaq() {
        const items = document.querySelectorAll('.faq-item');
        items.forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.maxHeight = null;
        });
    }
});