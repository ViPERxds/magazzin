document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const menuDrawer = document.querySelector('.menu-drawer');
    const closeBtn = document.querySelector('.menu-close-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if (menuBtn && menuDrawer) {
        menuBtn.addEventListener('click', function() {
            menuDrawer.classList.add('open');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            menuDrawer.classList.remove('open');
        });
    }

    // Обработка раскрывающихся пунктов меню
    menuItems.forEach(item => {
        if (item.classList.contains('expandable')) {
            item.addEventListener('click', function() {
                const submenu = this.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.classList.toggle('open');
                    this.classList.toggle('expanded');
                }
            });
        }
    });
}); 
