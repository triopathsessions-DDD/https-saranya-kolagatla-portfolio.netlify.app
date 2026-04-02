/* ================================================================
   SARANYA KOLAGATLA — Portfolio Main JavaScript
   Handles: Navigation, Scroll Animations, Hamburger Menu,
            Active Page Detection, Smooth Interactions
   ================================================================ */

'use strict';

/* ================================================================
   CONTACT CONFIG — single source of truth for all contact links.
   Update URLs here and every page updates automatically.
   ================================================================ */
const CONTACT = {
  linkedin: 'https://www.linkedin.com/in/saranya-kolagatla-1b3b88381/',
  github:   'https://github.com/kolagatlasaranya',
  email:    'mailto:kolagatlasaranya@gmail.com',
  phone:    'tel:+13122785448',
  whatsapp: '13122785448'
};

/* ----------------------------------------------------------------
   1. UTILITIES
   ---------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ----------------------------------------------------------------
   2. NAVIGATION — Scroll Effect + Active Page
   ---------------------------------------------------------------- */
function initNavbar() {
  const navbar       = $('#navbar');
  if (!navbar) return;

  const hamburger    = $('#nav-hamburger');
  const mobileMenu   = $('#nav-mobile');
  const mobileLinks  = $$('.mobile-nav-link');

  /* Determine current page for active link */
  const path = window.location.pathname.split('/').pop() || 'index.html';

  $$('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html') ||
        (path === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  $$('.mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html') ||
        (path === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* Scroll: add scrolled/page-solid class */
  const isHomePage = (path === 'index.html' || path === '' || path === '/');

  function handleScroll() {
    const scrollY = window.scrollY;
    if (isHomePage) {
      if (scrollY > 60) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('page-solid');
      } else {
        navbar.classList.remove('scrolled');
      }
    } else {
      navbar.classList.add('page-solid');
    }
  }

  /* Hamburger toggle */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    /* Close mobile menu on link click */
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); /* Run once on load */
}

/* ----------------------------------------------------------------
   3. SCROLL ANIMATIONS — Intersection Observer
   ---------------------------------------------------------------- */
function initScrollAnimations() {
  const animElements = $$('.anim-fade-up, .anim-fade-left, .anim-fade-right, .anim-scale');
  if (!animElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); /* Animate once */
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animElements.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------------
   4. COUNTER ANIMATION (for stat numbers)
   ---------------------------------------------------------------- */
function animateCounter(el, target, suffix = '', duration = 1600) {
  const start    = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    /* Ease out cubic */
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(start + (target - start) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counterEls = $$('[data-counter]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------------
   5. SCROLL INDICATOR (Home page)
   ---------------------------------------------------------------- */
function initScrollIndicator() {
  const indicator = $('#scroll-indicator');
  if (!indicator) return;

  indicator.addEventListener('click', () => {
    const nextSection = document.querySelector('.hero + section, .hero ~ section, #about-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  });

  /* Hide on scroll */
  window.addEventListener('scroll', () => {
    indicator.style.opacity = window.scrollY > 120 ? '0' : '';
  }, { passive: true });
}

/* ----------------------------------------------------------------
   6. TECH STACK — Item hover micro-interaction
   ---------------------------------------------------------------- */
function initTechItems() {
  $$('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-2px) scale(1.02)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
}

/* ----------------------------------------------------------------
   7. TIMELINE — Contribution items stagger on card hover
   ---------------------------------------------------------------- */
function initTimeline() {
  $$('.tl-card').forEach(card => {
    const items = $$('.tl-contribution-item', card);
    card.addEventListener('mouseenter', () => {
      items.forEach((item, i) => {
        item.style.transitionDelay = `${i * 30}ms`;
        item.style.transform = 'translateX(3px)';
      });
    });
    card.addEventListener('mouseleave', () => {
      items.forEach(item => {
        item.style.transitionDelay = '0ms';
        item.style.transform = '';
      });
    });
  });
}

/* ----------------------------------------------------------------
   8. ACTIVE NAV LINK ON SCROLL (single page only)
   ---------------------------------------------------------------- */
function initSmoothPageTransition() {
  $$('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    /* Only intercept local page links (not anchors or external) */
    if (href && !href.startsWith('#') && !href.startsWith('http') &&
        !href.startsWith('mailto') && !href.startsWith('tel') &&
        !href.startsWith('https') && href.endsWith('.html')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease';
        setTimeout(() => { window.location.href = href; }, 200);
      });
    }
  });

  /* Fade in on page load */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
}

/* ----------------------------------------------------------------
   9. FOOTER YEAR
   ---------------------------------------------------------------- */
function initYear() {
  const yearEl = $('#current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ----------------------------------------------------------------
   10. CONTACT LINKS — inject URLs from CONTACT config
   ---------------------------------------------------------------- */
function initContactLinks() {
  /* Inject LinkedIn / GitHub (and any future keys) from config */
  $$('[data-contact]').forEach(el => {
    const key = el.dataset.contact;
    if (key !== 'whatsapp' && CONTACT[key]) {
      el.href = CONTACT[key];
    }
  });
}

/* ----------------------------------------------------------------
   11. WHATSAPP — pre-filled message
   ---------------------------------------------------------------- */
function initWhatsApp() {
  const waBtn = $('#whatsapp-btn');
  if (!waBtn) return;

  const message = encodeURIComponent(
    'Hi, I came across your profile and found your background interesting. ' +
    'We have an opportunity that aligns with your experience. ' +
    'Would you be open to discussing this further?'
  );
  waBtn.href = `https://wa.me/${CONTACT.whatsapp}?text=${message}`;
}

/* ----------------------------------------------------------------
   11. HERO PARALLAX (subtle, performance-safe)
   ---------------------------------------------------------------- */
function initParallax() {
  const blobs = $$('.hero-blob');
  if (!blobs.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = 0.04 + i * 0.02;
          blob.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ----------------------------------------------------------------
   12. EDUCATION / CERT CARD HOVER
   ---------------------------------------------------------------- */
function initCardEffects() {
  $$('.edu-card, .info-card, .summary-card, .prof-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.25s ease, transform 0.25s ease';
    });
  });
}

/* ----------------------------------------------------------------
   INIT — DOMContentLoaded
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initScrollIndicator();
  initTechItems();
  initTimeline();
  initSmoothPageTransition();
  initYear();
  initContactLinks();
  initWhatsApp();
  initParallax();
  initCardEffects();
});
