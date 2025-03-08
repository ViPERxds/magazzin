document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Обработчик для кнопки "Назад"
    const backButton = document.querySelector('.back-link');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Сохраняем текущие данные перед возвратом
            saveRequirementsData();
            // Возвращаемся на страницу товара
            window.location.href = 'add-request.html';
        });
    }

    // Логика переключения шагов
    const steps = document.querySelectorAll('.tab-btn');
    const progressFill = document.querySelector('.progress-fill');
    let currentStep = 1; // Второй шаг (Требования)

    // Инициализация прогресса для второго шага
    updateProgress(currentStep);

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Определяем URL для каждого шага
            const urls = [
                'add-request.html',  // Товар
                'requirements.html', // Требования
                'tz.html',          // ТЗ
                'base.html'         // Готово
            ];

            // Переходим на соответствующую страницу
            if (!step.classList.contains('active')) {
                window.location.href = urls[index];
            }
        });
    });

    function updateProgress(step) {
        // Вычисляем процент заполнения (25% за каждый шаг)
        const progressPercentage = (step + 1) * 25;
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }

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

    // Получаем сохраненные данные, если они есть
    const savedRequirementsData = getRequirementsData();
    
    // Заполняем форму сохраненными данными
    if (savedRequirementsData) {
        fillFormWithSavedData(savedRequirementsData);
    }

    // Обработчики для раскрытия/скрытия блоков соцсетей
    const socialHeaders = document.querySelectorAll('.social-header');
    socialHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('open');
        });
    });

    // Обработчики для чекбоксов "Неважно"
    const unimportantCheckboxes = document.querySelectorAll('.unimportant input[type="checkbox"]');
    unimportantCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const statsInput = this.closest('.stats-group').querySelector('.stats-input');
            statsInput.disabled = this.checked;
        });
    });

    // Обработчики для кнопок опций (да/нет)
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parent = this.closest('.option-buttons');
            parent.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Показываем/скрываем поля для условий доплаты
            if (this.closest('.reward-option') && this.closest('.reward-option').querySelector('h3').textContent.includes('Доплата при условии')) {
                const conditionFields = document.querySelector('.condition-fields');
                if (conditionFields) {
                    conditionFields.style.display = this.dataset.value === 'yes' ? 'block' : 'none';
                }
            }
            
            // Сохраняем данные при каждом клике на кнопку
            saveRequirementsData();
        });
    });

    // Обработчик кнопки "Добавить ТЗ"
    const addTzBtn = document.querySelector('.add-tz-btn');
    if (addTzBtn) {
        addTzBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveRequirementsData();
            window.location.href = 'tz.html';
        });
    }

    // Обработчики для полей доплаты
    const bonusAmountInput = document.querySelector('.condition-fields .input-group:nth-child(2) .condition-input');
    const bonusConditionInput = document.querySelector('.condition-fields .input-group:nth-child(1) .condition-input');

    if (bonusAmountInput) {
        bonusAmountInput.addEventListener('input', saveRequirementsData);
    }
    if (bonusConditionInput) {
        bonusConditionInput.addEventListener('input', saveRequirementsData);
    }

    // Обработчик для поля вознаграждения
    const rewardInput = document.querySelector('.reward-input');
    if (rewardInput) {
        rewardInput.addEventListener('input', saveRequirementsData);
    }

    // Функции для работы с поп-апами
    function showPopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function hidePopup(popup) {
        popup.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Обработчики для всех поп-апов
    document.querySelectorAll('.popup-overlay').forEach(popup => {
        // Закрытие по клику на крестик
        const closeBtn = popup.querySelector('.popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hidePopup(popup));
        }

        // Закрытие по клику на кнопку "Понятно"
        const okBtn = popup.querySelector('.popup-button');
        if (okBtn) {
            okBtn.addEventListener('click', () => hidePopup(popup));
        }

        // Закрытие по клику вне контента
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                hidePopup(popup);
            }
        });
    });

    // Обработчики для иконок вопросов
    const infoIcons = document.querySelectorAll('.info-icon');
    infoIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const option = this.closest('.reward-option');
            if (option) {
                const title = option.querySelector('h3').textContent.trim();
                
                // Определяем какой поп-ап показать
                switch(true) {
                    case title.includes('Доплата при условии'):
                        showPopup('bonusPopup');
                        break;
                    case title.includes('Выкуп по ключу'):
                        showPopup('keyPurchasePopup');
                        break;
                    case title.includes('Возможен возврат'):
                        showPopup('returnPolicyPopup');
                        break;
                    case title.includes('Нужен отзыв'):
                        showPopup('reviewPopup');
                        break;
                }
            }
        });
    });

    // Обработчик для кнопки "Как посчитать требования"
    const requirementsHintBtn = document.querySelector('.requirements-hint');
    if (requirementsHintBtn) {
        requirementsHintBtn.addEventListener('click', () => {
            showPopup('requirementsHintPopup');
        });
    }

    // Обработчики для ссылок "Что это?"
    const whatIsItLinks = document.querySelectorAll('.what-is-it');
    whatIsItLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const option = this.closest('.reward-option');
            if (option) {
                const title = option.querySelector('h3').textContent.trim();
                
                // Определяем какой поп-ап показать
                switch(true) {
                    case title.includes('Доплата при условии'):
                        showPopup('bonusPopup');
                        break;
                    case title.includes('Выкуп по ключу'):
                        showPopup('keyPurchasePopup');
                        break;
                    case title.includes('Возможен возврат'):
                        showPopup('returnPolicyPopup');
                        break;
                    case title.includes('Нужен отзыв'):
                        showPopup('reviewPopup');
                        break;
                }
            }
        });
    });
});

