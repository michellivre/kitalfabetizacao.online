// =============================================
// Kit Alfa Kids — main.js
// =============================================

// ---------- COUNTDOWN TIMER ----------
(function () {
  const STORAGE_KEY = 'alfa_countdown_end';
  const DURATION_MIN = 15;

  function getEndTime() {
    let end = localStorage.getItem(STORAGE_KEY);
    if (!end) {
      end = Date.now() + DURATION_MIN * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, end);
    }
    return parseInt(end, 10);
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const remaining = getEndTime() - Date.now();
    const el = document.getElementById('countdown-timer');
    if (!el) return;

    if (remaining <= 0) {
      el.textContent = '00:00';
      // Reset timer so it loops (or redirect to urgency page)
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    el.textContent = pad(mins) + ':' + pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

// ---------- SCROLL ANIMATIONS ----------
const animEls = document.querySelectorAll(
  '.card, .step, .inside-item, .bonus-card, .fb-card'
);

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  );
  animEls.forEach((el) => io.observe(el));
} else {
  // Fallback: show all immediately
  animEls.forEach((el) => el.classList.add('visible'));
}

// ---------- HIDE STICKY ON SCROLL UP (show when scrolling down) ----------
const stickyBottom = document.getElementById('sticky-bottom');
let lastY = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (stickyBottom) {
    // Hide after hero section (approx 600px), show always below
    if (y < 400) {
      stickyBottom.style.transform = 'translateY(100%)';
    } else {
      stickyBottom.style.transform = 'translateY(0)';
    }
  }
  lastY = y;
}, { passive: true });

if (stickyBottom) {
  stickyBottom.style.transition = 'transform .3s ease';
  stickyBottom.style.transform = 'translateY(100%)'; // start hidden
}

// ---------- SOCIAL PROOF POPUPS ----------
(function () {
  const buyers = [
    { name: 'Ana Paula R.',  city: 'São Paulo, SP',      time: 'agora mesmo' },
    { name: 'Mariana S.',    city: 'Belo Horizonte, MG', time: 'há 2 minutos' },
    { name: 'Fernanda C.',   city: 'Rio de Janeiro, RJ', time: 'há 3 minutos' },
    { name: 'Juliana M.',    city: 'Curitiba, PR',       time: 'há 4 minutos' },
    { name: 'Patrícia L.',   city: 'Fortaleza, CE',      time: 'agora mesmo' },
    { name: 'Camila T.',     city: 'Salvador, BA',       time: 'há 1 minuto' },
    { name: 'Renata O.',     city: 'Manaus, AM',         time: 'há 5 minutos' },
    { name: 'Larissa B.',    city: 'Porto Alegre, RS',   time: 'há 2 minutos' },
    { name: 'Aline F.',      city: 'Recife, PE',         time: 'agora mesmo' },
    { name: 'Déborah N.',    city: 'Goiânia, GO',        time: 'há 3 minutos' },
    { name: 'Simone G.',     city: 'Brasília, DF',       time: 'há 1 minuto' },
    { name: 'Tatiane V.',    city: 'Campinas, SP',       time: 'há 4 minutos' },
    { name: 'Priscila A.',   city: 'Belém, PA',          time: 'agora mesmo' },
    { name: 'Vanessa H.',    city: 'Florianópolis, SC',  time: 'há 2 minutos' },
    { name: 'Cristiane P.',  city: 'Natal, RN',          time: 'há 6 minutos' },
  ];

  const popup = document.createElement('div');
  popup.id = 'sp-popup';
  popup.innerHTML =
    '<div class="sp-icon">📚</div>' +
    '<div class="sp-content">' +
      '<div class="sp-name"></div>' +
      '<div class="sp-msg">acabou de adquirir o Kit Turminha Ativação Kids! 🎉</div>' +
      '<div class="sp-time"></div>' +
    '</div>' +
    '<button class="sp-close" aria-label="Fechar">✕</button>';
  document.body.appendChild(popup);

  const nameEl  = popup.querySelector('.sp-name');
  const timeEl  = popup.querySelector('.sp-time');
  const closeBtn = popup.querySelector('.sp-close');

  let hideTimer;
  let idx = Math.floor(Math.random() * buyers.length);

  function hide() {
    clearTimeout(hideTimer);
    popup.classList.remove('sp-show');
  }

  function show() {
    const b = buyers[idx % buyers.length];
    idx++;
    nameEl.textContent = b.name + ' · ' + b.city;
    timeEl.textContent = b.time;
    popup.classList.add('sp-show');
    hideTimer = setTimeout(hide, 5000);
  }

  closeBtn.addEventListener('click', hide);

  // First popup after 6s, then every 18s
  setTimeout(function loop() {
    show();
    setTimeout(loop, 18000);
  }, 6000);
})();

// ---------- FAQ ACCORDION ----------
document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach((el) => {
      el.classList.remove('open');
      el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    // Open clicked (if it wasn't already open)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ---------- ACTIVITY CAROUSEL ----------
(function () {
  const wrap   = document.getElementById('at-carousel');
  if (!wrap) return;
  const track  = wrap.querySelector('.carousel-track');
  const slides = wrap.querySelectorAll('.carousel-slide');
  const dotsEl = document.getElementById('at-dots');
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  // Build dots
  slides.forEach(function (_, i) {
    var d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', function () { goTo(i); resetAuto(); });
    dotsEl.appendChild(d);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    wrap.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () { goTo(current + 1); }, 3200);
  }

  // Touch / swipe
  var startX = 0;
  wrap.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    clearInterval(autoTimer);
  }, { passive: true });

  wrap.addEventListener('touchend', function (e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    resetAuto();
  }, { passive: true });

  // Navigation Buttons
  const btnPrev = document.getElementById('at-prev');
  const btnNext = document.getElementById('at-next');

  if (btnPrev) {
    btnPrev.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  }
  if (btnNext) {
    btnNext.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
  }

  resetAuto();
})();

