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
  var CROPS = DATA.CROPS, FAMILIES = DATA.FAMILIES;

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
    } catch (e) { /* corrupt or unavailable storage is not fatal; start fresh */ }
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        location: state.location, frost: state.frost, basket: state.basket
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
    return state.family === 'all' ? CROPS : CROPS.filter(function (c) { return c.family === state.family; });
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
    var cls = ['crate'];
    if (st.status === 'urgent') cls.push('crate--urgent');
    if (st.status === 'held') cls.push('crate--held');
    if (!open) cls.push('crate--closed');
    if (picked) cls.push('crate--picked');
    if (isOpen) cls.push('crate--open');

    var pips = [1, 2, 3].map(function (n) {
      return '<span class="ease__pip' + (n <= (4 - c.ease) ? ' ease__pip--on' : '') + '"></span>';
    }).join('');
    var easeWord = c.ease === 1 ? 'easy' : c.ease === 2 ? 'moderate' : 'tricky';
    var span = c.kind === 'perennial'
      ? (c.years[0] === 0 ? 'crops year one' : c.years[0] === c.years[1] ? c.years[0] + ' yrs to fruit' : c.years[0] + '–' + c.years[1] + ' yrs to fruit')
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

    return '<li><article class="' + cls.join(' ') + '"' +
      ' style="--field:var(--f-' + c.family + ');--mark:var(--m-' + c.family + ')">' +
      '<button class="crate__take" type="button" data-act="pick" data-id="' + c.id + '"' +
      ' aria-pressed="' + picked + '"' +
      ' aria-label="' + esc((picked ? 'Remove ' : 'Add ') + c.name + ' ' + (picked ? 'from' : 'to') +
        ' your garden. ' + st.line) + '">' +
        '<span class="crate__produce">' +
          '<span class="crate__class">' + (c.kind === 'perennial' ? 'perennial' : 'annual') + '</span>' +
          '<span class="crate__name">' + esc(c.name) + '<span class="crate__pt">' + esc(c.pt) + '</span></span>' +
        '</span>' +
        '<span class="crate__label">' +
          '<span class="bar" aria-hidden="true">' + bar + '</span>' +
          '<span class="bar__months" aria-hidden="true">' + months + '</span>' +
          '<span class="crate__line">' + esc(st.line) + '</span>' +
        '</span>' +
        (picked ? '<span class="crate__picked">' + icon('check') + 'In garden</span>' : '') +
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
          '<div><dt>Spacing</dt><dd>' + c.spacing + ' cm apart</dd></div>' +
          '<div><dt>Water</dt><dd>' + c.water + '</dd></div>' +
          '<div><dt>Light</dt><dd>' + (c.sun === 'full' ? 'full sun' : 'sun or part shade') + '</dd></div>' +
        '</dl>' +
        '<p class="crate__note">' + esc(c.note) + '</p>' +
        (c.confidence === 'medium'
          ? '<p class="crate__caveat">' + icon('frost') + 'Timing for this crop varies widely across the region — treat these dates as a starting point, not a fixed schedule.</p>'
          : '') +
      '</div>' : '') +
      '</article></li>';
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
    var groups = S.order(evaluated());
    var front = groups.front, back = groups.back;
    var monthWord = state.monthPinned && state.month !== new Date().getMonth()
      ? 'in ' + S.MONTH_FULL[state.month] : 'this week';

    var html = '<section class="row row--front">' +
      '<div class="row__head"><h2 class="row__title">Sow ' + esc(monthWord) + '</h2>' +
      '<span class="bar__key"><span><i class="k-sow"></i>sow or plant</span>' +
      '<span><i class="k-harvest"></i>harvest</span>' +
      '<span class="row__count">' + front.length + ' open</span></span></div>' +
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
    el.stall.innerHTML = html;
  }

  function renderBasket() {
    var picked = state.basket.map(function (id) {
      for (var i = 0; i < CROPS.length; i++) if (CROPS[i].id === id) return CROPS[i];
      return null;
    }).filter(Boolean);

    var next = null;
    if (picked.length) {
      var sh = shift(), today = referenceDay();
      picked.forEach(function (c) {
        var st = S.evaluate(c, sh, today, conditions());
        var rank = (st.status === 'urgent' || st.status === 'open') ? st.daysLeft
          : st.status === 'held' ? 500 + st.daysLeft : 1000 + (st.daysUntil || 999);
        if (!next || rank < next.rank) next = { crop: c, state: st, rank: rank };
      });
    }

    el.basket.innerHTML = '<div class="basket__inner">' +
      '<div><div class="basket__count">' + picked.length + '</div>' +
      '<div class="basket__label">' + (picked.length === 1 ? 'crop' : 'crops') + ' in your garden</div></div>' +
      '<div class="basket__next">' +
        (next ? '<b>Next:</b> ' + esc(next.crop.name.toLowerCase()) + ' — ' +
                esc(next.state.line.replace(/^Sow now — window closes/, 'sow by')
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
    document.querySelectorAll('.crate[data-id]').forEach(function (n) {
      before[n.dataset.id] = n.getBoundingClientRect();
    });
    fn();
    var moved = [];
    document.querySelectorAll('.crate[data-id]').forEach(function (n) {
      var b = before[n.dataset.id];
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
    el.stall = document.getElementById('stall');
    el.basket = document.getElementById('basket');

    load();
    render();
    if (state.location) loadWeather();

    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    window.addEventListener('resize', measureBoard);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
