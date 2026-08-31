/**
 * Ali Maleki - Persian Portfolio Application Logic (Farsi / RTL)
 * Interactive Features: Filtering, Fractional Calculator, Theme Switcher, Modals, CV Print
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initMetricCounters();
  initPillarAccordions();
  initFractionalCalculator();
  initModals();
  initContactForm();
});

/* ==========================================================================
   1. Theme Management (Executive Dark / Clean Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('ali_portfolio_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('ali_portfolio_theme', newTheme);
      showToast(`پوسته به حالت ${newTheme === 'dark' ? 'تاریک مدیریتی' : 'روشن شفاف'} تغییر یافت`);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fas fa-moon text-indigo-600';
      } else {
        themeIcon.className = 'fas fa-sun text-amber-400';
      }
    }
  }
}

/* ==========================================================================
   2. Mobile Nav & Scroll Spy
   ========================================================================== */
function initNav() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      });
    });
  }

  // Active state on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach(el => {
          el.classList.add('text-indigo-400', 'font-semibold');
        });
      } else {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach(el => {
          el.classList.remove('text-indigo-400', 'font-semibold');
        });
      }
    });
  });
}

/* ==========================================================================
   3. Animated Metric Counters
   ========================================================================== */
function initMetricCounters() {
  const metricElements = document.querySelectorAll('.counter-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metricElements.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const isDecimal = target % 1 !== 0;
          let current = 0;
          const duration = 1600;
          const steps = 40;
          const increment = target / steps;
          const stepTime = duration / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            const formattedVal = isDecimal ? current.toFixed(1) : Math.floor(current);
            el.textContent = prefix + formattedVal + suffix;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.25 });

  const metricsSection = document.getElementById('metrics-bar');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   4. Expandable Consulting Pillar Accordions (Persian)
   ========================================================================== */
function initPillarAccordions() {
  const toggleBtns = document.querySelectorAll('.pillar-toggle-btn');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = btn.closest('.glass-card');
      const detailsContent = parentCard ? parentCard.querySelector('.pillar-details-content') : null;
      if (!detailsContent) return;

      const isHidden = detailsContent.classList.contains('hidden');
      
      if (isHidden) {
        detailsContent.classList.remove('hidden');
        btn.classList.add('is-active');
        btn.setAttribute('aria-expanded', 'true');
        const spanText = btn.querySelector('span span');
        if (spanText) spanText.textContent = 'بستن جزئیات و خروجی‌ها';
      } else {
        detailsContent.classList.add('hidden');
        btn.classList.remove('is-active');
        btn.setAttribute('aria-expanded', 'false');
        const spanText = btn.querySelector('span span');
        if (spanText) spanText.textContent = 'مشاهده خروجی‌ها و اقدامات تحویل';
      }
    });
  });
}

/* ==========================================================================
   5. Persian Fractional Engagement Estimator
   ========================================================================== */
function initFractionalCalculator() {
  const roleSelect = document.getElementById('calc-role');
  const commitmentSlider = document.getElementById('calc-commitment');
  const commitmentVal = document.getElementById('calc-commitment-val');
  
  // Output fields
  const outHours = document.getElementById('calc-out-hours');
  const outScope = document.getElementById('calc-out-scope');
  const outCadence = document.getElementById('calc-out-cadence');
  const outFocus = document.getElementById('calc-out-focus');
  const outDeliverables = document.getElementById('calc-out-deliverables');

  if (!roleSelect || !commitmentSlider) return;

  function updateCalculator() {
    const daysPerWeek = parseInt(commitmentSlider.value);
    commitmentVal.textContent = daysPerWeek === 1 ? '۱ روز در هفته (حدود ۸ ساعت)' : 
                                daysPerWeek === 2 ? '۲ روز در هفته (حدود ۱۶ ساعت)' : 
                                daysPerWeek === 3 ? '۳ روز در هفته (حدود ۲۴ ساعت)' : 'مشاوره و منتورینگ (۵ تا ۸ ساعت در ماه)';
    
    const role = roleSelect.value;

    let monthlyHours = daysPerWeek === 0 ? 8 : daysPerWeek * 32;
    if (outHours) outHours.textContent = `حدود ${monthlyHours} ساعت در ماه`;
    
    if (role === 'fractional-pm') {
      if (outScope) outScope.textContent = 'استراتژی محصول و راهبری تحویل (Fractional PM / Delivery)';
      if (outCadence) outCadence.textContent = `${daysPerWeek} جلسه هفتگی، هدایت اسپرینت‌ها، جلسات دوهفتگی با مدیران ارشد`;
      if (outFocus) outFocus.textContent = 'اولویت‌بندی رودمپ بر اساس OKRها، هماهنگی مهندسی بین‌تیمی و رفع گلوگاه‌های اجرایی تحویل.';
      if (outDeliverables) outDeliverables.innerHTML = `
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> نقشه راه ۹۰ روزه محصول مبتنی بر خروجی‌های ملموس</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> استانداردسازی اسناد PRD و فرآیندهای کشف محصول</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> هم‌راستاسازی OKRها و سنجش پیوسته میزان تحقق اهداف</li>
      `;
    } else if (role === 'data-mentor') {
      if (outScope) outScope.textContent = 'کوچینگ و توانمندسازی تیم‌های داده (Data Team Coaching)';
      if (outCadence) outCadence.textContent = 'جلسات منتورینگ تک‌به‌تک، کارگاه‌های دوهفتگی کشف محصول، ارزیابی معماری داده';
      if (outFocus) outFocus.textContent = 'تبدیل مدیران محصول داده و تحلیل‌گران از وضعیت انجام صرف تسک‌ها به محرک‌های اصلی ارزش تجاری کسب‌وکار.';
      if (outDeliverables) outDeliverables.innerHTML = `
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> معماری درخت شاخص‌های کسب‌وکار و سیستم هوش تجاری سلف‌سرویس</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> پلی‌بوک کشف و مشخصات فنی محصولات داده (Data PRD)</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> کوچینگ ۱ به ۱ مدیران محصول داده و توانمندسازی فردی</li>
      `;
    } else if (role === 'agile-delivery') {
      if (outScope) outScope.textContent = 'تحول چابک و راهبری تحویل مهندسی (Agile & Delivery Lead)';
      if (outCadence) outCadence.textContent = 'استقرار ریتم اسپرینت، پالایش بک‌لاگ، تریاژ موانع و جلسات رترواسپکتیو';
      if (outFocus) outFocus.textContent = 'پیاده‌سازی عمل‌گرایانه اسکرام و کانبان، حذف اتلاف‌ها و استقرار سرعت تحویل پایدار و قابل پیش‌بینی.';
      if (outDeliverables) outDeliverables.innerHTML = `
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> ممیزی جریان تحویل و شناسایی نقشه حرارتی گلوگاه‌ها</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> پلی‌بوک تحویل چابک متناسب با بلوغ سازمان</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> تثبیت سرعت تیم و گزارش‌دهی شفاف پیشرفت اسپرینت‌ها</li>
      `;
    } else {
      if (outScope) outScope.textContent = 'اسپرینت تحول ابری و مدرن‌سازی داده (Enterprise Cloud & Data)';
      if (outCadence) outCadence.textContent = 'بازبینی معماری، هم‌راستاسازی ذینفعان، پیاده‌سازی پایلوت و حاکمیت داده';
      if (outFocus) outFocus.textContent = 'مدرن‌سازی داده‌های سازمانی از SAP به پلتفرم‌های ابری Azure و Databricks.';
      if (outDeliverables) outDeliverables.innerHTML = `
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> نقشه راه مهاجرت از SAP به پلتفرم Azure / Databricks</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> کاتالوگ شاخص‌ها و چارچوب حاکمیت داده چابک</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> چارچوب رشد ضریب نفوذ داشبوردها و بهبود مستمر</li>
      `;
    }
  }

  roleSelect.addEventListener('change', updateCalculator);
  commitmentSlider.addEventListener('input', updateCalculator);

  updateCalculator();
}

