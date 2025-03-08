// Здесь будет размещаться JavaScript код
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        // Настраиваем тему и цвета
        document.documentElement.style.setProperty('--tg-theme-bg-color', window.Telegram.WebApp.backgroundColor);
        document.documentElement.style.setProperty('--tg-theme-text-color', window.Telegram.WebApp.textColor);
        document.documentElement.style.setProperty('--tg-theme-button-color', window.Telegram.WebApp.buttonColor);
        document.documentElement.style.setProperty('--tg-theme-button-text-color', window.Telegram.WebApp.buttonTextColor);

        // Скрываем MainButton если он показан
        if (window.Telegram.WebApp.MainButton.isVisible) {
            window.Telegram.WebApp.MainButton.hide();
        }

        console.log('Telegram WebApp успешно инициализирован');
    } else {
        console.error('Telegram WebApp не доступен');
    }

    // Получаем данные из localStorage
    const requirementsData = JSON.parse(localStorage.getItem('requirementsData') || '{}');
    const productData = JSON.parse(localStorage.getItem('productData') || '{}');
    
    console.log('Загруженные данные о требованиях:', requirementsData);
    console.log('Загруженные данные о товаре:', productData);

    // Заполняем название товара
    if (productData.name) {
        document.getElementById('productName').textContent = productData.name;
    }

    // Заполняем изображение товара
    if (productData.allImages && productData.allImages.length > 0) {
        const productImage = document.getElementById('productImage');
        if (productImage) {
            productImage.src = productData.allImages[0];
        }
    }

    // Заполняем цены
    const rewardPriceElement = document.getElementById('rewardPrice');
    if (rewardPriceElement) {
        if (requirementsData.rewardPrice) {
            rewardPriceElement.textContent = requirementsData.rewardPrice + ' ₽';
        } else if (productData.price) {
            rewardPriceElement.textContent = productData.price + ' ₽';
        }
    }

    if (productData.price) {
        document.getElementById('productPrice').textContent = productData.price + ' ₽';
    }

    // Заполняем информацию о доплате
    const bonusDetails = document.getElementById('bonusDetails');
    if (bonusDetails) {
        if (requirementsData.bonusEnabled === true) {
            if (requirementsData.bonusAmount && requirementsData.bonusCondition) {
                bonusDetails.innerHTML = `<span class="condition-label">Доплата</span>${requirementsData.bonusAmount}₽, при условии: ${requirementsData.bonusCondition}`;
            } else {
                bonusDetails.innerHTML = '<span class="condition-label">Доплата</span>Да';
            }
        } else {
            bonusDetails.innerHTML = '<span class="condition-label">Доплата</span>Нет';
        }
    }

    // Заполняем условия
    const keyPurchase = document.getElementById('keyPurchase');
    if (keyPurchase) {
        keyPurchase.textContent = requirementsData.keyPurchase === 'Да' ? 'Да' : 'Нет';
    }

    const returnPolicy = document.getElementById('returnPolicy');
    if (returnPolicy) {
        returnPolicy.textContent = requirementsData.returnPolicy === 'Да' ? 'Да' : 'Нет';
    }

    const reviewType = document.getElementById('reviewType');
    if (reviewType) {
        reviewType.textContent = requirementsData.reviewType === 'Да, с фото' ? 'Да, с фото' : 'Нет';
    }

    const paymentType = document.getElementById('paymentType');
    if (paymentType) {
        paymentType.textContent = 'Сразу';
    }

    // Заполняем требования к охватам
    const requirementsList = document.querySelector('.requirements-list');
    if (requirementsList && requirementsData.socialRequirements?.instagram) {
        requirementsList.innerHTML = '';
        
        const instagram = requirementsData.socialRequirements.instagram;
        
        if (instagram.followers) {
            addRequirementItem(requirementsList, 'Пул от:', instagram.followers);
        }
        if (instagram.reels) {
            addRequirementItem(requirementsList, 'Reels от:', instagram.reels);
        }
        if (instagram.stories) {
            addRequirementItem(requirementsList, 'Stories от:', instagram.stories);
        }
    }

    // Заполняем данные о магазине
    const storeData = JSON.parse(localStorage.getItem('storeData') || '{}');
    if (storeData) {
        console.log('Данные о магазине:', storeData);
        
        // Заполняем название магазина
        const shopName = document.querySelector('.shop-name');
        if (shopName && storeData.name) {
            shopName.textContent = storeData.name;
            console.log('Установлено название магазина:', storeData.name);
        }
        
        // Заполняем аватар магазина
        if (storeData.logo) {
            console.log('Найден логотип магазина:', storeData.logo);
            
            // Пробуем найти аватар магазина разными способами
            const storeAvatar = document.querySelector('.shop-avatar img') || 
                              document.querySelector('.store-avatar img') ||
                              document.querySelector('.shop-logo img');
                              
            if (storeAvatar) {
                storeAvatar.src = storeData.logo;
                storeAvatar.style.width = '40px';
                storeAvatar.style.height = '40px';
                storeAvatar.style.borderRadius = '50%';
                storeAvatar.style.objectFit = 'cover';
                console.log('Установлен логотип магазина:', storeAvatar.src);
            } else {
                // Если аватар не найден, создаем новый
                const container = document.querySelector('.shop-avatar') || 
                                document.querySelector('.store-avatar') ||
                                document.querySelector('.shop-info');
                if (container) {
                    const newAvatar = document.createElement('img');
                    newAvatar.src = storeData.logo;
                    newAvatar.alt = 'Логотип магазина';
                    newAvatar.style.width = '40px';
                    newAvatar.style.height = '40px';
                    newAvatar.style.borderRadius = '50%';
                    newAvatar.style.objectFit = 'cover';
                    container.insertBefore(newAvatar, container.firstChild);
                    console.log('Создан новый логотип магазина:', newAvatar.src);
                }
            }
        }
    }

    // Заполняем информацию о ТЗ
    const tzBlock = document.querySelector('.tz-block');
    const tzPopup = document.getElementById('tzPopup');
    const closePopup = document.querySelector('.close-popup');
    const tzContent = document.getElementById('tzContent');
    
    // Получаем содержимое ТЗ из localStorage
    const savedTzContent = localStorage.getItem('tzContent');
    
    // Заполняем содержимое всплывающего окна
    if (tzContent) {
        if (savedTzContent) {
            // Разбиваем текст на абзацы и добавляем их в popup
            const paragraphs = savedTzContent.split('\n').filter(p => p.trim() !== '');
            
            if (paragraphs.length > 0) {
                tzContent.innerHTML = '';
                paragraphs.forEach(paragraph => {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    tzContent.appendChild(p);
                });
            } else {
                // Если текст не разбит на абзацы, добавляем его как один абзац
                tzContent.innerHTML = `<p>${savedTzContent}</p>`;
            }
        } else {
            // Если в localStorage нет данных, показываем пример текста
            tzContent.innerHTML = `
                <p>Обучающий курс от компании поможет раскрыть весь потенциал <strong>и пользу от продукта благодаря</strong> персональной подборке и подробной инструкции по использованию.</p>
                <p>Обучающий курс от компании поможет раскрыть весь потенциал и пользу от продукта благодаря персональной подборке и подробной инструкции по использованию.</p>
            `;
        }
    }
    
    // Обработчик клика по блоку ТЗ
    if (tzBlock && tzPopup) {
        tzBlock.addEventListener('click', function() {
            tzPopup.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Запрещаем прокрутку основной страницы
        });
    }
    
    // Обработчик клика по кнопке закрытия
    if (closePopup && tzPopup) {
        closePopup.addEventListener('click', function() {
            tzPopup.style.display = 'none';
            document.body.style.overflow = ''; // Разрешаем прокрутку основной страницы
        });
        
        // Закрытие при клике вне контента попапа
        tzPopup.addEventListener('click', function(event) {
            if (event.target === tzPopup) {
                tzPopup.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Удаляем ненужные элементы
    const elementsToRemove = [
        '.shop-rating',
        '.rating',
        '.offers-count',
        '.offers',
        '.views-stats',
        '.image-size',
        '.store-rating',
        '.rating-count',
        '.rating-value',
        '.offers-number'
    ];

    elementsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
                console.log('Удален элемент:', selector);
            }
        });
    });

    // Дополнительно ищем и удаляем текст рейтинга и предложений
    const textNodes = document.evaluate(
        "//text()[contains(., 'Рейтинг') or contains(., 'предложений') or contains(., '4.9') or contains(., '(40)')]",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i);
        if (node.parentNode) {
            node.parentNode.removeChild(node);
            console.log('Удален текстовый узел с рейтингом/предложениями');
        }
    }

    // Настраиваем вкладки соцсетей
    setupSocialTabs();

    // Обработчик для кнопки "Редактировать"
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            window.location.href = 'requirements.html';
        });
    }

    // Обработчик для кнопки "Опубликовать"
    const publishBtn = document.querySelector('.publish-btn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Сохраняем состояние таба "Модерации" для страницы заявок
            localStorage.setItem('activeTab', 'moderation');
            // Переходим на страницу заявок
            window.location.href = 'application.html';
        });
    }
});

