document.addEventListener('DOMContentLoaded', function() {
    // Обработка отправки формы
    const form = document.querySelector('.social-networks-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Здесь будет логика обработки формы
    });

    // Обработка кнопок в шапке
    const marketplaceBtns = document.querySelectorAll('.marketplace-btn');
    marketplaceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Обработка табов
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Обработка раскрывающихся блоков социальных сетей
    const socialInputGroups = document.querySelectorAll('.social-input-group');
    
    socialInputGroups.forEach(group => {
        const input = group.querySelector('.social-input');
        const arrow = group.querySelector('.toggle-arrow');
        
        if (input.classList.contains('instagram-input')) {
            // Показываем статистику для Instagram по умолчанию
            arrow.textContent = '▲';
        } else {
            // Скрываем статистику для других соц. сетей
            const nextElements = getNextStatsGroups(group);
            nextElements.forEach(el => el.style.display = 'none');
        }

        group.addEventListener('click', function() {
            const nextElements = getNextStatsGroups(group);
            const isExpanded = arrow.textContent === '▲';
            
            if (isExpanded) {
                arrow.textContent = '▼';
                nextElements.forEach(el => el.style.display = 'none');
            } else {
                arrow.textContent = '▲';
                nextElements.forEach(el => el.style.display = 'block');
            }
        });
    });

    function getNextStatsGroups(element) {
        const nextElements = [];
        let nextElement = element.nextElementSibling;
        
        while (nextElement && nextElement.classList.contains('stats-group')) {
            nextElements.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }
        
        return nextElements;
    }

    // Обработка кнопок переключения
    const toggleGroups = document.querySelectorAll('.toggle-buttons');
    
    toggleGroups.forEach(group => {
        const buttons = group.querySelectorAll('.toggle-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активное состояние у всех кнопок в группе
                buttons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активное состояние нажатой кнопке
                this.classList.add('active');
            });
        });
    });

    // Обработка ссылок "Что это?"
    const whatIsItLinks = document.querySelectorAll('.what-is-it');
    whatIsItLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Здесь можно добавить логику показа подсказки
        });
    });

    // Обработка чекбоксов "Неважно"
    const statsCheckboxes = document.querySelectorAll('.stats-checkbox');
    
    statsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const inputField = this.closest('.stats-group').querySelector('.stats-input');
            if (this.checked) {
                inputField.disabled = true;
                inputField.value = '';
            } else {
                inputField.disabled = false;
            }
        });
    });
}); 