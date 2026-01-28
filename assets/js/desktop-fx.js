// assets/js/desktop-fx.js

if (window.innerWidth > 992) {
    // Этот код сработает только на ПК
    
    document.addEventListener('mousemove', (e) => {
        document.querySelectorAll('.server-card, .donate-card, .feature-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Проверяем, что мышка над карточкой
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Вычисляем угол наклона (максимум 10 градусов)
                const rotateX = ((y - centerY) / centerY) * -5; 
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            } else {
                // Возвращаем в исходное положение, когда мышь ушла
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            }
        });
    });
}