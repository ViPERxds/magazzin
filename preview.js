document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Получаем все данные из localStorage
    const productData = getProductData();
    const requirementsData = getRequirementsData();
    const tzData = getTzData();
    const accessData = getAccessData();

    // Заполняем данные о товаре
    if (productData) {
        fillProductData(productData);
    }

    // Заполняем данные о требованиях
    if (requirementsData) {
        fillRequirementsData(requirementsData);
    }

    // Заполняем данные о ТЗ
    if (tzData) {
        fillTzData(tzData);
    }

    // Заполняем данные о магазине
    if (accessData) {
        fillStoreData(accessData);
    }

    // Обработчик для кнопки "Опубликовать"
    const publishBtn = document.querySelector('.publish-btn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            // Здесь будет логика публикации запроса
            alert('Запрос опубликован!');
            // После публикации можно очистить localStorage
            // localStorage.clear();
            // И перенаправить на главную страницу
            // window.location.href = 'index.html';
        });
    }

    // Обработчик для кнопки "Редактировать"
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            window.location.href = 'add-request.html';
        });
    }

    // Обработчики для дополнительных кнопок
    const additionalButtons = document.querySelectorAll('.additional-buttons button');
    additionalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            switch (action) {
                case 'become-blogger':
                    // Логика для "Хочу быть блогером"
                    alert('Переход на страницу регистрации блогера');
                    break;
                case 'help':
                    // Логика для "Есть вопрос? Нужна помощь?"
                    alert('Переход на страницу поддержки');
                    break;
                case 'suggest-idea':
                    // Логика для "Предложить идею"
                    alert('Переход на страницу предложения идей');
                    break;
                case 'cooperation':
                    // Логика для "Сотрудничество"
                    alert('Переход на страницу сотрудничества');
                    break;
            }
        });
    });
});

