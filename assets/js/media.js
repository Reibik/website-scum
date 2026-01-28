// assets/js/media.js

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    // Открытие фото
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            const src = img.getAttribute('src');
            
            // Ставим картинку в лайтбокс
            // (В идеале тут можно подменять на HD версию, если есть data-full атрибут)
            lightboxImg.src = src;
            
            // Показываем окно
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку сайта
        });
    });

    // Закрытие по крестику
    closeBtn.addEventListener('click', () => {
        closeGallery();
    });

    // Закрытие по клику на фон
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeGallery();
        }
    });

    // Закрытие по клавише ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && lightbox.style.display === 'flex') {
            closeGallery();
        }
    });

    function closeGallery() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Возвращаем прокрутку
    }
});