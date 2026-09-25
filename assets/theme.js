/**
 * Novera Shopify Theme - Core JavaScript
 * Handles interactive components, mobile navigation drawer, and sticky header
 */

(function () {
  'use strict';

  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function initMobileDrawer() {
    const hamburgerBtn = document.querySelector('[data-mobile-menu-trigger]');
    const drawer = document.querySelector('[data-mobile-drawer]');
    const closeBtn = document.querySelector('[data-mobile-drawer-close]');
    const overlay = document.querySelector('[data-mobile-drawer-overlay]');

    if (!hamburgerBtn || !drawer) return;

    function openDrawer() {
      drawer.classList.add('is-active');
      drawer.setAttribute('aria-hidden', 'false');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('is-active');
      drawer.setAttribute('aria-hidden', 'true');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburgerBtn.focus();
    }

    hamburgerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeDrawer();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    // Keyboard support: Escape closes drawer
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
        closeDrawer();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileDrawer();
  });
})();
