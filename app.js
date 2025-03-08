// Инициализация Telegram WebApp
document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
    
    // Загрузка информации о магазине
    const storeData = localStorage.getItem('storeData');
    if (storeData) {
        const store = JSON.parse(storeData);
        const storeName = document.getElementById('storeName');
        const storeLogo = document.getElementById('storeLogo');
        
        if (storeName && store.name) {
            storeName.textContent = store.name;
        }
        
        if (storeLogo && store.logo) {
            storeLogo.src = store.logo;
        }
    }
    
    // Обновляем счетчик заявок
    updateApplicationsCount();
    
    // Обработчик для кнопки добавления заявки
    const addRequestBlock = document.querySelector('.add-request');
    if (addRequestBlock) {
        addRequestBlock.addEventListener('click', function() {
            // Всегда перенаправляем на страницу получения кода доступа
            window.location.href = 'access.html';
        });
    }
    
    // Обработчик для блока "Заявки"
    const applicationsLink = document.querySelector('.section-link');
    if (applicationsLink) {
        applicationsLink.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем стандартное поведение ссылки
            window.location.href = 'application.html'; // Переходим на страницу заявок
        });
    }
});

// Функция для обновления счетчика заявок
function updateApplicationsCount() {
    const applicationsCountElement = document.getElementById('applications-count');
    if (!applicationsCountElement) return;
    
    // Получаем данные о заявках из localStorage
    let applicationsCount = 0;
    
    try {
        // Проверяем наличие заявок в localStorage
        const productData = localStorage.getItem('productData');
        const requirementsData = localStorage.getItem('requirementsData');
        
        // Если есть данные о товаре и требованиях, считаем это одной заявкой
        if (productData && requirementsData) {
            applicationsCount = 1;
        }
        
        // Обновляем счетчик на странице
        applicationsCountElement.textContent = applicationsCount;
        
        // Также обновляем счетчик в уведомлениях, если он есть
        const notificationCount = document.querySelector('.notification-count');
        if (notificationCount) {
            notificationCount.textContent = applicationsCount;
        }
    } catch (e) {
        console.error('Ошибка при обновлении счетчика заявок:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const menuDrawer = document.querySelector('.menu-drawer');
    const closeBtn = document.querySelector('.menu-close-btn');
    const expandableItems = document.querySelectorAll('.menu-item.expandable');

    menuBtn.addEventListener('click', () => {
        menuDrawer.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        menuDrawer.classList.remove('open');
    });

    expandableItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
            const submenu = item.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                submenu.classList.toggle('open');
            }
        });
    });
}); 