// Функция получения данных о товаре
function getProductData() {
    const productData = JSON.parse(localStorage.getItem('productData') || '{}');
    return {
        name: productData.name || '',
        price: productData.price || '',
        link: productData.link || '',
        marketplace: productData.marketplace || [],
        images: productData.allImages || []
    };
}

// Функция получения данных о требованиях
function getRequirementsData() {
    const requirementsData = JSON.parse(localStorage.getItem('requirementsData') || '{}');
    return {
        rewardPrice: requirementsData.rewardPrice || '',
        socialRequirements: requirementsData.socialRequirements || {
            instagram: {
                pool: false,
                reels: false,
                stories: false
            }
        }
    };
}

// Функция получения данных о ТЗ
function getTzData() {
    const tzData = JSON.parse(localStorage.getItem('tzData') || '{}');
    return {
        contentRequirements: tzData.contentRequirements || ''
    };
}

// Функция получения данных о магазине
function getStoreData() {
    const storeData = JSON.parse(localStorage.getItem('storeData') || '{}');
    return {
        name: storeData.name || '',
        description: storeData.description || ''
    };
}

// Функция получения данных о изображениях товара
function getImages() {
    const productData = JSON.parse(localStorage.getItem('productData') || '{}');
    return productData.allImages || [];
}

