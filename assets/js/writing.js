/* Tag filtering + full-text search for /writing/.
   Progressive enhancement: the post list is already in the DOM and fully
   usable without this file. Everything here only hides or reveals it. */
(function () {
  'use strict';

  var filters = document.querySelector('[data-filters]');
  var list = document.querySelector('[data-posts]');
  if (!filters || !list) return;

  var cards = Array.prototype.slice.call(list.querySelectorAll('.post-card'));
  if (!cards.length) return;

  var input = filters.querySelector('#search-input');
  var clearBtn = filters.querySelector('.search__clear');
  var tagButtons = Array.prototype.slice.call(filters.querySelectorAll('.tagbar .tag'));
  var status = filters.querySelector('.filter-status');
  var empty = document.querySelector('[data-empty]');
  var resetBtn = empty ? empty.querySelector('[data-reset]') : null;

  var state = { q: '', tag: '' };
  var index = null;      // url -> searchable text, loaded on demand
  var indexPromise = null;

  filters.hidden = false; // reveal only once JS is running

  /* ------------------------------------------------------------- indexing */
  function loadIndex() {
    if (indexPromise) return indexPromise;
    var base = document.querySelector('link[rel="sitemap"]');
    var url = (base ? base.getAttribute('href').replace(/sitemap\.xml$/, '') : '/') + 'search.json';

    indexPromise = fetch(url)
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (data) {
        index = {};
        data.forEach(function (item) {
          index[item.url] = (item.title + ' ' + (item.tags || []).join(' ') + ' ' + item.text).toLowerCase();
        });
        return index;
      })
      .catch(function () { index = {}; return index; });

    return indexPromise;
  }

  /* ------------------------------------------------------------ filtering */
  function cardText(card) {
    // Title + excerpt are always available; body text arrives with the index.
    var local = card.textContent.toLowerCase();
    var url = card.getAttribute('data-url');
    return index && index[url] ? local + ' ' + index[url] : local;
  }

  function matches(card) {
    if (state.tag) {
      var tags = (card.getAttribute('data-tags') || '').split('|');
      if (tags.indexOf(state.tag) === -1) return false;
    }
    if (state.q) {
      var haystack = cardText(card);
      // every whitespace-separated term must appear somewhere
      return state.q.split(/\s+/).every(function (term) {
        return haystack.indexOf(term) !== -1;
      });
    }
    return true;
  }

  function apply() {
    var shown = 0;
    cards.forEach(function (card) {
      var ok = matches(card);
      card.hidden = !ok;
      if (ok) shown++;
    });

    if (empty) empty.hidden = shown !== 0;
    list.hidden = shown === 0;

    if (status) {
      if (!state.q && !state.tag) {
        status.textContent = '';
      } else {
        var bits = [];
        if (state.tag) bits.push('tagged "' + state.tag + '"');
        if (state.q) bits.push('matching "' + state.q + '"');
        status.textContent = shown + (shown === 1 ? ' post ' : ' posts ') + bits.join(' and ');
      }
    }

    if (clearBtn) clearBtn.hidden = !state.q;
    syncUrl();
  }

  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    var params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.tag) params.set('tag', state.tag);
    var qs = params.toString();
    history.replaceState(null, '', qs ? location.pathname + '?' + qs : location.pathname);
  }

  /* --------------------------------------------------------------- events */
  var timer;
  function onSearch(value) {
    state.q = value.trim().toLowerCase();
    if (state.q) {
      loadIndex().then(apply);   // body text folded in once available
    }
    apply();
  }

  if (input) {
    input.addEventListener('input', function () {
      var value = input.value;
      clearTimeout(timer);
      timer = setTimeout(function () { onSearch(value); }, 120);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && input.value) {
        input.value = '';
        onSearch('');
      }
    });

    // Warm the index on first focus so the first keystroke feels instant.
    input.addEventListener('focus', loadIndex, { once: true });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = '';
      onSearch('');
      input.focus();
    });
  }

  tagButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = btn.getAttribute('data-tag') || '';
      state.tag = state.tag === tag ? '' : tag;
      selectTag(state.tag);
      apply();
    });
  });

  function selectTag(tag) {
    state.tag = tag;
    tagButtons.forEach(function (b) {
      var on = (b.getAttribute('data-tag') || '') === tag;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (input) input.value = '';
      state.q = '';
      selectTag('');
      apply();
      if (input) input.focus();
    });
  }

  /* --------------------------------------------- hydrate from the query string */
  var params = new URLSearchParams(location.search);
  var q0 = params.get('q');
  var tag0 = params.get('tag');

  if (tag0 && tagButtons.some(function (b) { return b.getAttribute('data-tag') === tag0; })) {
    selectTag(tag0);
  } else {
    selectTag('');
  }

  if (q0) {
    if (input) input.value = q0;
    state.q = q0.trim().toLowerCase();
    loadIndex().then(apply);
  }

  apply();
})();
