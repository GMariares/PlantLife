/* PlantLife — the stall.
 *
 * Plain browser JavaScript, no build step, no framework, no backend. State lives
 * in localStorage because there is no server to hold it, and the basket rail says
 * so rather than letting anyone discover it by losing a season.
 *
 * Live conditions come from Open-Meteo: keyless and CORS-enabled, which is the
 * only kind of provider a static page can use honestly — a page cannot hide an
 * API key. When it is unreachable the stall still works from the regional
 * calendar, and the board states that it is doing so.
 */
(function () {
  'use strict';

  var S = window.PlantLifeSeason;
  var DATA = window.PlantLifeCrops;
  var GEO = window.PlantLifeRegions;
  var FAMILIES = DATA.FAMILIES;
  /* The shipped set plus the grower's own entries. A custom crop carries the
     dates its owner gave it and is marked as theirs, because PlantLife has no
     authority over timings it did not source. */
  function catalogue() { return DATA.CROPS.concat(state.custom); }
  var CROPS = DATA.CROPS;

  var STORE_KEY = 'plantlife.v1';
  var GEOCODE = 'https://geocoding-api.open-meteo.com/v1/search';
  var FORECAST = 'https://api.open-meteo.com/v1/forecast';

  // ── Authored icon set: one grid, one stroke weight, no glyph substitutes ──
  var ICON = {
    pin: 'M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z M20 20l-4.9-4.9',
    check: 'M4 12.5 9.5 18 20 6',
    close: 'M6 6l12 12 M18 6 6 18',
    clear: 'M12 4.5v-2 M12 21.5v-2 M4.5 12h-2 M21.5 12h-2 M6.7 6.7 5.3 5.3 M18.7 18.7l-1.4-1.4 M6.7 17.3l-1.4 1.4 M18.7 5.3l-1.4 1.4 M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
    cloud: 'M7 18h10a4 4 0 0 0 .4-8 6 6 0 0 0-11.5 1.6A3.6 3.6 0 0 0 7 18Z',
    rain: 'M7 15h10a4 4 0 0 0 .4-8 6 6 0 0 0-11.5 1.6A3.6 3.6 0 0 0 7 15Z M8.5 18.5 7.5 21 M12 18.5 11 21 M15.5 18.5 14.5 21',
    frost: 'M12 3v18 M4.2 7.5l15.6 9 M19.8 7.5l-15.6 9 M9 5l3 2 3-2 M9 19l3-2 3 2',
    fog: 'M4 9h16 M4 13h16 M6 17h12',
    chev: 'M6 9.5 12 15.5 18 9.5'
  };

  function icon(name, cls) {
    var d = ICON[name] || ICON.cloud;
    var paths = d.split(' M').map(function (p, i) { return '<path d="' + (i ? 'M' + p : p) + '"/>'; }).join('');
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }

  function weatherIcon(code) {
    if (code === 0 || code === 1) return 'clear';
    if (code === 45 || code === 48) return 'fog';
    if (code >= 71 && code <= 77) return 'frost';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 86) || code >= 95) return 'rain';
    return 'cloud';
  }
  function weatherWord(code) {
    var m = { 0: 'clear', 1: 'mostly clear', 2: 'part cloud', 3: 'overcast', 45: 'fog', 48: 'freezing fog',
      51: 'light drizzle', 53: 'drizzle', 55: 'heavy drizzle', 61: 'light rain', 63: 'rain', 65: 'heavy rain',
      66: 'freezing rain', 67: 'freezing rain', 71: 'light snow', 73: 'snow', 75: 'heavy snow', 77: 'snow grains',
      80: 'showers', 81: 'showers', 82: 'heavy showers', 95: 'thunderstorm', 96: 'thunderstorm', 99: 'thunderstorm' };
    return m[code] || 'cloud';
  }

  // ── State ────────────────────────────────────────────────────────────────
  var state = {
    location: null,      // { name, lat, lon, regionId, regionName, confidence, km }
    frost: null,         // { last, first } grower override
    basket: [],
    hidden: [],
    stages: {},
    custom: [],
    legend: null,   /* resolved at init from viewport width */
    adding: false,
    month: new Date().getMonth(),
    monthPinned: false,
    family: 'all',
    opened: null,
    weather: null,       // { temp, code, frostRisk, min }
    weatherFailed: false,
    locating: false,
    geoDenied: false,
    outOfArea: false,
    editingFrost: false,
    searching: false,
    results: null,
    searchError: null
  };

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      var s = JSON.parse(raw);
      if (s.location) state.location = s.location;
      if (s.frost) state.frost = s.frost;
      if (Array.isArray(s.basket)) state.basket = s.basket;
      if (Array.isArray(s.hidden)) state.hidden = s.hidden;
      if (s.stages && typeof s.stages === 'object') state.stages = s.stages;
      if (Array.isArray(s.custom)) state.custom = s.custom;
      if (typeof s.legendSeen === 'boolean') state.legend = !s.legendSeen;
    } catch (e) { /* corrupt or unavailable storage is not fatal; start fresh */ }
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        location: state.location, frost: state.frost, basket: state.basket, hidden: state.hidden, stages: state.stages,
        custom: state.custom, legendSeen: !state.legend
      }));
    } catch (e) { /* private mode: the session still works, it just will not persist */ }
  }

  function region() {
    if (!state.location || !state.location.regionId) return null;
    for (var i = 0; i < GEO.REGIONS.length; i++) {
      if (GEO.REGIONS[i].id === state.location.regionId) return GEO.REGIONS[i];
    }
    return null;
  }
  function shift() { return S.frostShift(region(), state.frost); }
  function frostDates() {
    var r = region();
    return {
      last: (state.frost && state.frost.last) || (r && r.lastFrost) || null,
      first: (state.frost && state.frost.first) || (r && r.firstFrost) || null,
      frostFree: !!(r && r.frostFree),
      overridden: !!(state.frost && (state.frost.last || state.frost.first))
    };
  }

  /* The reference day: today when the grower is looking at the current month,
     the 15th when they have scrubbed the rail somewhere else. */
  function referenceDay() {
    var now = new Date();
    if (!state.monthPinned || state.month === now.getMonth()) return S.dateToDoy(now);
    return S.doy(pad(state.month + 1) + '-15');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function stageOf(id) { return state.stages[id] || null; }
  function fmt(mmdd) {
    if (!mmdd) return '—';
    return S.label(S.doy(mmdd));
  }

  // ── Data fetching ────────────────────────────────────────────────────────
  function jsonp(url) {
    return fetch(url, { mode: 'cors' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function loadWeather() {
    if (!state.location) return;
    var u = FORECAST + '?latitude=' + state.location.lat.toFixed(3) +
      '&longitude=' + state.location.lon.toFixed(3) +
      '&current=temperature_2m,weather_code&daily=temperature_2m_min&forecast_days=7&timezone=auto';
    jsonp(u).then(function (d) {
      var mins = (d.daily && d.daily.temperature_2m_min) || [];
      var lowest = mins.length ? Math.min.apply(null, mins) : null;
      state.weather = {
        temp: d.current ? Math.round(d.current.temperature_2m) : null,
        code: d.current ? d.current.weather_code : 3,
        min: lowest === null ? null : Math.round(lowest),
        frostRisk: lowest !== null && lowest <= 2
      };
      state.weatherFailed = false;
      render();
    }).catch(function () { state.weatherFailed = true; render(); });
  }

  function setLocation(name, lat, lon) {
    var match = GEO.nearestRegion(lat, lon);
    state.outOfArea = !match;
    state.location = {
      name: name, lat: lat, lon: lon,
      regionId: match ? match.region.id : null,
      regionName: match ? match.region.name : null,
      confidence: match ? match.region.confidence : null,
      km: match ? match.km : null
    };
    state.geoDenied = false;
    state.results = null;
    state.searchError = null;
    save();
    render(true);
    loadWeather();
  }

  function locate() {
    if (!navigator.geolocation) { state.geoDenied = true; render(); return; }
    state.locating = true; render();
    navigator.geolocation.getCurrentPosition(function (pos) {
      state.locating = false;
      var lat = pos.coords.latitude, lon = pos.coords.longitude;
      jsonp(GEOCODE + '?latitude=' + lat + '&longitude=' + lon + '&count=1&language=en&format=json')
        .then(function (d) {
          var hit = d.results && d.results[0];
          setLocation(hit ? hit.name : lat.toFixed(2) + '°, ' + lon.toFixed(2) + '°', lat, lon);
        })
        .catch(function () { setLocation(lat.toFixed(2) + '°, ' + lon.toFixed(2) + '°', lat, lon); });
    }, function () {
      state.locating = false; state.geoDenied = true; render();
    }, { timeout: 10000, maximumAge: 600000 });
  }

  function search(q) {
    if (!q || q.length < 2) return;
    state.searching = true; state.searchError = null; render();
    jsonp(GEOCODE + '?name=' + encodeURIComponent(q) + '&count=5&language=en&format=json')
      .then(function (d) {
        state.searching = false;
        state.results = (d.results || []).map(function (r) {
          return { name: r.name + (r.admin1 ? ', ' + r.admin1 : ''), lat: r.latitude, lon: r.longitude };
        });
        if (!state.results.length) state.searchError = 'No place found by that name. Try the nearest town.';
        render();
      })
      .catch(function () {
        state.searching = false;
        state.searchError = 'Could not reach the place lookup. Check your connection, or try again.';
        render();
      });
  }

  // ── Evaluation ───────────────────────────────────────────────────────────
  function visibleCrops() {
    return catalogue().filter(function (c) {
      if (state.hidden.indexOf(c.id) !== -1) return false;
      return state.family === 'all' || c.family === state.family;
    });
  }
  function hiddenCrops() {
    var all = catalogue();
    return state.hidden.map(function (id) {
      for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
      return null;
    }).filter(Boolean);
  }
  /* Conditions only gate the CURRENT month: a forecast says nothing about
     what April will be like, so scrubbing away from now drops the gate. */
  function conditions() {
    if (!state.weather) return null;
    if (state.monthPinned && state.month !== new Date().getMonth()) return null;
    return { min: state.weather.min, frostRisk: state.weather.frostRisk };
  }
  function evaluated() { return S.evaluateAll(visibleCrops(), shift(), referenceDay(), conditions()); }

  // ── Rendering ────────────────────────────────────────────────────────────
  var el = {};

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function boardAsking() {
    var denied = state.geoDenied;
    return '' +
      '<div class="board__place">' +
        '<h1 class="ask__head">Where are you growing?</h1>' +
        '<p class="ask__sub">Sowing dates are computed from your last and first frost; this week’s forecast holds back anything tender. Without a place, it is only a printed calendar.</p>' +
        '<div class="ask__row">' +
          '<button class="btn btn--solid" type="button" data-act="locate"' + (state.locating ? ' disabled' : '') + '>' +
            icon('pin') + (state.locating ? 'Finding you…' : 'Use my location') + '</button>' +
          '<form class="ask__form" data-act="search-form">' +
            '<input class="field" type="text" name="q" placeholder="or type a town — Porto, Sevilla, Palermo" ' +
              'aria-label="Search for a town" autocomplete="off">' +
            '<button class="btn" type="submit">' + icon('search') + '<span class="u-visually-hidden">Search</span></button>' +
          '</form>' +
        '</div>' +
        (state.results && state.results.length ?
          '<ul class="suggest">' + state.results.map(function (r, i) {
            return '<li><button type="button" data-act="pick-place" data-i="' + i + '">' + esc(r.name) + '</button></li>';
          }).join('') + '</ul>' : '') +
        (state.searching ? '<p class="note">Looking…</p>' : '') +
        (state.searchError ? '<p class="note note--warn">' + esc(state.searchError) + '</p>' : '') +
        (denied ? '<p class="note note--warn">Location access was declined — that is fine, typing a town works exactly as well.</p>' : '') +
      '</div>';
  }

  function boardAnswered() {
    var loc = state.location, f = frostDates(), sh = shift(), w = state.weather;
    var meta = [];
    meta.push('<b>' + Math.abs(loc.lat).toFixed(2) + '°' + (loc.lat >= 0 ? 'N' : 'S') + '</b>');
    if (loc.regionName) meta.push(esc(loc.regionName));
    if (f.frostFree) {
      meta.push('effectively <b>frost-free</b>');
    } else if (f.last || f.first) {
      meta.push('last frost <b>' + fmt(f.last) + '</b>');
      meta.push('first frost <b>' + fmt(f.first) + '</b>');
    }
    if (sh.spring) meta.push('calendar shifted <b>' + (sh.spring > 0 ? '+' : '') + sh.spring + ' days</b>');

    var notes = [];
    if (state.outOfArea) {
      notes.push('This place sits outside the regions PlantLife has frost dates checked for, so no dates are being assumed. Set your own frost dates and everything below becomes yours.');
    } else if (loc.confidence === 'medium') {
      notes.push('Frost dates here vary by two to four weeks with altitude and shelter. If you know your own garden’s dates, they will beat this table.');
    }
    if (f.overridden) notes.push('Using the frost dates you set.');
    if (state.weatherFailed) notes.push('Live conditions are unavailable right now — dates below come from the regional calendar alone, not from today’s weather.');
    var alert = '';
    if (w && w.frostRisk) {
      var scrubbed = state.monthPinned && state.month !== new Date().getMonth();
      alert = '<p class="alert">' + icon('frost') + 'Frost forecast this week: ' + w.min +
        '°C. Anything tender is held back below.' +
        (scrubbed ? ' That is this week — not ' + S.MONTH_FULL[state.month] + '.' : '') + '</p>';
    }

    return '' +
      '<div class="board__place">' +
        '<h1 class="board__name">' + esc(loc.name) + '</h1>' +
        '<p class="board__meta">' + meta.join(' · ') + '</p>' +
        (notes.length ? '<p class="note' + (state.outOfArea ? ' note--warn' : '') + '">' + notes.join(' ') + '</p>' : '') +
        alert +
        (state.editingFrost ? frostForm(f) : '') +
        '<div class="ask__row" style="margin-top:.7rem">' +
          '<button class="btn" type="button" data-act="reset">' + icon('pin') + 'Change place</button>' +
          '<button class="btn" type="button" data-act="edit-frost">' + icon('frost') +
            (state.editingFrost ? 'Close' : 'Set my frost dates') + '</button>' +
        '</div>' +
      '</div>' +
      (w ?
        '<div class="board__weather">' + icon(weatherIcon(w.code), 'board__icon') +
          '<div><div class="board__temp">' + (w.temp === null ? '—' : w.temp + '°') + '</div>' +
          '<div class="board__cond">' + weatherWord(w.code) + '</div></div>' +
        '</div>' : '');
  }

  function frostForm(f) {
    return '<form class="ask__row" data-act="frost-form" style="margin-top:.75rem">' +
      '<label class="board__meta" style="flex:1 1 11rem">Last spring frost' +
        '<input class="field" type="text" name="last" inputmode="numeric" placeholder="MM-DD" value="' + (f.last || '') + '"></label>' +
      '<label class="board__meta" style="flex:1 1 11rem">First autumn frost' +
        '<input class="field" type="text" name="first" inputmode="numeric" placeholder="MM-DD" value="' + (f.first || '') + '"></label>' +
      '<button class="btn btn--solid" type="submit" style="align-self:flex-end">Save</button>' +
      '</form>';
  }

  function renderBoard() {
    el.board.innerHTML = '<div class="board__inner">' +
      (state.location ? boardAnswered() : boardAsking()) + '</div>';
  }

  function renderRail() {
    var now = new Date().getMonth();
    el.rail.innerHTML = '<div class="rail__inner" role="group" aria-label="Month">' +
      S.MONTH_NAMES.map(function (m, i) {
        return '<button class="rail__month" type="button" data-act="month" data-i="' + i + '"' +
          ' aria-pressed="' + (i === state.month) + '"' + (i === now ? ' data-today="true"' : '') +
          ' title="' + S.MONTH_FULL[i] + (i === now ? ' — this month' : '') + '">' + m + '</button>';
      }).join('') + '</div>';
  }


  function swatch(kind, label) {
    return '<li class="legend__row"><span class="legend__swatch legend__swatch--' + kind + '"></span>' +
      '<span class="legend__text">' + label + '</span></li>';
  }

  function renderLegend() {
    var toggle = '<div class="legend__bar">' +
      '<button class="legend__toggle" type="button" data-act="legend" aria-expanded="' + state.legend + '">' +
      (state.legend ? 'Hide the key' : 'What the colours mean') + '</button></div>';
    if (!state.legend) { el.legend.innerHTML = toggle; return; }
    var fam = Object.keys(FAMILIES).map(function (k) {
      return '<li class="legend__fam"><span class="legend__chip" style="background:var(--m-' + k + ')"></span>' +
        esc(FAMILIES[k].name) + '</li>';
    }).join('');

    el.legend.innerHTML = toggle + '<div class="legend__inner">' +
      '<div class="legend__head">' +
        '<h2 class="legend__title">What the colours mean</h2>' +
        '<button class="legend__close" type="button" data-act="legend-close">' + icon('close') + 'Got it</button>' +
      '</div>' +
      '<div class="legend__cols">' +
        '<div class="legend__group"><h3 class="legend__sub">The twelve-month bar</h3><ul class="legend__list">' +
          swatch('sow', 'Sow or plant this month') +
          swatch('harvest', 'Harvest this month') +
          swatch('none', 'Neither — nothing to do') +
          swatch('now', 'The month you are looking at') +
        '</ul></div>' +
        '<div class="legend__group"><h3 class="legend__sub">The crates</h3><ul class="legend__list">' +
          swatch('open', 'Full colour — you can sow it now') +
          swatch('shut', 'Drained to grey — not this month') +
          swatch('bar', 'Black bar — HOLD, or what you have recorded') +
        '</ul>' +
        '<p class="legend__note">Colour never carries a state on its own: the wording, the position on the ' +
        'stall and the crate\u2019s border say the same thing.</p></div>' +
        '<div class="legend__group"><h3 class="legend__sub">The eight families</h3>' +
        '<ul class="legend__fams">' + fam + '</ul></div>' +
      '</div></div>';
  }

  function renderMarks() {
    var keys = Object.keys(FAMILIES);
    el.marks.innerHTML =
      '<button class="mark" type="button" data-act="family" data-f="all" aria-pressed="' + (state.family === 'all') + '">All crops</button>' +
      keys.map(function (k) {
        return '<button class="mark" type="button" data-act="family" data-f="' + k + '" data-family="' + k + '"' +
          ' style="--chip:var(--m-' + k + ')" aria-pressed="' + (state.family === k) + '">' +
          '<span class="mark__chip"></span>' + esc(FAMILIES[k].name) + '</button>';
      }).join('');
  }

  function crateHTML(e) {
    var c = e.crop, st = e.state;
    var open = st.status === 'urgent' || st.status === 'open' || st.status === 'held';
    var picked = state.basket.indexOf(c.id) !== -1;
    var isOpen = state.opened === c.id;
    var rep = e.report || null;
    var cls = ['crate'];
    if (rep) cls.push('crate--staged');
    if (st.status === 'urgent' && !rep) cls.push('crate--urgent');
    if (st.status === 'held' && !rep) cls.push('crate--held');
    if (!open && !rep) cls.push('crate--closed');
    if (picked) cls.push('crate--picked');
    if (isOpen) cls.push('crate--open');

    var pips = [1, 2, 3].map(function (n) {
      return '<span class="ease__pip' + (n <= (4 - c.ease) ? ' ease__pip--on' : '') + '"></span>';
    }).join('');
    var easeWord = c.ease === 1 ? 'easy' : c.ease === 2 ? 'moderate' : 'tricky';
    var span = c.kind === 'perennial'
      ? (c.years[0] === 0 ? 'crops year one'
         : c.years[0] === c.years[1]
           ? c.years[0] + (c.years[0] === 1 ? ' yr to fruit' : ' yrs to fruit')
           : c.years[0] + '–' + c.years[1] + ' yrs to fruit')
      : c.dtm[0] + '–' + c.dtm[1] + ' days';

    var nowMonth = state.month;
    var bar = e.bar.map(function (b, i) {
      return '<span class="bar__cell"' + (b ? ' data-b="' + b + '"' : '') +
        (i === nowMonth ? ' data-now="true"' : '') + '></span>';
    }).join('');
    var months = S.MONTH_NAMES.map(function (m, i) {
      return '<span' + (i === nowMonth ? ' data-now="true"' : '') + '>' + m.charAt(0) + '</span>';
    }).join('');

    var wins = S.windowsFor(c, shift()).map(function (w) {
      var verb = w.mode === 'indoor' ? 'Start indoors' : (c.kind === 'perennial' ? 'Plant' : 'Sow');
      return verb + ' ' + S.label(w.from) + ' – ' + S.label(w.to);
    }).join('; ');
    var harv = S.harvestsFor(c, shift()).map(function (w) {
      return S.label(w.from) + ' – ' + S.label(w.to);
    }).join('; ');

    return '<li><article class="' + cls.join(' ') + '" data-crop="' + c.id + '"' +
      ' style="--field:var(--f-' + c.family + ');--mark:var(--m-' + c.family + ')">' +
      '<button class="crate__take" type="button" data-act="pick" data-id="' + c.id + '"' +
      ' aria-pressed="' + picked + '"' +
      ' aria-label="' + esc((picked ? 'Remove ' : 'Add ') + c.name + ' ' + (picked ? 'from' : 'to') +
        ' your garden. ' + st.line) + '">' +
        '<span class="crate__produce">' +
          '<span class="crate__class">' + (c.kind === 'perennial' ? 'perennial' : 'annual') + '</span>' +
          '<span class="crate__name">' + esc(c.name) + '<span class="crate__pt">' + esc(c.pt) + '</span></span>' +
          (rep ? '<span class="crate__stagebar">' + esc(rep.label) + '</span>' : '') +
        '</span>' +
        '<span class="crate__label">' +
          '<span class="bar" aria-hidden="true">' + bar + '</span>' +
          '<span class="bar__months" aria-hidden="true">' + months + '</span>' +
          '<span class="crate__line">' + esc(rep ? rep.line : st.line) + '</span>' +
          (e.retired ? '<span class="crate__retired">' + esc(e.retired.line) + '</span>' : '') +
        '</span>' +
        (picked && !rep ? '<span class="crate__picked">' + icon('check') + 'In garden</span>' : '') +
      '</button>' +
      '<button class="crate__more" type="button" data-act="open" data-id="' + c.id + '"' +
        ' aria-expanded="' + isOpen + '">' +
        '<span class="ease" title="' + easeWord + '">' + pips + ' ' + easeWord + '</span>' +
        '<span class="crate__span">' + span + '</span>' +
        icon('chev', 'crate__chev') +
      '</button>' +
      (isOpen ? '<div class="crate__open">' +
        '<dl class="facts">' +
          '<div><dt>' + (c.kind === 'perennial' ? 'Plant' : 'Sow') + '</dt><dd>' + esc(wins) + '</dd></div>' +
          '<div><dt>Harvest</dt><dd>' + esc(harv) + '</dd></div>' +
          (c.custom ? '' :
            '<div><dt>Spacing</dt><dd>' + c.spacing + ' cm apart</dd></div>' +
            '<div><dt>Water</dt><dd>' + c.water + '</dd></div>' +
            '<div><dt>Light</dt><dd>' + (c.sun === 'full' ? 'full sun' : 'sun or part shade') + '</dd></div>') +
        '</dl>' +
        '<p class="crate__note">' + esc(c.note) + '</p>' +
        (c.confidence === 'medium'
          ? '<p class="crate__caveat">' + icon('frost') + 'Timing for this crop varies widely across the region — treat these dates as a starting point, not a fixed schedule.</p>'
          : '') +
        (c.custom
          ? '<button class="crate__drop" type="button" data-act="own-remove" data-id="' + c.id + '">' +
            icon('close') + 'Delete this crop' +
            '<span class="crate__drop-note">You added it, so removing it takes the entry away for good.</span>' +
            '</button>'
          : '') +
        stageControls(c, rep) +
        '<button class="crate__drop" type="button" data-act="hide" data-id="' + c.id + '">' +
          icon('close') + 'I don’t grow this' +
          (picked ? '<span class="crate__drop-note">also takes it out of your garden</span>' : '') +
        '</button>' +
      '</div>' : '') +
      '</article></li>';
  }

  /* The grower overruling the calendar with what they actually did. Available
     on any crate, not only ones already in the garden — you cannot record
     having sown something you were never offered. Setting a stage adds it to
     the garden, because you cannot be growing what you do not have. */
  function stageControls(c, rep) {
    var rec = stageOf(c.id);
    var stages = S.stagesFor(c);
    return '<div class="stage">' +
      '<span class="stage__head">What have you actually done?</span>' +
      '<div class="stage__row">' +
        stages.map(function (sg) {
          var on = rec && rec.stage === sg;
          return '<button class="stage__btn" type="button" data-act="stage" data-id="' + c.id +
            '" data-s="' + sg + '" aria-pressed="' + !!on + '">' + esc(S.stageLabel(c, sg)) + '</button>';
        }).join('') +
        (rec ? '<button class="stage__btn stage__btn--clear" type="button" data-act="stage-clear" data-id="' +
               c.id + '">Not started</button>' : '') +
      '</div>' +
      (rec ? '<label class="stage__when">' + esc(S.stageLabel(c, rec.stage)) + ' on' +
        '<input class="stage__date" type="date" data-act="stage-date" data-id="' + c.id +
        '" value="' + esc(rec.date) + '" max="' + todayISO() + '"></label>' +
        (rep && rep.expected
          ? '<p class="stage__note">Days to maturity for this crop run ' + c.dtm[0] + '–' + c.dtm[1] +
            ', so the window above is an estimate from your date, not a promise.</p>'
          : '') : '') +
      (rec && S.finishesByClearing(c)
        ? '<button class="stage__finish" type="button" data-act="stage-finish" data-id="' + c.id + '">' +
          'Finished — put it back on the stall' +
          '<span class="stage__finish-note">Clears this record so it can be sown again next season.</span>' +
          '</button>'
        : '') +
      '</div>';
  }


  /* ── A crop the stall does not carry ──────────────────────────────────────
     PlantLife will not invent timings, so a grower-added crop carries the
     grower's own dates and is marked as theirs. The form asks in months
     because that is how a grower thinks about a sowing window. */
  function monthOptions(sel) {
    return S.MONTH_FULL.map(function (m, i) {
      return '<option value="' + (i + 1) + '"' + (sel === i + 1 ? ' selected' : '') + '>' + m + '</option>';
    }).join('');
  }

  function addForm() {
    if (!state.adding) {
      return '<button class="btn btn--dark" type="button" data-act="add-open">' +
        'Add a crop the stall does not have</button>';
    }
    var fams = Object.keys(FAMILIES).map(function (k) {
      return '<option value="' + k + '">' + esc(FAMILIES[k].name) + '</option>';
    }).join('');
    return '<form class="addcrop" data-act="add-form">' +
      '<h3 class="addcrop__title">Add your own crop</h3>' +
      '<p class="addcrop__note">PlantLife only ships dates it can stand behind, so this one uses ' +
      'yours. Give it the months you actually sow and harvest it, and it behaves like any other crate.</p>' +
      '<div class="addcrop__grid">' +
        '<label class="addcrop__field addcrop__field--wide">Name' +
          '<input class="field field--light" name="name" required maxlength="40" placeholder="Pak choi"></label>' +
        '<label class="addcrop__field">Local name <span class="addcrop__opt">optional</span>' +
          '<input class="field field--light" name="pt" maxlength="40" placeholder="couve-pak-choi"></label>' +
        '<label class="addcrop__field">Family' +
          '<select class="field field--light" name="family">' + fams + '</select></label>' +
        '<label class="addcrop__field">Type' +
          '<select class="field field--light" name="kind">' +
            '<option value="annual">Annual — sown each year</option>' +
            '<option value="perennial">Perennial — planted once</option>' +
          '</select></label>' +
        '<label class="addcrop__field">Frost-tender?' +
          '<select class="field field--light" name="tender">' +
            '<option value="no">No — it takes a frost</option>' +
            '<option value="yes">Yes — hold it until the frosts pass</option>' +
          '</select></label>' +
        '<fieldset class="addcrop__pair"><legend class="addcrop__legend">Sow or plant window</legend>' +
          '<select class="field field--light" name="sowFrom" aria-label="Sow from">' + monthOptions(9) + '</select>' +
          '<span class="addcrop__to">until</span>' +
          '<select class="field field--light" name="sowTo" aria-label="Sow until">' + monthOptions(10) + '</select>' +
        '</fieldset>' +
        '<fieldset class="addcrop__pair"><legend class="addcrop__legend">Harvest window</legend>' +
          '<select class="field field--light" name="harvFrom" aria-label="Harvest from">' + monthOptions(11) + '</select>' +
          '<span class="addcrop__to">until</span>' +
          '<select class="field field--light" name="harvTo" aria-label="Harvest until">' + monthOptions(2) + '</select>' +
        '</fieldset>' +
        '<label class="addcrop__field">Days to first harvest' +
          '<input class="field field--light" type="number" name="dtm" min="7" max="2000" value="60"></label>' +
      '</div>' +
      '<div class="addcrop__actions">' +
        '<button class="btn btn--solid btn--onlight" type="submit">Put it on the stall</button>' +
        '<button class="btn btn--dark" type="button" data-act="add-cancel">Cancel</button>' +
      '</div></form>';
  }

  var LAST_DAY = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function monthStart(m) { return pad(m) + '-01'; }
  function monthEnd(m) { return pad(m) + '-' + LAST_DAY[m - 1]; }

  function createCrop(f) {
    var name = (f.name.value || '').trim();
    if (!name) return null;
    var kind = f.kind.value, tender = f.tender.value === 'yes';
    var id = 'own-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + state.custom.length;
    var dtm = Math.max(7, Math.min(2000, parseInt(f.dtm.value, 10) || 60));
    var crop = {
      id: id, name: name, pt: (f.pt.value || '').trim() || name.toLowerCase(),
      family: f.family.value, kind: kind, ease: 2, tender: tender, custom: true,
      sow: [{ mode: kind === 'perennial' ? 'plant' : 'direct',
              from: monthStart(+f.sowFrom.value), to: monthEnd(+f.sowTo.value) }],
      harvest: [{ from: monthStart(+f.harvFrom.value), to: monthEnd(+f.harvTo.value) }],
      note: 'Your own entry. These dates are the ones you gave, not PlantLife\u2019s.',
      confidence: 'yours'
    };
    if (kind === 'perennial') crop.years = [Math.max(0, Math.round(dtm / 365)), Math.max(1, Math.round(dtm / 365))];
    else crop.dtm = [dtm, Math.round(dtm * 1.25)];
    return crop;
  }

  function quietHTML(back) {
    var famLabel = state.family === 'all' ? null : FAMILIES[state.family].plural;
    var reason = S.quietReason(state.month, famLabel);
    var soonest = back.slice().sort(function (a, b) {
      return (a.state.daysUntil === null ? 9e9 : a.state.daysUntil) - (b.state.daysUntil === null ? 9e9 : b.state.daysUntil);
    })[0];
    var head = famLabel
      ? 'No ' + famLabel + ' to start in ' + S.MONTH_FULL[state.month]
      : 'Nothing to start in ' + S.MONTH_FULL[state.month];
    return '<div class="quiet">' +
      '<h3 class="quiet__head">' + esc(head) + '</h3>' +
      '<p class="quiet__text">' + esc(reason.text) + '</p>' +
      (famLabel ? '<p class="quiet__text">' + esc(FAMILIES[state.family].note) + '</p>' : '') +
      (soonest ? '<div class="quiet__next">' +
        '<span class="quiet__label">Next window</span>' +
        '<span class="quiet__crop">' + esc(soonest.crop.name) + '</span>' +
        '<span>' + esc(soonest.state.line) + '</span>' +
        '<button class="btn btn--dark" type="button" data-act="month" data-i="' +
          (S.fromDoy(soonest.state.opens || 1).month - 1) + '">Go to that month</button>' +
        (famLabel ? '<button class="btn btn--dark" type="button" data-act="family" data-f="all">Show all crops</button>' : '') +
      '</div>' : '') +
      '</div>';
  }

  function renderStall() {
    if (!visibleCrops().length && state.hidden.length) {
      el.stall.innerHTML = '<section class="row"><div class="quiet">' +
        '<h2 class="quiet__head">The stall is empty</h2>' +
        '<p class="quiet__text">Every crop' +
        (state.family === 'all' ? '' : ' in this family') +
        ' is off the stall. Nothing is lost — put any of them back and its dates return exactly as they were.</p>' +
        '<div class="quiet__next">' +
        '<button class="btn btn--dark" type="button" data-act="unhide-all">Put them all back</button>' +
        (state.family === 'all' ? '' : '<button class="btn btn--dark" type="button" data-act="family" data-f="all">Show all crops</button>') +
        '</div></div></section>';
      return;
    }
    var iso = todayISO(), staged = [], unstaged = [];
    evaluated().forEach(function (e) {
      var rec = stageOf(e.crop.id);
      var rep = rec && rec.stage ? S.stageReport(e.crop, rec, iso) : null;
      if (rep && !rep.retired) { e.report = rep; staged.push(e); }
      else { if (rep) e.retired = rep; unstaged.push(e); }
    });
    staged.sort(function (a, b) {
      return a.report.sortKey - b.report.sortKey || a.crop.name.localeCompare(b.crop.name);
    });

    var groups = S.order(unstaged);
    var front = groups.front, back = groups.back;
    var monthWord = state.monthPinned && state.month !== new Date().getMonth()
      ? 'in ' + S.MONTH_FULL[state.month] : 'this week';

    var html = '';
    if (staged.length) {
      html += '<section class="row row--garden">' +
        '<div class="row__head"><h2 class="row__title">Growing now</h2>' +
        '<span class="row__count">' + staged.length + ' on the go</span></div>' +
        '<ul class="crates">' + staged.map(crateHTML).join('') + '</ul></section>';
    }

    html += '<section class="row row--front">' +
      '<div class="row__head"><h2 class="row__title">Sow ' + esc(monthWord) + '</h2>' +
      '<span class="row__count">' + front.length + ' open</span></div>' +
      (front.length
        ? '<ul class="crates">' + front.map(crateHTML).join('') + '</ul>'
        : quietHTML(back)) +
      '</section>';

    if (back.length) {
      html += '<section class="row row--rest">' +
        '<div class="row__head"><h2 class="row__title">Not yet, or not now</h2>' +
        '<span class="row__count">' + back.length + ' waiting</span></div>' +
        '<ul class="crates">' + back.map(crateHTML).join('') + '</ul></section>';
    }
    var off = hiddenCrops().filter(function (c) {
      return state.family === 'all' || c.family === state.family;
    });
    if (off.length) {
      html += '<section class="row row--off">' +
        '<div class="row__head"><h2 class="row__title">Off the stall</h2>' +
        '<span class="row__count">' + off.length + ' you don’t grow</span></div>' +
        '<ul class="offstall">' + off.map(function (c) {
          return '<li><span class="offstall__item" style="--mark:var(--m-' + c.family + ')">' +
            '<span class="offstall__name">' + esc(c.name) + '</span>' +
            '<button class="offstall__back" type="button" data-act="unhide" data-id="' + c.id + '"' +
            ' aria-label="Put ' + esc(c.name) + ' back on the stall">put back</button>' +
            '</span></li>';
        }).join('') + '</ul>' +
        '<button class="btn btn--dark" type="button" data-act="unhide-all">Put them all back</button>' +
        '</section>';
    }

    html += '<section class="row row--add">' + addForm() + '</section>';
    el.stall.innerHTML = html;
  }

  function renderBasket() {
    var all = catalogue();
    var picked = state.basket.map(function (id) {
      for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
      return null;
    }).filter(Boolean);

    var next = null;
    if (picked.length) {
      var sh = shift(), today = referenceDay();
      var iso2 = todayISO();
      picked.forEach(function (c) {
        var rec = stageOf(c.id);
        var rep = rec && rec.stage ? S.stageReport(c, rec, iso2) : null;
        if (rep) {
          if (rep.retired) return;
          if (!next || rep.sortKey < next.rank) next = { crop: c, line: rep.line, rank: rep.sortKey };
          return;
        }
        var st = S.evaluate(c, sh, today, conditions());
        var rank = (st.status === 'urgent' || st.status === 'open') ? st.daysLeft
          : st.status === 'held' ? 500 + st.daysLeft : 1000 + (st.daysUntil || 999);
        if (!next || rank < next.rank) next = { crop: c, line: st.line, rank: rank };
      });
    }

    el.basket.innerHTML = '<div class="basket__inner">' +
      '<div><div class="basket__count">' + picked.length + '</div>' +
      '<div class="basket__label">' + (picked.length === 1 ? 'crop' : 'crops') + ' in your garden</div></div>' +
      '<div class="basket__next">' +
        (next ? '<b>Next:</b> ' + esc(next.crop.name.toLowerCase()) + ' — ' +
                esc(next.line.replace(/^Sow now — window closes/, 'sow by')
                             .replace(/^Plant now — window closes/, 'plant by'))
              : 'Pick a crate and your garden starts here.') +
        '<span class="basket__where">Saved in this browser only — no account, no sync.</span>' +
      '</div>' +
      (picked.length ? '<ul class="basket__list">' + picked.map(function (c) {
        return '<li><button class="basket__chip" type="button" data-act="pick" data-id="' + c.id + '"' +
          ' style="--chip:var(--f-' + c.family + ')" aria-label="Remove ' + esc(c.name) + ' from your garden">' +
          esc(c.name) + icon('close') + '</button></li>';
      }).join('') + '</ul>' : '') +
      '</div>';
  }

  /* The one authored motion moment: the stall physically re-laying itself when
     the place or the month changes. Positions are measured before the re-render
     and the difference is played back once — not a fade on every element. */
  function withRelay(fn) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { fn(); return; }
    var before = {};
    document.querySelectorAll('.crate[data-crop]').forEach(function (n) {
      before[n.dataset.crop] = n.getBoundingClientRect();
    });
    fn();
    var moved = [];
    document.querySelectorAll('.crate[data-crop]').forEach(function (n) {
      var b = before[n.dataset.crop];
      if (!b) return;
      var a = n.getBoundingClientRect();
      var dx = b.left - a.left, dy = b.top - a.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      n.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      moved.push(n);
    });
    if (!moved.length) return;
    el.stall.classList.add('is-relaying');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        moved.forEach(function (n) { n.style.transform = ''; });
        setTimeout(function () { el.stall.classList.remove('is-relaying'); }, 560);
      });
    });
  }

  function measureBoard() {
    document.documentElement.style.setProperty('--board-h', el.board.offsetHeight + 'px');
  }

  function render(answered) {
    renderBoard();
    renderRail();
    renderMarks();
    renderLegend();
    renderStall();
    renderBasket();
    measureBoard();
    if (answered) {
      el.board.classList.add('is-answered');
      setTimeout(function () { el.board.classList.remove('is-answered'); }, 600);
    }
  }

  // ── Events ───────────────────────────────────────────────────────────────
  function onClick(ev) {
    var t = ev.target.closest('[data-act]');
    if (!t) return;
    var act = t.dataset.act;

    if (act === 'locate') { locate(); }
    else if (act === 'reset') { state.location = null; state.weather = null; state.frost = null; save(); render(); }
    else if (act === 'edit-frost') { state.editingFrost = !state.editingFrost; render(); }
    else if (act === 'pick-place') {
      var r = state.results[+t.dataset.i];
      if (r) setLocation(r.name, r.lat, r.lon);
    }
    else if (act === 'month') {
      var i = +t.dataset.i;
      if (i === state.month) return;
      state.month = i; state.monthPinned = true;
      withRelay(function () { render(); });
    }
    else if (act === 'family') {
      state.family = t.dataset.f;
      withRelay(function () { render(); });
    }
    else if (act === 'open') {
      state.opened = state.opened === t.dataset.id ? null : t.dataset.id;
      renderStall();
      var still = document.querySelector('[data-act="open"][data-id="' + state.opened + '"]');
      if (still) still.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    else if (act === 'add-open') { state.adding = true; renderStall(); }
    else if (act === 'add-cancel') { state.adding = false; renderStall(); }
    else if (act === 'own-remove') {
      var oid = t.dataset.id;
      state.custom = state.custom.filter(function (c) { return c.id !== oid; });
      state.basket = state.basket.filter(function (x) { return x !== oid; });
      state.hidden = state.hidden.filter(function (x) { return x !== oid; });
      delete state.stages[oid];
      if (state.opened === oid) state.opened = null;
      save();
      withRelay(function () { renderStall(); renderBasket(); });
    }
    else if (act === 'legend') { state.legend = !state.legend; save(); renderMarks(); renderLegend(); measureBoard(); }
    else if (act === 'legend-close') { state.legend = false; save(); renderMarks(); renderLegend(); measureBoard(); }
    else if (act === 'stage') {
      var sid = t.dataset.id, sg = t.dataset.s, cur = stageOf(sid);
      if (cur && cur.stage === sg) delete state.stages[sid];
      else state.stages[sid] = { stage: sg, date: (cur && cur.date) || todayISO() };
      if (state.stages[sid] && state.basket.indexOf(sid) === -1) state.basket.push(sid);
      save();
      withRelay(function () { renderStall(); renderBasket(); });
    }
    else if (act === 'stage-clear' || act === 'stage-finish') {
      delete state.stages[t.dataset.id];
      save();
      withRelay(function () { renderStall(); renderBasket(); });
    }
    else if (act === 'hide') {
      var hid = t.dataset.id;
      if (state.hidden.indexOf(hid) === -1) state.hidden.push(hid);
      var inGarden = state.basket.indexOf(hid);
      if (inGarden !== -1) state.basket.splice(inGarden, 1);
      delete state.stages[hid];
      if (state.opened === hid) state.opened = null;
      save();
      withRelay(function () { renderStall(); renderBasket(); });
    }
    else if (act === 'unhide') {
      var back = state.hidden.indexOf(t.dataset.id);
      if (back !== -1) state.hidden.splice(back, 1);
      save();
      withRelay(function () { renderStall(); renderBasket(); });
    }
    else if (act === 'unhide-all') {
      state.hidden = [];
      save();
      withRelay(function () { renderStall(); renderBasket(); });
    }
    else if (act === 'pick') {
      var id = t.dataset.id, at = state.basket.indexOf(id);
      if (at === -1) state.basket.push(id); else state.basket.splice(at, 1);
      save();
      renderStall(); renderBasket();
    }
  }

  function onSubmit(ev) {
    var f = ev.target.closest('[data-act]');
    if (!f) return;
    ev.preventDefault();
    if (f.dataset.act === 'search-form') {
      search(f.querySelector('input[name=q]').value.trim());
    } else if (f.dataset.act === 'add-form') {
      var made = createCrop(f);
      if (!made) return;
      state.custom.push(made);
      state.adding = false;
      state.opened = made.id;
      save();
      withRelay(function () { renderStall(); renderBasket(); });
    } else if (f.dataset.act === 'frost-form') {
      var last = f.querySelector('input[name=last]').value.trim();
      var first = f.querySelector('input[name=first]').value.trim();
      var ok = /^\d{2}-\d{2}$/;
      state.frost = {
        last: ok.test(last) ? last : null,
        first: ok.test(first) ? first : null
      };
      state.editingFrost = false;
      save();
      withRelay(function () { render(); });
    }
  }

  function init() {
    el.board = document.getElementById('board');
    el.rail = document.getElementById('rail');
    el.marks = document.getElementById('marks');
    el.legend = document.getElementById('legend');
    el.stall = document.getElementById('stall');
    el.basket = document.getElementById('basket');

    load();
    if (state.legend === null) state.legend = window.innerWidth >= 736;
    render();
    if (state.location) loadWeather();

    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('change', function (ev) {
      var d = ev.target.closest('[data-act="stage-date"]');
      if (!d || !d.value) return;
      var rec = stageOf(d.dataset.id);
      if (!rec) return;
      rec.date = d.value;
      save();
      withRelay(function () { renderStall(); renderBasket(); });
    });
    window.addEventListener('resize', measureBoard);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
