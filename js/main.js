/* ============================================================
   EAR 身體平衡工作坊 — main.js  (Request 3)
   Features:
   - Sticky navbar with scroll shadow
   - Hamburger mobile menu (id="navToggle" / id="navMobile")
   - Smooth scroll with navbar-height offset
   - IntersectionObserver [data-ani] slide-up system
   - Spring-elastic mousemove tilt on cards
   - Stats counter animation
   - Back-to-top button
   ============================================================ */

'use strict';

/* ---- Helpers ---- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. NAVBAR — scroll shadow + mobile toggle
   ============================================================ */
(function initNavbar() {
  const navbar    = $('#navbar');
  const topline   = $('.nav-topline');
  const toggle    = $('#navToggle');
  const mobile    = $('#navMobile');
  if (!navbar || !toggle || !mobile) return;

  /* Scroll shadow */
  const onScroll = () => {
    const scrolled = window.scrollY > 10;
    navbar.classList.toggle('scrolled', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Toggle mobile menu */
  const closeMobile = () => {
    mobile.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobile.style.display = '';
  };

  const openMobile = () => {
    mobile.style.display = 'flex';
    // Force reflow before adding class for transition
    mobile.getBoundingClientRect();
    mobile.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = mobile.classList.contains('open');
    isOpen ? closeMobile() : openMobile();
  });

  /* Close mobile menu when a link is clicked */
  $$('.nm-link', mobile).forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (mobile.classList.contains('open') &&
        !navbar.contains(e.target)) {
      closeMobile();
    }
  });
})();

/* ============================================================
   2. SMOOTH SCROLL — account for sticky navbar height
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navH = parseInt(getComputedStyle(document.documentElement)
                   .getPropertyValue('--nav-h'), 10) || 56;
    const offset = target.getBoundingClientRect().top + window.scrollY - navH - 4;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
})();

/* ============================================================
   3. SLIDE-UP ANIMATION  [data-ani]
   Uses IntersectionObserver — adds .ani-visible when in view
   ============================================================ */
(function initScrollAnimations() {
  const elements = $$('[data-ani]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('ani-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. SPRING TILT — mousemove elastic perspective tilt
   Applied to: .price-card, .svc-card, .pop-card, .about-card
   ============================================================ */
(function initSpringTilt() {
  const TILT_CARDS = '.price-card, .svc-card, .pop-card, .about-card, .vid-card';
  const MAX_TILT   = 6;    // degrees
  const SCALE      = 1.025;

  const lerp = (a, b, t) => a + (b - a) * t;
  let animating = {};

  $$(`${TILT_CARDS}`).forEach((card, i) => {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);
      card.style.transform =
        `perspective(900px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale(${SCALE})`;
      if (Math.abs(currentX - targetX) > 0.01 ||
          Math.abs(currentY - targetY) > 0.01) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      targetY =  ((e.clientX - cx) / (rect.width  / 2)) * MAX_TILT;
      targetX = -((e.clientY - cy) / (rect.height / 2)) * MAX_TILT;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    const resetCard = () => {
      targetX = 0; targetY = 0;
      const resetTick = () => {
        currentX = lerp(currentX, 0, 0.1);
        currentY = lerp(currentY, 0, 0.1);
        card.style.transform =
          `perspective(900px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale(1)`;
        if (Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
          requestAnimationFrame(resetTick);
        } else {
          card.style.transform = '';
        }
      };
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      requestAnimationFrame(resetTick);
    };

    card.addEventListener('mouseleave', resetCard);
    card.addEventListener('blur', resetCard);
  });
})();

/* ============================================================
   5. BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = $('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   6. STATS COUNTER (if any .stat-num elements exist)
   ============================================================ */
(function initStatsCounter() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const DURATION = 1600;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();

    const update = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      const val = target * easeOut(t);
      el.textContent = (Number.isInteger(target)
        ? Math.round(val)
        : val.toFixed(1)) + suffix;
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();

/* ============================================================
   7. PORTAL ITEMS — spring scale on hover (enhanced)
   Extra spring pulse on click
   ============================================================ */
(function initPortalInteractions() {
  $$('.portal-item').forEach(item => {
    item.addEventListener('click', (e) => {
      item.style.transition = 'transform .18s cubic-bezier(0.22,1,0.36,1)';
      item.style.transform  = 'scale(0.92)';
      setTimeout(() => {
        item.style.transform  = 'scale(1.08)';
        setTimeout(() => {
          item.style.transform  = '';
          item.style.transition = '';
        }, 220);
      }, 80);
    });
  });
})();

/* ============================================================
   8. ACTIVE NAV LINK — highlight current section
   ============================================================ */
(function initActiveNav() {
  const sections  = $$('section[id], header[id]');
  const navLinks  = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
  ) || 56;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
      });
    });
  }, {
    rootMargin: `-${navH + 8}px 0px -60% 0px`,
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));
})();