// Функция сохранения данных о требованиях
function saveRequirementsData() {
    const requirementsData = {
        socialRequirements: {
            instagram: {},
            telegram: {},
            tiktok: {},
            vk: {},
            youtube: {}
        }
    };

    // Собираем данные по Instagram
    const instagramBlock = document.querySelector('.social-header[data-network="instagram"]')?.closest('.social-network-block');
    if (instagramBlock) {
        const poolInput = instagramBlock.querySelector('.stats-group:nth-child(1) .stats-input');
        const reelsInput = instagramBlock.querySelector('.stats-group:nth-child(2) .stats-input');
        const storiesInput = instagramBlock.querySelector('.stats-group:nth-child(3) .stats-input');
        
        const poolUnimportant = instagramBlock.querySelector('#instagram-followers-unimportant');
        const reelsUnimportant = instagramBlock.querySelector('#instagram-reels-unimportant');
        const storiesUnimportant = instagramBlock.querySelector('#instagram-stories-unimportant');

        if (poolInput && !poolUnimportant?.checked && poolInput.value) {
            requirementsData.socialRequirements.instagram.followers = poolInput.value;
        }
        if (reelsInput && !reelsUnimportant?.checked && reelsInput.value) {
            requirementsData.socialRequirements.instagram.reels = reelsInput.value;
        }
        if (storiesInput && !storiesUnimportant?.checked && storiesInput.value) {
            requirementsData.socialRequirements.instagram.stories = storiesInput.value;
        }
    }

    // Собираем данные о вознаграждении
    const rewardInput = document.querySelector('.reward-input');
    if (rewardInput && rewardInput.value) {
        requirementsData.rewardPrice = rewardInput.value;
    }

    // Находим все reward-option блоки
    const rewardOptions = document.querySelectorAll('.reward-option');
    rewardOptions.forEach(option => {
        const title = option.querySelector('h3')?.textContent.trim();
        const activeBtn = option.querySelector('.option-btn.active');
        
        if (!title || !activeBtn) return;

        const isYes = activeBtn.dataset.value === 'yes';

        // Доплата при условии
        if (title.includes('Доплата при условии')) {
            requirementsData.bonusEnabled = isYes;
            if (isYes) {
                const bonusAmountInput = document.querySelector('.condition-fields .input-group:nth-child(2) .condition-input');
                const bonusConditionInput = document.querySelector('.condition-fields .input-group:nth-child(1) .condition-input');
                
                if (bonusAmountInput?.value) {
                    requirementsData.bonusAmount = bonusAmountInput.value;
                }
                if (bonusConditionInput?.value) {
                    requirementsData.bonusCondition = bonusConditionInput.value;
                }
            }
        }
        // Выкуп по ключу
        else if (title.includes('Выкуп по ключу')) {
            requirementsData.keyPurchase = isYes ? 'Да' : 'Нет';
        }
        // Возможен возврат
        else if (title.includes('Возможен возврат')) {
            requirementsData.returnPolicy = isYes ? 'Да' : 'Нет';
        }
        // Нужен отзыв
        else if (title.includes('Нужен отзыв')) {
            requirementsData.reviewType = isYes ? 'Да, с фото' : 'Нет';
        }
    });

    // Тип оплаты всегда "Сразу"
    requirementsData.paymentType = 'Сразу';

    // Сохраняем данные
    localStorage.setItem('requirementsData', JSON.stringify(requirementsData));
    console.log('Сохранены данные о требованиях:', requirementsData);
}

