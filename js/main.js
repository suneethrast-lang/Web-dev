/**
 * The Bauphiloné — Main JavaScript
 * Features: Navbar scroll, hamburger menu, booking form validation,
 * testimonials slider, scroll-reveal, scroll-to-top, modal, smooth scroll
 */

'use strict';

/* ============================================
   DOM READY
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initBookingForm();
  initTestimonialsSlider();
  initScrollReveal();
  initScrollToTop();
  initLoginModal();
  initGallery();
  initNewsletterForm();
  setMinDates();
});


/* ============================================
   1. STICKY NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  function onScroll() {
    // Navbar becomes solid after 60px scroll
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - (window.innerHeight * 0.35);
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentSection || (currentSection === '' && href === 'home')) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load
}


/* ============================================
   2. HAMBURGER MENU
   ============================================ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      hamburger.classList.add('active');
      navMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close menu on nav link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}


/* ============================================
   3. BOOKING FORM VALIDATION
   ============================================ */
function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');

  if (checkin) checkin.setAttribute('min', today);
  if (checkout) checkout.setAttribute('min', today);

  // Update checkout min when checkin changes
  if (checkin && checkout) {
    checkin.addEventListener('change', () => {
      const checkinDate = checkin.value;
      if (checkinDate) {
        const nextDay = new Date(checkinDate);
        nextDay.setDate(nextDay.getDate() + 1);
        checkout.setAttribute('min', nextDay.toISOString().split('T')[0]);

        // If checkout is before new checkin, reset it
        if (checkout.value && checkout.value <= checkinDate) {
          checkout.value = '';
        }
      }
    });
  }
}

function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const fields = {
    destination: { el: document.getElementById('destination'), errEl: document.getElementById('destinationError'), msg: 'Please select a destination.' },
    checkin:     { el: document.getElementById('checkin'),     errEl: document.getElementById('checkinError'),     msg: 'Please select a check-in date.' },
    checkout:    { el: document.getElementById('checkout'),    errEl: document.getElementById('checkoutError'),    msg: 'Please select a check-out date.' },
    guests:      { el: document.getElementById('guests'),      errEl: document.getElementById('guestsError'),      msg: 'Please select the number of guests.' },
    roomType:    { el: document.getElementById('roomType'),    errEl: document.getElementById('roomTypeError'),    msg: 'Please select a room type.' },
  };

  // Clear individual errors on input
  Object.values(fields).forEach(({ el, errEl }) => {
    if (el) el.addEventListener('change', () => clearError(el, errEl));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate each field
    Object.values(fields).forEach(({ el, errEl, msg }) => {
      if (!el) return;
      clearError(el, errEl);
      if (!el.value || el.value.trim() === '') {
        showError(el, errEl, msg);
        isValid = false;
      }
    });

    // Cross-validate dates
    const checkinEl  = fields.checkin.el;
    const checkoutEl = fields.checkout.el;

    if (checkinEl.value && checkoutEl.value) {
      const checkinDate  = new Date(checkinEl.value);
      const checkoutDate = new Date(checkoutEl.value);

      if (checkoutDate <= checkinDate) {
        showError(checkoutEl, fields.checkout.errEl, 'Check-out date must be after check-in date.');
        isValid = false;
      }
    }

    if (isValid) {
      showBookingSuccess();
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.form-input.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function showError(el, errEl, msg) {
  el.classList.add('error');
  errEl.textContent = msg;
  // Shake animation
  el.style.animation = 'none';
  el.offsetHeight; // trigger reflow
  el.style.animation = 'shake 0.4s ease';
}

function clearError(el, errEl) {
  el.classList.remove('error');
  errEl.textContent = '';
  el.style.animation = '';
}

function showBookingSuccess() {
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');
  form.style.display = 'none';
  success.style.display = 'block';

  // Auto-reset after 5 seconds
  setTimeout(() => {
    form.reset();
    form.style.display = '';
    success.style.display = 'none';
  }, 5000);
}

// Shake keyframe (injected via JS)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);


/* ============================================
   4. TESTIMONIALS SLIDER
   ============================================ */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  let currentIndex = 0;
  let autoPlayInterval;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, totalCards - cardsPerView);
  }

  function goToSlide(index) {
    cardsPerView = getCardsPerView();
    const maxIndex = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIndex));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });
  }

  function next() { goToSlide(currentIndex + 1 > getMaxIndex() ? 0 : currentIndex + 1); }
  function prev() { goToSlide(currentIndex - 1 < 0 ? getMaxIndex() : currentIndex - 1); }

  nextBtn?.addEventListener('click', () => { next(); resetAutoplay(); });
  prevBtn?.addEventListener('click', () => { prev(); resetAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index, 10));
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoPlayInterval = setInterval(next, 5000);
  }
  function resetAutoplay() {
    clearInterval(autoPlayInterval);
    startAutoplay();
  }

  // Pause on hover
  track.closest('.testimonials-slider')?.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  track.closest('.testimonials-slider')?.addEventListener('mouseleave', startAutoplay);

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) next();
      else prev();
      resetAutoplay();
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    goToSlide(currentIndex);
  });

  startAutoplay();
  goToSlide(0);
}


/* ============================================
   5. SCROLL REVEAL (Intersection Observer)
   ============================================ */
