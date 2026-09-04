(function () {
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  var body = document.body;
  var isOpen = false;
  var lastFocused = null;

  function openMenu() {
    isOpen = true;
    lastFocused = document.activeElement;
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    menu.classList.add('open');
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    body.classList.add('menu-open');
    var firstLink = menu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    isOpen = false;
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('inert', '');
    body.classList.remove('menu-open');
    if (lastFocused) lastFocused.focus();
  }

  toggle.addEventListener('click', function () {
    isOpen ? closeMenu() : openMenu();
  });

  menu.addEventListener('click', function (e) {
    if (e.target === menu) closeMenu();
  });

  document.querySelectorAll('.mobile-menu__item').forEach(function (item) {
    item.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 901 && isOpen) closeMenu();
  });

  document.querySelectorAll('.panel__form button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

  var form = document.querySelector('.panel__form');
  if (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }
})();
