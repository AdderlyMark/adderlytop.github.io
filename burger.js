document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burger');
    const header = document.querySelector('header');
    
    if (!burgerMenu) return;

    let menuContainer = document.querySelector('.menu-container');
    if (!menuContainer) {
        menuContainer = document.createElement('div');
        menuContainer.className = 'menu-container';
        menuContainer.innerHTML = `
            <div class="menu-items">
                <a href="index" class="menu-item">Главная</a>
                <a href="windows" class="menu-item">Скачать официальные Windows</a>
                <a href="makutweaker" class="menu-item" id="makutweakerburger">Скачать MakuTweaker</a>
                <a href="makubench" class="menu-item">MakuTweaker Benchmark</a>
                <a href="makuyan" class="menu-item">Запрещатор Яндекса</a>
                <a href="makupedia" class="menu-item">MakuPedia</a>
                <a href="win_pe" class="menu-item">Windows PE от Аддерли</a>
                <a href="support" class="menu-item highlight">Поддержать</a>
            </div>
        `;
        document.body.appendChild(menuContainer);
    }

function positionMenu() {
    const headerRect = header.getBoundingClientRect();
    const sideMargin = 20; 
    menuContainer.style.top = `${headerRect.bottom + 10}px`;
    menuContainer.style.right = `${sideMargin}px`;
}
    function toggleMenu() {
        const isActive = menuContainer.classList.contains('active');
        if (!isActive) {
            positionMenu();
            menuContainer.classList.add('active');
            burgerMenu.classList.add('active');
        } else {
            menuContainer.classList.remove('active');
            burgerMenu.classList.remove('active');
        }
    }

    burgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', (e) => {
        if (menuContainer.classList.contains('active')) {
            if (!menuContainer.contains(e.target) && e.target !== burgerMenu) {
                toggleMenu();
            }
        }
    });

    window.addEventListener('resize', () => {
        if (menuContainer.classList.contains('active')) positionMenu();
    });
});