/* ==========================================================================
   6. Modals & Handlers
   ========================================================================== */
function initModals() {
  const openCallBtns = document.querySelectorAll('.open-call-modal');
  const callModal = document.getElementById('strategy-call-modal');
  const closeCallBtn = document.getElementById('close-call-modal');

  const openCvBtns = document.querySelectorAll('.open-cv-modal');
  const cvModal = document.getElementById('cv-modal');
  const closeCvBtn = document.getElementById('close-cv-modal');
  const printCvBtn = document.getElementById('print-cv-btn');

  // Open Call Modal
  openCallBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (callModal) {
        // Reset form & success states when opening
        const contactForm = document.getElementById('consulting-contact-form');
        const successContainer = document.getElementById('form-success-container');
        const submitBtn = document.getElementById('form-submit-btn');
        if (contactForm) contactForm.classList.remove('hidden');
        if (successContainer) successContainer.classList.add('hidden');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>ارسال درخواست همکاری</span><i class="fas fa-paper-plane"></i>';
        }

        callModal.classList.remove('hidden');
        callModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close Call Modal
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const closeCallActions = [closeCallBtn, closeSuccessBtn];

  closeCallActions.forEach(btn => {
    if (btn && callModal) {
      btn.addEventListener('click', () => {
        callModal.classList.add('hidden');
        callModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      });
    }
  });

  if (callModal) {
    callModal.addEventListener('click', (e) => {
      if (e.target === callModal) {
        callModal.classList.add('hidden');
        callModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
    });
  }

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

  if (closeCvBtn && cvModal) {
    closeCvBtn.addEventListener('click', () => {
      cvModal.classList.add('hidden');
      cvModal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    });
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) {
        cvModal.classList.add('hidden');
        cvModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

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
      }).catch(() => {
        showToast('ali.maleki100@gmail.com');
      });
    });
  });
}

/* ==========================================================================
   7. Persian Contact Form Handler (Google Apps Script Official Webhook)
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
    const company = document.getElementById('form-company')?.value.trim() || 'سازمان مستقیم';
    const service = document.getElementById('form-service')?.value || 'رهبری فرکشنال محصول و دلیوری';
    const message = document.getElementById('form-message')?.value.trim() || '';

    // Set loading state
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

      // Show in-modal success view
      contactForm.reset();
      contactForm.classList.add('hidden');
      if (successContainer) {
        successContainer.classList.remove('hidden');
      }
      if (successMsg) {
        successMsg.textContent = `با تشکر از شما ${name} عزیز! درخواست شما در خصوص «${service}» مستقیماً در اینباکس علی ملکی ثبت شد. پس از بررسی نیازمندی‌ها، ظرف ۲۴ ساعت کاری به ایمیل ${email} پاسخ داده خواهد شد.`;
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
   8. Toast Notification
   ========================================================================== */
function showToast(message) {
  const existingToast = document.querySelector('.toast-msg');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.style.left = '24px';
  toast.style.right = 'auto';
  toast.innerHTML = `
    <i class="fas fa-check-circle text-emerald-400"></i>
    <span class="text-sm font-medium">${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
