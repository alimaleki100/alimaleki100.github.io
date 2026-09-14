/**
 * Ali Maleki Portfolio - Core Application Logic
 * Modern Mineral Design System
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initContactForm();
  highlightActiveNav();
});

/* ==========================================================================
   1. Mobile Navigation & Accessibility
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('mobile-nav-menu');
  const backdrop = document.getElementById('mobile-nav-backdrop');

  if (!toggleBtn || !navMenu) return;

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.remove('hidden');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable link
    const firstLink = navMenu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  const closeBtn = document.getElementById('mobile-nav-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // Close when clicking an anchor link
  const menuLinks = navMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   2. Active Navigation Highlight
   ========================================================================== */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-item');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (currentPath.endsWith(href) || 
        (href === '/' && (currentPath === '/' || currentPath.endsWith('index.html'))) ||
        (href !== '/' && currentPath.includes(href.replace('.html', '').replace('/', '')))) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   3. Contact Form Submission (with Fallback)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    
    // Open native mailto directly as robust fallback
    window.location.href = `mailto:ali.maleki100@gmail.com?subject=${subject}&body=${body}`;
  });
}
