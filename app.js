/**
 * Ali Maleki Portfolio - Core Application Logic
 * Executive Navy Portfolio Design System
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
   3. Contact Modal & Inbox Delivery
   ========================================================================== */
function initContactForm() {
  const modal = document.getElementById('contact-modal');
  const form = document.getElementById('contact-form');
  const openButtons = document.querySelectorAll('[data-contact-open]');
  const closeButtons = document.querySelectorAll('[data-contact-close]');
  const status = document.getElementById('contact-form-status');
  if (!modal || !form || !openButtons.length) return;

  let previouslyFocused = null;

  function openModal() {
    previouslyFocused = document.activeElement;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => document.getElementById('contact-name')?.focus(), 0);
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
  }

  openButtons.forEach((button) => button.addEventListener('click', openModal));
  closeButtons.forEach((button) => button.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalLabel = submitButton?.innerHTML;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin text-xs"></i><span>Sending...</span>';
    }
    if (status) status.classList.add('hidden');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Message delivery failed');

      form.reset();
      if (status) {
        status.textContent = 'Message sent successfully. Thank you — I will respond by email.';
        status.className = 'rounded-lg px-3 py-2.5 text-xs border border-[#20B8A6]/30 bg-[#20B8A6]/10 text-[#20B8A6]';
      }
    } catch (error) {
      if (status) {
        status.textContent = 'The message could not be sent. Please try WhatsApp or LinkedIn instead.';
        status.className = 'rounded-lg px-3 py-2.5 text-xs border border-red-400/30 bg-red-400/10 text-red-300';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
      }
    }
  });
}
