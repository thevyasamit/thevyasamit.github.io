/* Site chrome: theme toggle, mobile nav, heading anchors. No dependencies. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- theme */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      var dark = theme === 'dark';
      toggle.setAttribute('aria-pressed', String(dark));
      var label = toggle.querySelector('.theme-toggle__label');
      if (label) label.textContent = dark ? 'Light mode' : 'Dark mode';
    }
  }

  // The inline bootstrap in <head> normally sets this before first paint;
  // re-read the store here so the toggle is still correct if that ever fails.
  var storedTheme = null;
  try { storedTheme = localStorage.getItem('theme'); } catch (e) { /* private mode */ }
  applyTheme(storedTheme || root.getAttribute('data-theme') || 'light');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });
  }

  // Follow the OS only while the visitor has made no explicit choice.
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (e) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
    if (!stored) applyTheme(e.matches ? 'dark' : 'light');
  };
  if (mq.addEventListener) mq.addEventListener('change', onSchemeChange);
  else if (mq.addListener) mq.addListener(onSchemeChange);

  /* ------------------------------------------------------------ mobile nav */
  var navToggle = document.querySelector('.nav-toggle');
  var sidebar = document.getElementById('sidebar');

  if (navToggle && sidebar) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
      sidebar.classList.toggle('is-open', !open);
    });

    // Close after following an in-page link on small screens.
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a') && sidebar.classList.contains('is-open')) {
        sidebar.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
        sidebar.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------ scrollspy */
  /* Nav items like /#experience point at sections of the CURRENT page, so
     Liquid's aria-current can never match them -- the URL never changes as
     you scroll. Highlight whichever section is actually in view instead. */

  var spyLinks = [];
  var homeLink = null;

  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#') + 1) : '';
    if (!hash) {
      // The plain page link (Home) is the fallback when nothing is in view.
      if (a.getAttribute('aria-current') === 'page') homeLink = a;
      return;
    }
    var target = document.getElementById(hash);
    if (target) spyLinks.push({ link: a, target: target });
  });

  // Decides which entry is current. Split out so it can be unit-tested:
  // `tops` are viewport-relative section offsets, in document order.
  function pickActive(tops, line, atBottom) {
    if (!tops.length) return -1;
    if (atBottom) return tops.length - 1;
    var active = -1;
    for (var i = 0; i < tops.length; i++) {
      if (tops[i] <= line) active = i;
    }
    return active;
  }

  if (spyLinks.length) {
    // Offset the trigger line past the sticky header on small screens.
    var headerOffset = function () {
      var sb = document.getElementById('sidebar');
      if (!sb) return 0;
      var pos = window.getComputedStyle(sb).position;
      return pos === 'sticky' && window.innerWidth < 960 ? sb.offsetHeight : 0;
    };

    var applySpy = function () {
      var line = headerOffset() + 96;
      var tops = spyLinks.map(function (s) { return s.target.getBoundingClientRect().top; });
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      var idx = pickActive(tops, line, atBottom);

      spyLinks.forEach(function (s, i) {
        if (i === idx) s.link.setAttribute('aria-current', 'location');
        else s.link.removeAttribute('aria-current');
      });
      if (homeLink) {
        if (idx === -1) homeLink.setAttribute('aria-current', 'page');
        else homeLink.removeAttribute('aria-current');
      }
    };

    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { applySpy(); ticking = false; });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onScroll);
    applySpy();

    // Exposed only for tests; harmless in the browser.
    window.__pickActive = pickActive;
  }

  /* -------------------------------------------------- anchors on headings */
  var body = document.querySelector('.post__body');
  if (body) {
    body.querySelectorAll('h2[id], h3[id]').forEach(function (h) {
      var a = document.createElement('a');
      a.className = 'heading-anchor';
      a.href = '#' + h.id;
      a.setAttribute('aria-label', 'Link to this section: ' + h.textContent.trim());
      a.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-link"></use></svg>';
      h.appendChild(a);
    });
  }
})();
