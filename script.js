/* ═══════════════════════════════════════════════
   MD FAISAL — PORTFOLIO SCRIPT
   - Page navigation
   - Particle canvas background
   - Typewriter role ticker
   - Skill bar animations
   - Contact form
   - Mobile drawer
═══════════════════════════════════════════════ */

/* ─── DOM READY ─── */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initParticles();
  initTypewriter();
  initSkillBars();
  initContactForm();
  initMobileDrawer();
  initScrollNav();
});

/* ══════════════════════════════════════════════
   1. PAGE NAVIGATION
══════════════════════════════════════════════ */
function initNavigation() {
  const allBtns = document.querySelectorAll('[data-page]');

  allBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-page');
      navigateTo(target);
    });
  });
}

function navigateTo(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });

  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav button active states
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.remove('active');
    if (b.getAttribute('data-page') === pageId) {
      b.classList.add('active');
    }
  });

  // Close mobile drawer if open
  closeMobileDrawer();

  // Trigger skill bars if going to home
  if (pageId === 'home') {
    setTimeout(animateSkillBars, 300);
  }
}

/* ══════════════════════════════════════════════
   2. PARTICLE BACKGROUND
══════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const COLORS = ['#7C3AED', '#A78BFA', '#06B6D4', '#67E8F9', '#4F46E5'];
  const COUNT  = window.innerWidth < 640 ? 40 : 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.8 + 0.4,
      dx:   (Math.random() - 0.5) * 0.35,
      dy:   (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 130) * 0.12;
          ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Move
      p.x += p.dx;
      p.y += p.dy;

      // Bounce
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
}

/* ══════════════════════════════════════════════
   3. TYPEWRITER ROLE TICKER
══════════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('roleTicker');
  if (!el) return;

  const roles = [
    'web experiences.',
    'tools that help.',
    'for real people.',
    'with purpose.',
    'clean code.',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  function tick() {
    const current = roles[roleIdx];

    if (paused) {
      setTimeout(tick, 1200);
      paused = false;
      return;
    }

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        paused = true;
        deleting = true;
        setTimeout(tick, 80);
        return;
      }
      setTimeout(tick, 70);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
      setTimeout(tick, 40);
    }
  }

  tick();
}

/* ══════════════════════════════════════════════
   4. SKILL BAR ANIMATIONS
══════════════════════════════════════════════ */
function initSkillBars() {
  // Animate on page load (home is default)
  setTimeout(animateSkillBars, 600);
}

function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    const w = fill.getAttribute('data-w');
    fill.style.width = (w || 0) + '%';
  });
}

/* Observer for skill bars when they come into view */
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skills-section').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   5. CONTACT FORM
══════════════════════════════════════════════ */
function initContactForm() {
  const btn = document.getElementById('sendBtn');
  const successMsg = document.getElementById('formSuccess');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const name    = document.getElementById('fname')?.value.trim();
    const email   = document.getElementById('femail')?.value.trim();
    const subject = document.getElementById('fsubject')?.value.trim();
    const msg     = document.getElementById('fmsg')?.value.trim();

    // Basic validation
    if (!name || !email || !msg) {
      shakeButton(btn);
      showFieldError(!name ? 'fname' : !email ? 'femail' : 'fmsg');
      return;
    }

    if (!isValidEmail(email)) {
      shakeButton(btn);
      showFieldError('femail');
      return;
    }

    // Simulate send
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.opacity = '';
      btn.disabled = false;

      // Clear fields
      ['fname', 'femail', 'fsubject', 'fmsg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });

      // Show success
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeButton(btn) {
  btn.style.animation = 'none';
  btn.style.transform = 'translateX(-6px)';
  setTimeout(() => {
    btn.style.transform = 'translateX(6px)';
    setTimeout(() => {
      btn.style.transform = 'translateX(-4px)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 80);
    }, 80);
  }, 80);
}

function showFieldError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#F87171';
  el.focus();
  el.addEventListener('input', () => {
    el.style.borderColor = '';
  }, { once: true });
}

/* ══════════════════════════════════════════════
   6. MOBILE DRAWER
══════════════════════════════════════════════ */
function initMobileDrawer() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('drawerOverlay');
  const closeBtn  = document.getElementById('drawerClose');

  hamburger?.addEventListener('click', openMobileDrawer);
  overlay?.addEventListener('click', closeMobileDrawer);
  closeBtn?.addEventListener('click', closeMobileDrawer);
}

function openMobileDrawer() {
  document.getElementById('mobileDrawer')?.classList.add('open');
  document.getElementById('drawerOverlay')?.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  document.getElementById('mobileDrawer')?.classList.remove('open');
  document.getElementById('drawerOverlay')?.classList.remove('show');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════
   7. SCROLL-BASED NAV SHRINK
══════════════════════════════════════════════ */
function initScrollNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      navbar.style.background = 'rgba(8,8,15,0.95)';
    } else {
      navbar.style.background = 'rgba(8,8,15,0.82)';
    }
    lastY = y;
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   8. KEYBOARD NAVIGATION
══════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileDrawer();
});

/* ══════════════════════════════════════════════
   9. RESPECT REDUCED MOTION
══════════════════════════════════════════════ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.querySelectorAll('.ring-svg').forEach(el => {
    el.style.animation = 'none';
  });
  document.querySelectorAll('.status-dot').forEach(el => {
    el.style.animation = 'none';
  });
}
