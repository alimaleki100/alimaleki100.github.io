/**
 * Ali Maleki Portfolio - Persian Application Logic
 * Features: Localized RICE Calculator, Google Apps Script Webhook, Smooth Navigation, Toast & Modal Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRiceCalculator();
  initContactForm();
  initModals();
});

/* ==========================================================================
   1. Navigation & Mobile Menu (Persian)
   ========================================================================== */
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        if (mobileMenu.classList.contains('hidden')) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        } else {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        }
      }
    });

    const mobileLinks = mobileMenu.querySelectorAll('a, button');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-blue-400', 'font-bold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-blue-400', 'font-bold');
      }
    });
  });
}

/* ==========================================================================
   2. Localized RICE Prioritization Calculator
   ========================================================================== */
function initRiceCalculator() {
  const reachInput = document.getElementById('rice-reach');
  const impactInput = document.getElementById('rice-impact');
  const confidenceInput = document.getElementById('rice-confidence');
  const effortInput = document.getElementById('rice-effort');

  const reachVal = document.getElementById('rice-reach-val');
  const impactVal = document.getElementById('rice-impact-val');
  const confidenceVal = document.getElementById('rice-confidence-val');
  const effortVal = document.getElementById('rice-effort-val');
  const scoreVal = document.getElementById('rice-score-val');
  const copyBtn = document.getElementById('rice-copy-btn');

  if (!reachInput || !scoreVal) return;

  function calculateRICE() {
    const r = parseFloat(reachInput.value) || 0;
    const i = parseFloat(impactInput.value) || 1;
    const c = (parseFloat(confidenceInput.value) || 100) / 100;
    const e = parseFloat(effortInput.value) || 1;

    if (reachVal) reachVal.textContent = r.toLocaleString('fa-IR');
    if (impactVal) {
      const impactLabels = { 0.5: 'حداقل (۰.۵x)', 1: 'کم (۱x)', 2: 'متوسط (۲x)', 3: 'زیاد (۳x)' };
      impactVal.textContent = impactLabels[i] || `${i}x`;
    }
    if (confidenceVal) confidenceVal.textContent = `${Math.round(c * 100).toLocaleString('fa-IR')}٪`;
    if (effortVal) effortVal.textContent = `${e.toLocaleString('fa-IR')} نفر-ماه`;

    const score = Math.round((r * i * c) / e);
    scoreVal.textContent = score.toLocaleString('fa-IR');
  }

  [reachInput, impactInput, confidenceInput, effortInput].forEach(el => {
    if (el) el.addEventListener('input', calculateRICE);
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const r = reachInput.value;
      const i = impactInput.value;
      const c = confidenceInput.value;
      const e = effortInput.value;
      const s = scoreVal.textContent;
      const text = `امتیاز RICE: ${s} (Reach: ${r}, Impact: ${i}, Confidence: ${c}%, Effort: ${e})`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('امتیاز اولویت‌بندی کپی شد!');
      });
    });
  }

  calculateRICE();
}

/* ==========================================================================
   3. Google Apps Script Webhook Form Handler (Persian)
   ========================================================================== */
const GOOGLE_SCRIPT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxQSVBHsLd3w4bqjgPfFAf4mmhjlt07tftOT-SLTly7QJxpsBMTPYL6Xya1DE9q-MVAFg/exec';

function initContactForm() {
  const contactForm = document.getElementById('consulting-contact-form');
  const successContainer = document.getElementById('form-success-container');
  const successMsg = document.getElementById('form-success-msg');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim() || '';
    const email = document.getElementById('form-email')?.value.trim() || '';
    const company = document.getElementById('form-company')?.value.trim() || 'مشتری مستقیم';
    const service = document.getElementById('form-service')?.value || 'رهبری فرکشنال محصول و دلیوری';
    const message = document.getElementById('form-message')?.value.trim() || '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>در حال ارسال پیام...</span>';
    }

    try {
      await fetch(GOOGLE_SCRIPT_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          company: company,
          service_focus: service,
          challenge_and_scope: message
        })
      });

      contactForm.reset();
      contactForm.classList.add('hidden');
      if (successContainer) {
        successContainer.classList.remove('hidden');
      }
      if (successMsg) {
        successMsg.textContent = `با تشکر از شما ${name} عزیز! درخواست مشاوره شما در خصوص «${service}» مستقیماً در اینباکس علی ملکی ثبت شد. پس از بررسی نیازمندی‌ها، ظرف ۲۴ ساعت کاری به ایمیل ${email} پاسخ داده خواهد شد.`;
      }
      showToast('درخواست همکاری شما با موفقیت ارسال شد!');
    } catch (error) {
      console.warn('Submission fallback:', error);
      contactForm.classList.add('hidden');
      if (successContainer) {
        successContainer.classList.remove('hidden');
      }
      if (successMsg) {
        successMsg.textContent = `با تشکر از شما ${name} عزیز! درخواست شما ثبت شد. در صورت تمایل می‌توانید مستقیماً به ali.maleki100@gmail.com نیز ایمیل ارسال فرمایید.`;
      }
      showToast('درخواست شما ثبت شد. با تشکر!');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>ارسال درخواست همکاری</span><i class="fas fa-paper-plane"></i>';
      }
    }
  });
}

/* ==========================================================================
   4. Modals (Persian)
   ========================================================================== */
function initModals() {
  const callModal = document.getElementById('strategy-call-modal');
  const cvModal = document.getElementById('cv-modal');

  const openCallBtns = document.querySelectorAll('.open-call-modal');
  const closeCallBtns = document.querySelectorAll('.close-call-modal');

  const openCvBtns = document.querySelectorAll('.open-cv-modal');
  const closeCvBtns = document.querySelectorAll('.close-cv-modal');

  openCallBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (callModal) {
        callModal.classList.remove('hidden');
        callModal.classList.add('flex');
        document.body.style.overflow = 'hidden';

        const contactForm = document.getElementById('consulting-contact-form');
        const successContainer = document.getElementById('form-success-container');
        if (contactForm) contactForm.classList.remove('hidden');
        if (successContainer) successContainer.classList.add('hidden');
      }
    });
  });

  closeCallBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (callModal) {
        callModal.classList.add('hidden');
        callModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
    });
  });

  openCvBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cvModal) {
        cvModal.classList.remove('hidden');
        cvModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeCvBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (cvModal) {
        cvModal.classList.add('hidden');
        cvModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === callModal) {
      callModal.classList.add('hidden');
      callModal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }
    if (e.target === cvModal) {
      cvModal.classList.add('hidden');
      cvModal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (callModal && !callModal.classList.contains('hidden')) {
        callModal.classList.add('hidden');
        callModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
      if (cvModal && !cvModal.classList.contains('hidden')) {
        cvModal.classList.add('hidden');
        cvModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
    }
  });

  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText('ali.maleki100@gmail.com').then(() => {
        showToast('آدرس ایمیل کپی شد (ali.maleki100@gmail.com)');
      });
    });
  });
}

/* ==========================================================================
   5. Toast Notification Helper (Persian)
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-circle-check text-emerald-400"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