// Функция получения данных о товаре
function getProductData() {
    try {
        const productData = localStorage.getItem('productData');
        return productData ? JSON.parse(productData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о товаре:', e);
        return null;
    }
}

// Функция получения данных о требованиях
function getRequirementsData() {
    try {
        const requirementsData = localStorage.getItem('requirementsData');
        return requirementsData ? JSON.parse(requirementsData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о требованиях:', e);
        return null;
    }
}

// Функция получения данных о ТЗ
function getTzData() {
    try {
        const tzData = localStorage.getItem('tzData');
        return tzData ? JSON.parse(tzData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о ТЗ:', e);
        return null;
    }
}

// Функция получения данных о доступе
function getAccessData() {
    try {
        const accessData = localStorage.getItem('accessData');
        return accessData ? JSON.parse(accessData) : null;
    } catch (e) {
        console.error('Ошибка при получении данных о доступе:', e);
        return null;
    }
}

// Функция заполнения данных о товаре
function fillProductData(data) {
    // Заполняем название товара
    const productName = document.querySelector('.product-name');
    if (productName && data.name) {
        // Если название длинное, разбиваем на две строки
        if (data.name.length > 30) {
            const midPoint = Math.floor(data.name.length / 2);
            const breakPoint = data.name.lastIndexOf(' ', midPoint);
            const firstLine = data.name.substring(0, breakPoint);
            const secondLine = data.name.substring(breakPoint + 1);
            productName.innerHTML = firstLine + '<br>' + secondLine;
        } else {
            productName.textContent = data.name;
        }
    }

    // Заполняем изображение товара
    const productImage = document.querySelector('.product-image img');
    if (productImage && data.imageUrl) {
        productImage.src = data.imageUrl;
        productImage.alt = data.name || 'Товар';
    }

    // Заполняем цену товара
    const productPrice = document.querySelector('.product-price');
    if (productPrice && data.price) {
        productPrice.textContent = data.price + ' ₽';
    }

    // Заполняем маркетплейс
    const marketplace = document.querySelector('.marketplace');
    if (marketplace && data.marketplace) {
        marketplace.textContent = data.marketplace;
    }

    // Заполняем ссылку на товар
    const productLink = document.querySelector('.product-link');
    if (productLink && data.link) {
        productLink.href = data.link;
        productLink.textContent = 'Ссылка на товар';
    }
}

// Функция заполнения данных о требованиях
function fillRequirementsData(data) {
    // Заполняем требования к соцсетям
    if (data.socialRequirements) {
        const socialNetworks = ['instagram', 'telegram', 'tiktok', 'vk', 'youtube'];
        
        socialNetworks.forEach(network => {
            const networkData = data.socialRequirements[network];
            if (networkData) {
                // Находим или создаем вкладку для соцсети
                let tab = document.querySelector(`.social-tab[data-network="${network}"]`);
                
                if (!tab) {
                    const tabsContainer = document.querySelector('.social-tabs');
                    if (tabsContainer) {
                        tab = document.createElement('div');
                        tab.className = 'social-tab';
                        tab.dataset.network = network;
                        tab.textContent = getNetworkDisplayName(network);
                        tabsContainer.appendChild(tab);
                    }
                }
                
                // Находим или создаем контейнер для требований
                let requirementsList = document.querySelector('.requirements-list');
                if (!requirementsList) {
                    const requirementsBlock = document.querySelector('.requirements-block');
                    if (requirementsBlock) {
                        requirementsList = document.createElement('div');
                        requirementsList.className = 'requirements-list';
                        requirementsBlock.appendChild(requirementsList);
                    }
                }
                
                // Добавляем требования для соцсети
                if (requirementsList) {
                    // Очищаем список требований при первом заполнении
                    if (network === 'instagram') {
                        requirementsList.innerHTML = '';
                    }
                    
                    // Добавляем заголовок соцсети
                    const networkHeader = document.createElement('h4');
                    networkHeader.textContent = getNetworkDisplayName(network);
                    requirementsList.appendChild(networkHeader);
                    
                    // Добавляем требования
                    const requirementsUl = document.createElement('ul');
                    
                    // Подписчики
                    if (networkData.followers) {
                        const followersLi = document.createElement('li');
                        followersLi.textContent = `Подписчики: от ${networkData.followers}`;
                        requirementsUl.appendChild(followersLi);
                    }
                    
                    // Специфичные для соцсети требования
                    if (network === 'instagram') {
                        if (networkData.reels) {
                            const reelsLi = document.createElement('li');
                            reelsLi.textContent = `Просмотры Reels: от ${networkData.reels}`;
                            requirementsUl.appendChild(reelsLi);
                        }
                        if (networkData.stories) {
                            const storiesLi = document.createElement('li');
                            storiesLi.textContent = `Просмотры Stories: от ${networkData.stories}`;
                            requirementsUl.appendChild(storiesLi);
                        }
                    } else if (network === 'telegram' || network === 'vk' || network === 'tiktok') {
                        if (networkData.views) {
                            const viewsLi = document.createElement('li');
                            viewsLi.textContent = `Просмотры: от ${networkData.views}`;
                            requirementsUl.appendChild(viewsLi);
                        }
                    } else if (network === 'youtube') {
                        if (networkData.shorts) {
                            const shortsLi = document.createElement('li');
                            shortsLi.textContent = `Просмотры Shorts: от ${networkData.shorts}`;
                            requirementsUl.appendChild(shortsLi);
                        }
                    }
                    
                    requirementsList.appendChild(requirementsUl);
                }
            }
        });
    }
    
    // Заполняем данные о вознаграждении
    if (data.rewardPrice) {
        const rewardPrice = document.querySelector('.reward-price');
        if (rewardPrice) {
            rewardPrice.textContent = data.rewardPrice + ' ₽';
        }
    }
    
    // Заполняем данные о доплате
    if (data.bonusAmount && data.bonusCondition) {
        const bonusBlock = document.querySelector('.bonus-block');
        if (!bonusBlock) {
            const requirementsBlock = document.querySelector('.requirements-block');
            if (requirementsBlock) {
                const newBonusBlock = document.createElement('div');
                newBonusBlock.className = 'bonus-block';
                newBonusBlock.innerHTML = `
                    <h4>Доплата при условии:</h4>
                    <p>${data.bonusCondition}: <span class="bonus-amount">${data.bonusAmount} ₽</span></p>
                `;
                requirementsBlock.appendChild(newBonusBlock);
            }
        } else {
            bonusBlock.innerHTML = `
                <h4>Доплата при условии:</h4>
                <p>${data.bonusCondition}: <span class="bonus-amount">${data.bonusAmount} ₽</span></p>
            `;
        }
    }
    
    // Заполняем опции
    const optionsBlock = document.querySelector('.options-block');
    if (!optionsBlock) {
        const requirementsBlock = document.querySelector('.requirements-block');
        if (requirementsBlock) {
            const newOptionsBlock = document.createElement('div');
            newOptionsBlock.className = 'options-block';
            
            let optionsHtml = '<h4>Дополнительные условия:</h4><ul>';
            
            if (data.keyPurchase) {
                optionsHtml += `<li>Выкуп по ключу: ${data.keyPurchase}</li>`;
            }
            
            if (data.returnPolicy) {
                optionsHtml += `<li>Возможен возврат: ${data.returnPolicy}</li>`;
            }
            
            if (data.reviewType) {
                optionsHtml += `<li>Нужен отзыв: ${data.reviewType}</li>`;
            }
            
            if (data.paymentType) {
                optionsHtml += `<li>Оплата: ${data.paymentType}</li>`;
            }
            
            optionsHtml += '</ul>';
            
            newOptionsBlock.innerHTML = optionsHtml;
            requirementsBlock.appendChild(newOptionsBlock);
        }
    } else {
        let optionsHtml = '<h4>Дополнительные условия:</h4><ul>';
        
        if (data.keyPurchase) {
            optionsHtml += `<li>Выкуп по ключу: ${data.keyPurchase}</li>`;
        }
        
        if (data.returnPolicy) {
            optionsHtml += `<li>Возможен возврат: ${data.returnPolicy}</li>`;
        }
        
        if (data.reviewType) {
            optionsHtml += `<li>Нужен отзыв: ${data.reviewType}</li>`;
        }
        
        if (data.paymentType) {
            optionsHtml += `<li>Оплата: ${data.paymentType}</li>`;
        }
        
        optionsHtml += '</ul>';
        
        optionsBlock.innerHTML = optionsHtml;
    }
}

// Функция заполнения данных о ТЗ
function fillTzData(data) {
    // Заполняем требования к контенту
    if (data.contentRequirements) {
        const contentRequirements = document.querySelector('.tz-block .content-requirements');
        if (contentRequirements) {
            contentRequirements.textContent = data.contentRequirements;
        }
    }
    
    // Заполняем требования к интеграции
    if (data.integrationRequirements) {
        const integrationRequirements = document.querySelector('.tz-block .integration-requirements');
        if (integrationRequirements) {
            integrationRequirements.textContent = data.integrationRequirements;
        }
    }
    
    // Заполняем дополнительные требования
    if (data.additionalRequirements) {
        const additionalRequirements = document.querySelector('.tz-block .additional-requirements');
        if (additionalRequirements) {
            additionalRequirements.textContent = data.additionalRequirements;
        }
    }
}

// Функция заполнения данных о магазине
function fillStoreData(data) {
    // Заполняем название магазина
    if (data.storeName) {
        const storeName = document.querySelector('.offer-block .store-name');
        if (storeName) {
            storeName.textContent = data.storeName;
        }
    }
    
    // Заполняем ссылку на магазин
    if (data.storeLink) {
        const storeLink = document.querySelector('.offer-block .store-link');
        if (storeLink) {
            storeLink.href = data.storeLink;
            storeLink.textContent = 'Перейти в магазин';
        }
    }
}

// Вспомогательная функция для получения отображаемого имени соцсети
function getNetworkDisplayName(network) {
    const names = {
        'instagram': 'Instagram',
        'telegram': 'Telegram',
        'tiktok': 'TikTok',
        'vk': 'ВКонтакте',
        'youtube': 'YouTube'
    };
    
    return names[network] || network;
} 