document.addEventListener('DOMContentLoaded', () => {

  // ── Theme cycle: dark → light → pastel (persisted) ──
  const THEMES = ['dark', 'light', 'pastel'];
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const THEME_UI = {
    dark: {
      aria: 'Switch to light mode',
      title: 'Theme: Dark — next: Light',
    },
    light: {
      aria: 'Switch to pastel mode',
      title: 'Theme: Light — next: Pastel',
    },
    pastel: {
      aria: 'Switch to dark mode',
      title: 'Theme: Pastel — next: Dark',
    },
  };

  function normalizeTheme(raw) {
    const t = raw === 'light' || raw === 'pastel' ? raw : 'dark';
    return t;
  }

  const heroVideoDark = document.querySelector('.hero-video--dark');
  const heroVideoLight = document.querySelector('.hero-video--light');

  function syncHeroVideos() {
    const t = normalizeTheme(root.getAttribute('data-theme'));
    if (heroVideoDark) {
      heroVideoDark.pause();
    }
    if (heroVideoLight) {
      heroVideoLight.pause();
    }
    if (t === 'dark' && heroVideoDark) {
      heroVideoDark.play().catch(() => {});
    } else if (t === 'light' && heroVideoLight) {
      heroVideoLight.play().catch(() => {});
    }
  }

  function applyTheme(theme) {
    const next = normalizeTheme(theme);
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('drivn-theme', next);
    } catch (e) {}
    if (themeToggle) {
      const ui = THEME_UI[next];
      themeToggle.setAttribute('aria-label', ui.aria);
      themeToggle.setAttribute('title', ui.title);
    }
    syncHeroVideos();
  }

  function toggleTheme() {
    const current = normalizeTheme(root.getAttribute('data-theme'));
    const i = THEMES.indexOf(current);
    const next = THEMES[(i + 1) % THEMES.length];
    applyTheme(next);
  }

  applyTheme(normalizeTheme(root.getAttribute('data-theme')));

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // ── Scroll-based nav styling ──
  const nav = document.getElementById('nav');
  const handleNavScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ── Mobile menu toggle ──
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ── Scroll-triggered animations ──
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  animatedElements.forEach(el => observer.observe(el));

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Contact form handler ──
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1200);
  });
});
