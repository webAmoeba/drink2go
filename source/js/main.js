import './map.js';

const menu = document.querySelector('.main-header__navigation');
const menuToggler = document.querySelector('.main-header__menu-toggler');

menu.classList.add('main-header__navigation--hidden');
menu.classList.add('main-header__navigation--with-js');

menuToggler.classList.remove('main-header__menu-toggler--hidden');
menuToggler.classList.add('main-header__menu-toggler--closed');

menuToggler.addEventListener('click', () => {
  if (menu.classList.contains('main-header__navigation--hidden')) {
    menu.classList.remove('main-header__navigation--hidden');
    menuToggler.classList.remove('main-header__menu-toggler--closed');
    menuToggler.classList.add('main-header__menu-toggler--opened');
  } else {
    menu.classList.add('main-header__navigation--hidden');
    menuToggler.classList.remove('main-header__menu-toggler--opened');
    menuToggler.classList.add('main-header__menu-toggler--closed');
  }
});


const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    clickableClass: 'swiper-pagination-clickable',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.promo__slider-button--left',
    prevEl: '.promo__slider-button--right',
  },
});
