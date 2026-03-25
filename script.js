document.addEventListener('DOMContentLoaded', () => {

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