// Функция форматирования названия товара
function formatProductName(name) {
    if (!name) return '';
    
    // Если название короткое, возвращаем как есть
    if (name.length <= 30) {
        return name;
    }
    
    // Ищем пробел ближе к середине строки для разделения
    const midPoint = Math.floor(name.length / 2);
    let breakPoint = name.lastIndexOf(' ', midPoint);
    
    // Если пробел не найден, разделяем посередине
    if (breakPoint === -1) {
        breakPoint = midPoint;
    }
    
    const firstLine = name.substring(0, breakPoint);
    const secondLine = name.substring(breakPoint + 1);
    
    return firstLine + '<br>' + secondLine;
}

// Функция настройки галереи изображений товара
function setupProductImages(productData) {
    // Проверяем, есть ли несколько изображений
    if (productData.allImages && productData.allImages.length > 1) {
        // Создаем галерею
        createImageGallery(productData.allImages);
    } else if (productData.imageUrl) {
        // Если только одно изображение, просто устанавливаем его
        const productImage = document.getElementById('productImage');
        if (productImage) {
            productImage.src = productData.imageUrl;
            productImage.alt = productData.name || 'Товар';
        }
    }
}

// Функция создания галереи изображений
function createImageGallery(images) {
    const productImageContainer = document.querySelector('.product-image');
    if (!productImageContainer) return;
    
    // Очищаем контейнер
    productImageContainer.innerHTML = '';
    
    // Создаем контейнер для основного изображения
    const mainImageContainer = document.createElement('div');
    mainImageContainer.className = 'main-image-container';
    
    // Создаем основное изображение (всегда первое загруженное)
    const mainImage = document.createElement('img');
    mainImage.id = 'productImage';
    mainImage.src = images[0]; // Первое изображение как основное
    mainImage.alt = 'Фото товара';
    mainImageContainer.appendChild(mainImage);
    
    // Создаем контейнер для миниатюр
    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'thumbnails-container';
    
    // Добавляем только дополнительные изображения как миниатюры (начиная со второго)
    if (images.length > 1) {
        for (let i = 1; i < images.length; i++) {
            const thumbnail = document.createElement('img');
            thumbnail.src = images[i];
            thumbnail.className = 'thumbnail';
            
            // Не меняем основное изображение при клике
            // Просто для визуального отображения дополнительных фото
            
            thumbnailsContainer.appendChild(thumbnail);
        }
    }
    
    // Добавляем контейнеры в галерею
    productImageContainer.appendChild(mainImageContainer);
    
    // Добавляем контейнер с миниатюрами только если есть дополнительные изображения
    if (images.length > 1) {
        productImageContainer.appendChild(thumbnailsContainer);
    }
    
    // Добавляем стили для галереи
    const style = document.createElement('style');
    style.textContent = `
        .product-image {
            display: flex;
            margin-bottom: 15px;
            position: relative;
        }
        .main-image-container {
            flex: 1;
            margin-right: 10px;
            position: relative;
        }
        .main-image-container img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
        }
        .thumbnails-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            width: 80px;
            overflow-y: auto;
            max-height: 350px;
        }
        .thumbnail {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
            border: 2px solid transparent;
        }
    `;
    document.head.appendChild(style);
}