// Функция получения данных по соцсети
function getSocialNetworkData(network) {
    const networkBlock = document.querySelector(`.social-header[data-network="${network}"]`).closest('.social-network-block');
    if (!networkBlock) return null;
    
    const fields = networkBlock.querySelector('.network-fields');
    if (!fields) return null;
    
    const data = {};
    
    // Получаем данные о подписчиках
    const followersInput = fields.querySelector('.stats-group:nth-child(1) .stats-input');
    const followersUnimportant = fields.querySelector('#' + network + '-followers-unimportant');
    
    if (followersInput && !followersInput.disabled) {
        data.followers = followersInput.value;
    }
    
    // Получаем данные о просмотрах (разные для разных соцсетей)
    if (network === 'instagram') {
        const reelsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
        const storiesInput = fields.querySelector('.stats-group:nth-child(3) .stats-input');
        
        if (reelsInput && !reelsInput.disabled) {
            data.reels = reelsInput.value;
        }
        
        if (storiesInput && !storiesInput.disabled) {
            data.stories = storiesInput.value;
        }
    } else if (network === 'telegram' || network === 'vk') {
        const viewsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
        
        if (viewsInput && !viewsInput.disabled) {
            data.views = viewsInput.value;
        }
    } else if (network === 'tiktok') {
        const viewsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
        
        if (viewsInput && !viewsInput.disabled) {
            data.views = viewsInput.value;
        }
    } else if (network === 'youtube') {
        const shortsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
        
        if (shortsInput && !shortsInput.disabled) {
            data.shorts = shortsInput.value;
        }
    }
    
    return Object.keys(data).length > 0 ? data : null;
}

// Функция получения значения опции (да/нет)
function getOptionValue(optionTitle) {
    const optionBlock = Array.from(document.querySelectorAll('.reward-option')).find(block => 
        block.querySelector('h3').textContent.includes(optionTitle)
    );
    
    if (!optionBlock) return null;
    
    const activeButton = optionBlock.querySelector('.option-btn.active');
    return activeButton ? activeButton.dataset.value === 'yes' ? 'Да' : 'Нет' : null;
}

// Функция получения типа отзыва
function getReviewType() {
    const reviewOption = Array.from(document.querySelectorAll('.reward-option')).find(block => 
        block.querySelector('h3').textContent.includes('Нужен отзыв?')
    );
    
    if (!reviewOption) return 'Нет';
    
    const activeButton = reviewOption.querySelector('.option-btn.active');
    return activeButton && activeButton.dataset.value === 'yes' ? 'Да, с фото' : 'Нет';
}

// Функция получения суммы доплаты
function getConditionAmount() {
    const conditionFields = document.querySelector('.condition-fields');
    if (!conditionFields || conditionFields.style.display === 'none') return null;
    
    const amountInput = conditionFields.querySelector('.input-group:nth-child(2) .condition-input');
    return amountInput ? amountInput.value : null;
}

// Функция получения текста условия
function getConditionText() {
    const conditionFields = document.querySelector('.condition-fields');
    if (!conditionFields || conditionFields.style.display === 'none') return null;
    
    const conditionInput = conditionFields.querySelector('.input-group:nth-child(1) .condition-input');
    return conditionInput ? conditionInput.value : null;
}

