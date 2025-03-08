document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Получаем сохраненные данные магазина
    const savedStoreData = localStorage.getItem('storeData');
    const form = document.querySelector('.store-form');
    
    // Если есть сохраненные данные, заполняем форму
    if (savedStoreData) {
        const storeData = JSON.parse(savedStoreData);
        form.querySelector('input[type="text"]').value = storeData.name || '';
        form.querySelector('input[type="tel"]').value = storeData.phone || '';
        form.querySelector('input[type="email"]').value = storeData.email || '';
        
        // Если есть сохраненное лого
        if (storeData.logo) {
            const uploadBtn = form.querySelector('.upload-btn');
            uploadBtn.innerHTML = `
                <img src="${storeData.logo}" alt="Лого магазина" style="width: 100%; height: 300px; object-fit: contain; border-radius: 8px;">
                <span class="file-size">Загружено</span>
            `;
        }
    }

    // Обработка загрузки изображения
    const uploadBtn = document.querySelector('.upload-btn');
    let selectedFile = null;

    uploadBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 1024 * 1024) { // 1MB
                    alert('Файл слишком большой. Максимальный размер 1МБ');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    selectedFile = e.target.result;
                    uploadBtn.innerHTML = `
                        <img src="${selectedFile}" alt="Лого магазина" style="width: 100%; height: 300px; object-fit: contain; border-radius: 8px;">
                        <span class="file-size">Загружено</span>
                    `;
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });

    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const storeData = {
            name: form.querySelector('input[type="text"]').value,
            phone: form.querySelector('input[type="tel"]').value,
            email: form.querySelector('input[type="email"]').value,
            logo: selectedFile || (savedStoreData ? JSON.parse(savedStoreData).logo : null)
        };

        // Сохраняем данные в localStorage
        localStorage.setItem('storeData', JSON.stringify(storeData));

        // Показываем уведомление
        const notification = document.getElementById('notification');
        notification.classList.add('show');
        
        // Через 2 секунды переходим на главную страницу
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
});

// Функция сохранения данных о магазине
function saveStoreData(logoUrl) {
    const storeData = {
        name: document.querySelector('.form-group:nth-child(1) input').value || 'Магазин',
        logoUrl: logoUrl,
        phone: document.querySelector('.form-group:nth-child(3) input').value || '',
        email: document.querySelector('.form-group:nth-child(4) input').value || '',
        createdAt: new Date().toISOString() // Добавляем дату создания
    };

    localStorage.setItem('storeData', JSON.stringify(storeData));
}

// Функция получения сохраненных данных о магазине
function getStoreData() {
    try {
        const storeData = localStorage.getItem('storeData');
        return storeData ? JSON.parse(storeData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о магазине:', e);
        return null;
    }
}

// Функция заполнения формы сохраненными данными
function fillFormWithSavedData(data) {
    if (data.name) {
        document.querySelector('.form-group:nth-child(1) input').value = data.name;
    }
    
    if (data.logoUrl) {
        const uploadBtn = document.querySelector('.upload-btn');
        if (uploadBtn) {
            uploadBtn.innerHTML = `
                <img src="${data.logoUrl}" alt="Превью" style="width: 100%; height: 300px; object-fit: contain; border-radius: 8px;">
                <span>Фото загружено</span>
                <span class="file-size">Нажмите чтобы изменить</span>
            `;
        }
    }
    
    if (data.phone) {
        document.querySelector('.form-group:nth-child(3) input').value = data.phone;
    }
    
    if (data.email) {
        document.querySelector('.form-group:nth-child(4) input').value = data.email;
    }
} 
