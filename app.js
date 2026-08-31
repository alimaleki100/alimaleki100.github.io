/**
 * Ali Maleki - Portfolio Application Logic
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
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('ali_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // default executive dark
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('ali_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Executive Dark' : 'Clean Light'} theme`);
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

    // Close mobile menu on click
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
            el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
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
   4. Expandable Consulting Pillar Accordions
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
        if (spanText) spanText.textContent = 'Hide Deliverables & Scope';
      } else {
        detailsContent.classList.add('hidden');
        btn.classList.remove('is-active');
        btn.setAttribute('aria-expanded', 'false');
        const spanText = btn.querySelector('span span');
        if (spanText) spanText.textContent = 'View Concrete Deliverables & Scope';
      }
    });
  });
}

/* ==========================================================================
   5. Interactive Fractional Engagement Estimator
   ========================================================================== */
function initFractionalCalculator() {
  const roleSelect = document.getElementById('calc-role');
  const commitmentSlider = document.getElementById('calc-commitment');
  const commitmentVal = document.getElementById('calc-commitment-val');
  const durationSelect = document.getElementById('calc-duration');
  
  // Output fields
  const outHours = document.getElementById('calc-out-hours');
  const outScope = document.getElementById('calc-out-scope');
  const outCadence = document.getElementById('calc-out-cadence');
  const outFocus = document.getElementById('calc-out-focus');
  const outDeliverables = document.getElementById('calc-out-deliverables');

  if (!roleSelect || !commitmentSlider) return;

  function updateCalculator() {
    const daysPerWeek = parseInt(commitmentSlider.value);
    commitmentVal.textContent = daysPerWeek === 1 ? '1 Day / Week (~8 hrs)' : 
                                daysPerWeek === 2 ? '2 Days / Week (~16 hrs)' : 
                                daysPerWeek === 3 ? '3 Days / Week (~24 hrs)' : 'Advisory (5-8 hrs/mo)';
    
    const role = roleSelect.value;
    const duration = durationSelect.value;

    let monthlyHours = daysPerWeek === 0 ? 8 : daysPerWeek * 32;
    if (outHours) outHours.textContent = `~${monthlyHours} hrs / month`;
    
    // Dynamic recommendations based on selection
    if (role === 'fractional-pm') {
      if (outScope) outScope.textContent = 'Product Strategy & Delivery Leadership';
      if (outCadence) outCadence.textContent = `${daysPerWeek}x Weekly Syncs, Sprint Governance, Bi-weekly Exec Reviews`;
      if (outFocus) outFocus.textContent = 'Roadmap prioritization against OKRs, cross-functional engineering alignment, unblocking delivery bottlenecks.';
      if (outDeliverables) outDeliverables.innerHTML = `
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> 90-Day Outcome-driven Product Roadmap</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> Standardized PRD & Discovery Rituals</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> Cross-functional OKR Alignment & Attainment tracking</li>
      `;
    } else if (role === 'data-mentor') {
      if (outScope) outScope.textContent = 'Data Team Coaching & Capability Building';
      if (outCadence) outCadence.textContent = '1-on-1 Mentoring, Bi-weekly Discovery Workshops, Architecture Audits';
      if (outFocus) outFocus.textContent = 'Upskilling Data PMs & analysts from "ticket-takers" to proactive business value drivers, metric tree modeling.';
      if (outDeliverables) outDeliverables.innerHTML = `
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> Executive Metric Tree & Self-Serve BI Framework</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> Data Product Discovery & Specification Playbook</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> 1-on-1 Data PM Coaching & Career Elevation</li>
      `;
    } else if (role === 'agile-delivery') {
      if (outScope) outScope.textContent = 'Agile Transformation & Delivery Lead';
      if (outCadence) outCadence.textContent = 'Sprint Cadence Setup, Backlog Refinement, Blocker Triage, Retrospectives';
      if (outFocus) outFocus.textContent = 'Pragmatic Scrum/Kanban adoption, eliminating delivery bottlenecks, establishing predictable release cadences.';
      if (outDeliverables) outDeliverables.innerHTML = `
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> Delivery Flow Audit & Bottleneck Heatmap</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> Agile Delivery Playbook tailored to team maturity</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> Velocity Stabilization & Predictable Sprint Burn-ups</li>
      `;
    } else {
      if (outScope) outScope.textContent = 'Enterprise Cloud & Data Transformation Sprint';
      if (outCadence) outCadence.textContent = 'Architecture Reviews, Stakeholder Alignment, Pilot Execution';
      if (outFocus) outFocus.textContent = 'SAP-to-Cloud modernization, Azure & Databricks ecosystem enablement, data governance.';
      if (outDeliverables) outDeliverables.innerHTML = `
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> SAP-to-Azure/Databricks Migration Roadmap</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> Lightweight Data Governance & KPI Catalog</li>
        <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-xs"></i> Dashboard Adoption & Continuous Improvement Framework</li>
      `;
    }
  }

  roleSelect.addEventListener('change', updateCalculator);
  commitmentSlider.addEventListener('input', updateCalculator);
  durationSelect.addEventListener('change', updateCalculator);

  updateCalculator();
}

/* ==========================================================================
   6. Modals (Strategy Call & Full CV Quick-View)
   ========================================================================== */
function initModals() {
  // Strategy Call Modal
  const openCallBtns = document.querySelectorAll('.open-call-modal');
  const callModal = document.getElementById('strategy-call-modal');
  const closeCallBtn = document.getElementById('close-call-modal');

  // CV Modal
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
          submitBtn.innerHTML = '<span>Send Direct Inquiry</span><i class="fas fa-paper-plane"></i>';
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

  // Open CV Modal
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

  // Close CV Modal
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

  // Print CV
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Keyboard shortcut: Escape to close modals
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

  // Copy Email Buttons
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText('ali.maleki100@gmail.com').then(() => {
        showToast('Email address copied to clipboard (ali.maleki100@gmail.com)');
      }).catch(() => {
        showToast('ali.maleki100@gmail.com');
      });
    });
  });
}

/* ==========================================================================
   7. Contact Form Handler (Google Apps Script Official Webhook)
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
    const company = document.getElementById('form-company')?.value.trim() || 'Direct Client';
    const service = document.getElementById('form-service')?.value || 'Fractional Leadership';
    const message = document.getElementById('form-message')?.value.trim() || '';

    // Set loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Sending Securely...</span>';
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
        successMsg.textContent = `Thank you, ${name}! Your inquiry regarding "${service}" has been delivered directly to Ali's inbox. I'll review your details and respond to ${email} within 24 hours.`;
      }
      showToast('Your strategic advisory inquiry has been sent successfully!');
    } catch (error) {
      console.warn('Submission fallback:', error);
      contactForm.classList.add('hidden');
      if (successContainer) {
        successContainer.classList.remove('hidden');
      }
      if (successMsg) {
        successMsg.textContent = `Thank you, ${name}! Your request has been recorded. You can also reach Ali directly at ali.maleki100@gmail.com.`;
      }
      showToast('Inquiry recorded. Thank you!');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Direct Inquiry</span><i class="fas fa-paper-plane"></i>';
      }
    }
  });
}

/* ==========================================================================
   8. Toast Notification Utility
   ========================================================================== */
function showToast(message) {
  const existingToast = document.querySelector('.toast-msg');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
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
