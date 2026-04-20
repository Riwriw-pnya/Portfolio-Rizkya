(function initCursor() {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth lag for outer ring
  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverables = document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card, input, textarea');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
})();



/* typewriter */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Student Software Engineer',
    'Modern Web Enthusiast',
    'UI/UX Enthusiast',
    'Junior Game Developer',
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER_WORD = 1800;

  function type() {
    const current = words[wordIdx];
    if (isDeleting) {
      el.textContent = current.slice(0, --charIdx);
    } else {
      el.textContent = current.slice(0, ++charIdx);
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIdx === current.length) {
      delay = PAUSE_AFTER_WORD;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      delay = 300;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1200);
})();


/* scroll reveal */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Staggered delay for siblings
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          const delay = (idx % 4) * 100; // max 4 items staggered
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
})();


/* bars */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const width = fill.getAttribute('data-width') + '%';
          // Short delay so reveal animation completes first
          setTimeout(() => { fill.style.width = width; }, 400);
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(fill => observer.observe(fill));
})();


/* hover tilt */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX =  ((y - cy) / cy) * -5;
      const rotateY =  ((x - cx) / cx) *  5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* scroll bar */
(function initScrollProgress() {
  // Inject a thin top progress bar
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; width: 0%;
    background: linear-gradient(90deg, #e8ff78, #a3e635);
    z-index: 2000; transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  });
})();