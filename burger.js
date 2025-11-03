document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burger');
    const header = document.querySelector('header');
    
    let menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container';
    menuContainer.style.display = 'none';
    menuContainer.innerHTML = `
      <div class="menu-items">
      <a href="index" class="menu-item">Главная</a>
      <a href="builds" class="menu-item" id="buildsburger">Сборки от Аддерли</a>
      <a href="windows" class="menu-item">Официальные ISO Windows</a>
      <a href="makutweaker" class="menu-item" id="makutweakerburger">Скачать MakuTweaker</a>
      <a href="makubench" class="menu-item">MakuTweaker Benchmark</a>
      <a href="makuyan" class="menu-item">Запрещатор Яндекса</a>
      <a href="makupedia" class="menu-item">MakuPedia</a>
      <a href="win_pe" class="menu-item">Windows PE от Аддерли</a>
      <a href="faq" class="menu-item">Часто задаваемые вопросы</a>
      <a href="support" class="menu-item" id="supportburger">Поддержать</a>
      </div>
    `;
    
    document.body.appendChild(menuContainer);
    
    function positionMenu() {
      const burgerRect = burgerMenu.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      
      menuContainer.style.position = 'fixed';
      menuContainer.style.top = `${headerRect.bottom + 10}px`;
      menuContainer.style.right = `${window.innerWidth - burgerRect.right}px`;
    }
    
    function animateOpen(element, duration) {
      positionMenu(); 
      element.style.display = 'flex';
      element.style.opacity = '0';
      element.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 10);
    }
    
    function animateClose(element, duration, callback) {
      element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
      element.style.opacity = '0';
      element.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        element.style.display = 'none';
        if (callback) callback();
      }, duration);
    }
    
    burgerMenu.addEventListener('click', function(event) {
      event.stopPropagation();
      
      if (menuContainer.style.display === 'none' || menuContainer.style.display === '') {
        animateOpen(menuContainer, 200);
        burgerMenu.classList.add('active');
        localStorage.setItem('menuOpen', 'true');
      } else {
        animateClose(menuContainer, 200, function() {
          localStorage.setItem('menuOpen', 'false');
        });
        burgerMenu.classList.remove('active');
      }
    });
    
    document.addEventListener('click', function(event) {
      if (!menuContainer.contains(event.target) && event.target !== burgerMenu) {
        if (menuContainer.style.display === 'flex') {
          animateClose(menuContainer, 200, function() {
            localStorage.setItem('menuOpen', 'false');
          });
          burgerMenu.classList.remove('active');
        }
      }
    });

    document.querySelectorAll('.menu-item').forEach(link => {
      link.addEventListener('click', function() {
        localStorage.setItem('menuOpen', 'false');
        animateClose(menuContainer, 200);
        burgerMenu.classList.remove('active');
      });
    });

    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (menuContainer.style.display === 'flex') {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          positionMenu();
        }, 10);
      }
    });

    window.addEventListener('resize', () => {
      if (menuContainer.style.display === 'flex') {
        positionMenu();
      }
    });
    

    const currentPath = window.location.pathname.replace(/\/$/, '');
    document.querySelectorAll('.menu-item').forEach(link => {
      const href = link.getAttribute('href');
      if (currentPath.endsWith(href)) {
        link.classList.add('active-link');
      }
    });
    document.querySelectorAll('nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (currentPath.endsWith(href)) {
        link.classList.add('active-link');
      }
    });
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const mainTop = main.getBoundingClientRect().top;
    if (mainTop <= header.offsetHeight) {
      header.classList.add('header-narrow');
    } else {
      header.classList.remove('header-narrow');
    }
  });