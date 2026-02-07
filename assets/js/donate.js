// assets/js/donate.js

let allProducts = [];
let selectedProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// 1. ЗАГРУЗКА ТОВАРОВ
async function loadProducts() {
    const grid = document.getElementById('shop-grid');
    try {
        const res = await fetch('/api/products');
        allProducts = await res.json();
        renderProducts(allProducts);
    } catch (err) {
        grid.innerHTML = '<p style="color:red; text-align:center;">Ошибка загрузки магазина</p>';
    }
}

// 2. ОТРИСОВКА (RENDER)
function renderProducts(products) {
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = "";

    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color:#666; width:100%;">Товаров пока нет.</p>';
        return;
    }

    products.forEach(p => {
        // Заглушка, если нет картинки
        const img = p.image || 'assets/img/default_item.png';
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-box">
                <img src="${img}" onerror="this.src='https://via.placeholder.com/200?text=NO+IMAGE'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <div class="product-price">${p.price} ₮</div>
                <button class="buy-btn" onclick="openBuyModal('${p._id}')">КУПИТЬ</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. ФИЛЬТРАЦИЯ
function filterShop(category) {
    // Подсветка кнопок
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// 4. МОДАЛЬНОЕ ОКНО
function openBuyModal(id) {
    selectedProduct = allProducts.find(p => p._id === id);
    if (!selectedProduct) return;

    document.getElementById('modal-img').src = selectedProduct.image || 'https://via.placeholder.com/100';
    document.getElementById('modal-title').innerText = selectedProduct.name;
    document.getElementById('modal-price').innerText = selectedProduct.price + " ₮";
    
    document.getElementById('buy-modal').classList.add('active');
}

function closeBuyModal() {
    document.getElementById('buy-modal').classList.remove('active');
    selectedProduct = null;
}

// 5. ПОКУПКА
document.getElementById('confirm-buy-btn').addEventListener('click', async () => {
    if (!selectedProduct) return;

    const btn = document.getElementById('confirm-buy-btn');
    btn.innerText = "ОБРАБОТКА...";
    btn.disabled = true;

    try {
        const res = await fetch('/api/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: selectedProduct._id })
        });

        const result = await res.json();

        if (res.ok) {
            alert("✅ УСПЕХ: " + result.message);
            closeBuyModal();
            location.reload(); // Перезагрузить, чтобы обновить баланс
        } else {
            alert("❌ ОШИБКА: " + result.error);
            // Если ошибка "Войдите", перекинем на вход
            if (res.status === 401) window.location.href = '/auth/steam';
        }

    } catch (err) {
        alert("Ошибка сети");
    } finally {
        btn.innerText = "КУПИТЬ";
        btn.disabled = false;
    }
});