(function () {
  var doc = document.documentElement;
  var hdr = document.querySelector('.hdr');
  var burger = document.querySelector('.burger');

  /* header: прозорий над героєм, суцільний після прокрутки */
  function onScroll() {
    if (!hdr || hdr.classList.contains('hdr--page')) return;
    hdr.classList.toggle('is-solid', window.scrollY > 40);
  }
  var fab = document.querySelector('.fab');
  function onFab() { if (fab) fab.classList.toggle('show', window.scrollY > 420); }
  onFab();
  window.addEventListener('scroll', onFab, { passive: true });
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* мобільне меню */
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* поява блоків при прокрутці */
  var els = document.querySelectorAll('.rv, .band');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  /* зубна формула в героі: затримка анімації для кожного зуба */
  var arch = document.querySelector('.arch');
  if (arch) {
    var teeth = arch.querySelectorAll('.t');
    var labels = arch.querySelectorAll('text');
    teeth.forEach(function (t, i) { t.style.animationDelay = (0.25 + (i % 16) * 0.05 + (i >= 16 ? 0.35 : 0)) + 's'; });
    labels.forEach(function (t, i) { t.style.animationDelay = (1.2 + (i % 16) * 0.03) + 's'; });

    /* після малювання підсвічуємо центральні різці 11 і 21 */
    setTimeout(function () {
      ['11', '21'].forEach(function (n) {
        var el = arch.querySelector('[data-n="' + n + '"]');
        if (el) el.classList.add('hit');
      });
    }, 2300);

    /* при русі мишкою — підсвічується найближчий зуб */
    var hero = document.querySelector('.hero');
    var fine = window.matchMedia('(pointer:fine)').matches;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hero && fine && !reduce) {
      var last = null;
      hero.addEventListener('pointermove', function (ev) {
        var best = null, bd = 1e9;
        teeth.forEach(function (t) {
          var r = t.getBoundingClientRect();
          var dx = r.left + r.width / 2 - ev.clientX, dy = r.top + r.height / 2 - ev.clientY;
          var d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = t; }
        });
        if (best && bd < 3600 && best !== last) {
          if (last && last.dataset.keep !== '1') last.classList.remove('hit');
          best.classList.add('hit');
          last = best;
        }
      });
    }
  }

  /* навігація по послугах: активний пункт */
  var snav = document.querySelectorAll('.svc-nav a');
  if (snav.length && 'IntersectionObserver' in window) {
    var map = {};
    snav.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          snav.forEach(function (a) { a.classList.remove('on'); });
          var a = map[e.target.id];
          if (a) { a.classList.add('on'); a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* рік у футері */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
