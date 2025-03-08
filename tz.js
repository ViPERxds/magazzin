document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Получаем элементы формы
    const tzTextarea = document.querySelector('.tz-textarea');
    const submitBtn = document.querySelector('.submit-btn');

    // Проверяем, есть ли сохраненное ТЗ в localStorage
    const savedTz = localStorage.getItem('tzContent');
    if (savedTz) {
        tzTextarea.value = savedTz;
    }

    // Обработчик нажатия кнопки "Далее"
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Сохраняем текст ТЗ в localStorage
            if (tzTextarea && tzTextarea.value.trim() !== '') {
                localStorage.setItem('tzContent', tzTextarea.value.trim());
                console.log('ТЗ сохранено в localStorage:', tzTextarea.value.trim());
            } else {
                // Если поле пустое, сохраняем пример текста
                const defaultTz = "Обучающий курс от компании поможет раскрыть весь потенциал и пользу от продукта благодаря персональной подборке и подробной инструкции по использованию.";
                localStorage.setItem('tzContent', defaultTz);
                console.log('Сохранен пример ТЗ в localStorage');
            }
            
            // Переходим на страницу предпросмотра
            window.location.href = 'base.html';
        });
    }

    // Получаем сохраненные данные, если они есть
    const savedTzData = getTzData();
    
    // Заполняем форму сохраненными данными
    if (savedTzData) {
        fillFormWithSavedData(savedTzData);
    }

    // Обработчик для кнопки "Предпросмотр"
    const previewBtn = document.querySelector('.preview-btn');
    if (previewBtn) {
        previewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveTzData();
            window.location.href = 'preview.html';
        });
    }

    // Обработчик для кнопки "Назад"
    const backButton = document.querySelector('.back-link');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Сохраняем текущее ТЗ перед возвратом
            const tzContent = document.querySelector('.tz-textarea').value;
            if (tzContent.trim()) {
                localStorage.setItem('tzContent', tzContent.trim());
            }
            // Возвращаемся на страницу требований
            window.location.href = 'requirements.html';
        });
    }

    // Обработчик для текстовых полей
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        // Автоматическое изменение высоты текстового поля
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            
            // Проверка заполненности поля
            if (this.value.trim() !== '') {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
        
        // Инициализация высоты при загрузке
        if (textarea.value.trim() !== '') {
            textarea.classList.add('filled');
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        }
    });

    const steps = document.querySelectorAll('.step-btn');
    const progressFill = document.querySelector('.progress-fill');
    let currentStep = 2; // Третий шаг

    // Инициализация прогресса для третьего шага
    updateProgress(currentStep);

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Определяем URL для каждого шага
            const urls = [
                'add-request.html',
                'requirements.html',
                'tz.html',
                'base.html'
            ];

            // Переходим на соответствующую страницу
            window.location.href = urls[index];
        });
    });

    function updateProgress(step) {
        // Вычисляем процент заполнения (25% за каждый шаг)
        const progressPercentage = (step + 1) * 25;
        progressFill.style.width = `${progressPercentage}%`;

        // Обновляем состояния кнопок
        steps.forEach((s, i) => {
            if (i < step) {
                s.classList.add('completed');
                s.classList.remove('active');
            } else if (i === step) {
                s.classList.add('active');
                s.classList.remove('completed');
            } else {
                s.classList.remove('active', 'completed');
            }
        });
    }
});

// Функция сохранения данных ТЗ
function saveTzData() {
    const tzData = {
        // Данные о ТЗ
        contentRequirements: document.querySelector('#content-requirements').value,
        integrationRequirements: document.querySelector('#integration-requirements').value,
        additionalRequirements: document.querySelector('#additional-requirements').value
    };

    localStorage.setItem('tzData', JSON.stringify(tzData));
}

// Функция получения сохраненных данных ТЗ
function getTzData() {
    try {
        const tzData = localStorage.getItem('tzData');
        return tzData ? JSON.parse(tzData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных ТЗ:', e);
        return null;
    }
}

// Функция заполнения формы сохраненными данными
function fillFormWithSavedData(data) {
    // Заполняем поля ТЗ
    if (data.contentRequirements) {
        const contentField = document.querySelector('#content-requirements');
        if (contentField) {
            contentField.value = data.contentRequirements;
            contentField.classList.add('filled');
            contentField.style.height = 'auto';
            contentField.style.height = (contentField.scrollHeight) + 'px';
        }
    }
    
    if (data.integrationRequirements) {
        const integrationField = document.querySelector('#integration-requirements');
        if (integrationField) {
            integrationField.value = data.integrationRequirements;
            integrationField.classList.add('filled');
            integrationField.style.height = 'auto';
            integrationField.style.height = (integrationField.scrollHeight) + 'px';
        }
    }
    
    if (data.additionalRequirements) {
        const additionalField = document.querySelector('#additional-requirements');
        if (additionalField) {
            additionalField.value = data.additionalRequirements;
            additionalField.classList.add('filled');
            additionalField.style.height = 'auto';
            additionalField.style.height = (additionalField.scrollHeight) + 'px';
        }
    }
} 