// Функция получения сохраненных данных о требованиях
function getRequirementsData() {
    try {
        const requirementsData = localStorage.getItem('requirementsData');
        return requirementsData ? JSON.parse(requirementsData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о требованиях:', e);
        return null;
    }
}

// Функция заполнения формы сохраненными данными
function fillFormWithSavedData(data) {
    // Заполняем данные по соцсетям
    if (data.socialRequirements) {
        fillSocialNetworkData('instagram', data.socialRequirements.instagram);
        fillSocialNetworkData('telegram', data.socialRequirements.telegram);
        fillSocialNetworkData('tiktok', data.socialRequirements.tiktok);
        fillSocialNetworkData('vk', data.socialRequirements.vk);
        fillSocialNetworkData('youtube', data.socialRequirements.youtube);
    }
    
    // Заполняем данные о вознаграждении
    if (data.rewardPrice) {
        document.querySelector('.reward-input').value = data.rewardPrice;
    }
    
    // Заполняем данные о доплате
    if (data.bonusAmount && data.bonusCondition) {
        // Активируем опцию "Да" для доплаты
        const bonusOption = Array.from(document.querySelectorAll('.reward-option')).find(block => 
            block.querySelector('h3').textContent.includes('Доплата при условии')
        );
        
        if (bonusOption) {
            const yesButton = bonusOption.querySelector('.option-btn[data-value="yes"]');
            if (yesButton) {
                yesButton.click();
            }
        }
        
        // Заполняем поля доплаты
        const conditionFields = document.querySelector('.condition-fields');
        if (conditionFields) {
            const conditionInput = conditionFields.querySelector('.input-group:nth-child(1) .condition-input');
            const amountInput = conditionFields.querySelector('.input-group:nth-child(2) .condition-input');
            
            if (conditionInput) conditionInput.value = data.bonusCondition;
            if (amountInput) amountInput.value = data.bonusAmount;
        }
    }
    
    // Заполняем опции
    setOptionValue('Выкуп по ключу', data.keyPurchase);
    setOptionValue('Возможен возврат?', data.returnPolicy);
    setOptionValue('Нужен отзыв?', data.reviewType === 'Да, с фото' ? 'Да' : 'Нет');
}

// Функция заполнения данных по соцсети
function fillSocialNetworkData(network, data) {
    if (!data) return;
    
    const networkBlock = document.querySelector(`.social-header[data-network="${network}"]`).closest('.social-network-block');
    if (!networkBlock) return;
    
    // Открываем блок соцсети
    const header = networkBlock.querySelector('.social-header');
    if (header && !header.classList.contains('open')) {
        header.click();
    }
    
    const fields = networkBlock.querySelector('.network-fields');
    if (!fields) return;
    
    // Заполняем данные о подписчиках
    if (data.followers) {
        const followersInput = fields.querySelector('.stats-group:nth-child(1) .stats-input');
        if (followersInput) followersInput.value = data.followers;
    }
    
    // Заполняем данные о просмотрах (разные для разных соцсетей)
    if (network === 'instagram') {
        if (data.reels) {
            const reelsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
            if (reelsInput) reelsInput.value = data.reels;
        }
        
        if (data.stories) {
            const storiesInput = fields.querySelector('.stats-group:nth-child(3) .stats-input');
            if (storiesInput) storiesInput.value = data.stories;
        }
    } else if (network === 'telegram' || network === 'vk' || network === 'tiktok') {
        if (data.views) {
            const viewsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
            if (viewsInput) viewsInput.value = data.views;
        }
    } else if (network === 'youtube') {
        if (data.shorts) {
            const shortsInput = fields.querySelector('.stats-group:nth-child(2) .stats-input');
            if (shortsInput) shortsInput.value = data.shorts;
        }
    }
}

// Функция установки значения опции (да/нет)
function setOptionValue(optionTitle, value) {
    if (!value) return;
    
    const optionBlock = Array.from(document.querySelectorAll('.reward-option')).find(block => 
        block.querySelector('h3').textContent.includes(optionTitle)
    );
    
    if (!optionBlock) return;
    
    const buttonValue = value === 'Да' ? 'yes' : 'no';
    const button = optionBlock.querySelector(`.option-btn[data-value="${buttonValue}"]`);
    
    if (button) {
        button.click();
    }
} 