// Функция обновления требований к соцсетям
function updateSocialRequirements(socialRequirements) {
    const requirementsList = document.querySelector('.requirements-list');
    if (!requirementsList) return;
    
    // Очищаем список требований
    requirementsList.innerHTML = '';
    
    // Проверяем наличие требований для Instagram
    if (socialRequirements.instagram) {
        const instagramData = socialRequirements.instagram;
        
        // Добавляем требования для Instagram
        if (instagramData.followers) {
            addRequirementItem(requirementsList, 'Пул от:', instagramData.followers);
        }
        if (instagramData.reels) {
            addRequirementItem(requirementsList, 'Reels от:', instagramData.reels);
        }
        if (instagramData.stories) {
            addRequirementItem(requirementsList, 'Stories от:', instagramData.stories);
        }
    } else {
        // Если данных нет, добавляем значения по умолчанию
        addRequirementItem(requirementsList, 'Пул от:', '1000');
        addRequirementItem(requirementsList, 'Reels от:', '600');
        addRequirementItem(requirementsList, 'Stories от:', '250');
    }
}

// Функция добавления элемента требования
function addRequirementItem(container, label, value) {
    const item = document.createElement('div');
    item.className = 'requirement-item';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'requirement-label';
    labelSpan.textContent = label;
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'requirement-value';
    valueSpan.textContent = value;
    
    item.appendChild(labelSpan);
    item.appendChild(valueSpan);
    
    container.appendChild(item);
}

// Функция настройки вкладок соцсетей
function setupSocialTabs() {
    const socialTabs = document.querySelectorAll('.social-tab');
    if (socialTabs.length === 0) return;
    
    socialTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс у всех вкладок
            socialTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Здесь можно добавить логику переключения содержимого вкладок
        });
    });
}

// Функция заполнения данных о магазине
function fillStoreData(storeData) {
    console.log('Начинаем заполнение данных о магазине:', storeData);
    
    // Заполняем название магазина
    if (storeData.name) {
        const storeName = document.querySelector('.shop-name');
        if (storeName) {
            console.log('Найден элемент для названия магазина, устанавливаем:', storeData.name);
            storeName.textContent = storeData.name;
        } else {
            console.log('Элемент для названия магазина не найден');
        }
    }
    
    // Заполняем аватар магазина
    const storeAvatar = document.querySelector('.shop-avatar img');
    if (storeAvatar) {
        if (storeData.logoUrl) {
            console.log('Устанавливаем логотип магазина:', storeData.logoUrl);
            storeAvatar.src = storeData.logoUrl;
            storeAvatar.alt = storeData.name || 'Аватар магазина';
        } else {
            console.log('Используем дефолтный логотип магазина');
            storeAvatar.src = 'images/default-shop-avatar.png';
            storeAvatar.alt = 'Магазин';
        }
    } else {
        console.error('Не найден элемент для аватара магазина');
    }
    
    // Убираем отзывы - оставляем только название магазина
    const shopRating = document.querySelector('.shop-rating');
    if (shopRating) {
        shopRating.style.display = 'none';
    }
    
    const offersCount = document.querySelector('.offers-count');
    if (offersCount) {
        offersCount.style.display = 'none';
    }
} 