function initScrollReveal() {
  // Add reveal classes to elements
  const revealTargets = [
    '.room-card',
    '.facility-card',
    '.why-card',
    '.testimonial-card',
    '.gallery-item',
    '.welcome-content-col',
    '.welcome-img-wrapper',
    '.section-header',
    '.cta-content',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i === 1) el.classList.add('reveal-delay-1');
      if (i === 2) el.classList.add('reveal-delay-2');
      if (i === 3) el.classList.add('reveal-delay-3');
      if (i === 4) el.classList.add('reveal-delay-4');
      if (i === 5) el.classList.add('reveal-delay-5');
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }
}


/* ============================================
   6. SCROLL TO TOP BUTTON
   ============================================ */
function initScrollToTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================
   7. LOGIN MODAL
   ============================================ */
function initLoginModal() {
  const modal = document.getElementById('loginModal');
  const loginBtn = document.getElementById('loginBtn');
  const closeBtn = document.getElementById('closeLoginModal');
  const loginForm = document.getElementById('loginForm');
  if (!modal || !loginBtn) return;

  function openModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Focus the first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  loginBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display !== 'none') closeModal();
  });

  // Login form submission (demo)
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = document.getElementById('loginEmail')?.value;
    const passVal  = document.getElementById('loginPassword')?.value;
    if (emailVal && passVal) {
      closeModal();
      showToast('Welcome back! Redirecting to your dashboard...');
    }
  });
}


/* ============================================
   8. GALLERY (Lightbox on click)
   ============================================ */
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const viewGalleryBtn = document.getElementById('viewGalleryBtn');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const label = item.querySelector('.gallery-label')?.textContent || '';
      if (img) openLightbox(img.src, img.alt, label);
    });
  });

  viewGalleryBtn?.addEventListener('click', () => {
    showToast('Full gallery coming soon! Stay tuned for our complete visual tour.');
  });

  // View Details buttons
  document.getElementById('viewDeluxeBtn')?.addEventListener('click', () => showToast('Deluxe Room details — Booking page coming soon!'));
  document.getElementById('viewExecutiveBtn')?.addEventListener('click', () => showToast('Executive Suite details — Booking page coming soon!'));
  document.getElementById('viewPresidentialBtn')?.addEventListener('click', () => showToast('Presidential Suite details — Booking page coming soon!'));
}

function openLightbox(src, alt, label) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox-box">
      <button class="lightbox-close" aria-label="Close image viewer">
        <i class="fas fa-times"></i>
      </button>
      <img src="${src}" alt="${alt}" class="lightbox-img" />
      <p class="lightbox-caption">${label}</p>
    </div>
  `;

  // Inject styles
  if (!document.getElementById('lightboxStyles')) {
    const style = document.createElement('style');
    style.id = 'lightboxStyles';
    style.textContent = `
      .lightbox-overlay {
        position: fixed; inset: 0; z-index: 3000;
        background: rgba(0,0,0,0.92); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        padding: 24px; animation: fadeIn 0.3s ease;
      }
      .lightbox-box {
        position: relative; max-width: 1000px; width: 100%;
        animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
      }
      .lightbox-img {
        width: 100%; border-radius: 16px;
        box-shadow: 0 32px 80px rgba(0,0,0,0.6);
        max-height: 80vh; object-fit: contain;
      }
      .lightbox-caption {
        text-align: center; color: rgba(255,255,255,0.7);
        margin-top: 16px; font-family: 'Playfair Display', serif;
        font-size: 1.1rem; font-style: italic; letter-spacing: 0.05em;
      }
      .lightbox-close {
        position: absolute; top: -48px; right: 0;
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3);
        color: white; font-size: 1rem; display: flex;
        align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.3s ease;
      }
      .lightbox-close:hover { background: #D4AF37; border-color: #D4AF37; color: #0F172A; }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const closeBtn = overlay.querySelector('.lightbox-close');
  closeBtn.addEventListener('click', () => {
    overlay.remove();
    document.body.style.overflow = '';
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', escHandler);
    }
  });
}


/* ============================================
   9. NEWSLETTER FORM
   ============================================ */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput?.value?.trim();

    if (!email || !isValidEmail(email)) {
      emailInput?.classList.add('error');
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    emailInput.value = '';
    emailInput?.classList.remove('error');
    showToast('🎉 Welcome aboard! You\'ve subscribed to our luxury newsletter.');
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ============================================
   10. TOAST NOTIFICATIONS
   ============================================ */
function showToast(message, type = 'success') {
  // Remove existing toast
  document.querySelector('.toast-notification')?.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
    <span>${message}</span>
  `;

  if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      .toast-notification {
        position: fixed; bottom: 96px; left: 50%; transform: translateX(-50%);
        z-index: 9999; background: #1E293B; color: white;
        padding: 14px 24px; border-radius: 100px;
        display: flex; align-items: center; gap: 10px;
        font-family: 'Poppins', sans-serif; font-size: 0.88rem;
        box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        border: 1px solid rgba(212,175,55,0.3);
        animation: toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        white-space: nowrap; max-width: 90vw; text-align: center;
      }
      .toast-notification i { color: #D4AF37; flex-shrink: 0; }
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to   { opacity: 0; transform: translateX(-50%) translateY(20px); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, 4000);
}
