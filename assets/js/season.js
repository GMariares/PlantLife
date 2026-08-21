/* PlantLife — the timing engine.
 *
 * Pure functions only: no DOM, no storage, no network. Everything the stall shows
 * is computed here, so the maths can be tested on its own.
 *
 * THE FROST SHIFT, and why it is asymmetric.
 * crops.js holds the conventional Iberian calendar written against a mild coastal
 * baseline (last frost ~10 March, first frost ~5 December — roughly Porto). A
 * region whose last frost is later grows later, so its windows shift forward by
 * the difference. That much is linear and honest.
 *
 * The reverse is not. In a frost-free Algarve or Canarian winter the limit on
 * sowing stops being frost at all and becomes soil temperature and daylength: a
 * tomato sown outdoors on 30 January sits in cold ground and sulks whether or not
 * it is frosted. So earlier shifts are clamped at MAX_EARLY_SHIFT while later ones
 * run free to MAX_LATE_SHIFT. The interface states the applied shift in days
 * rather than presenting the result as if it were the printed calendar.
 */
(function (global) {
  'use strict';

  var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
  var YEAR = 365;

  var BASE_LAST_FROST = '03-10';
  var BASE_FIRST_FROST = '12-05';
  var MAX_EARLY_SHIFT = -21;   // mild winters are limited by soil warmth, not frost
  var MAX_LATE_SHIFT = 60;

  function doy(mmdd) {
    var m = parseInt(mmdd.slice(0, 2), 10), d = parseInt(mmdd.slice(3, 5), 10), n = d;
    for (var i = 0; i < m - 1; i++) n += MONTH_DAYS[i];
    return n;
  }
  function fromDoy(n) {
    n = ((n - 1) % YEAR + YEAR) % YEAR + 1;
    var m = 0;
    while (n > MONTH_DAYS[m]) { n -= MONTH_DAYS[m]; m++; }
    return { month: m + 1, day: n };
  }
  function label(n) { var x = fromDoy(n); return x.day + ' ' + MONTH_NAMES[x.month - 1]; }
  function dateToDoy(date) { return doy(pad(date.getMonth() + 1) + '-' + pad(date.getDate())); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function forward(from, to) { return ((to - from) % YEAR + YEAR) % YEAR; }
  function within(n, from, to) {
    return from <= to ? (n >= from && n <= to) : (n >= from || n <= to);
  }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  /* Signed shortest offset between two days of the year, in [-182, 182]. */
  function offset(from, to) {
    var f = forward(from, to);
    return f > YEAR / 2 ? f - YEAR : f;
  }

  /* How far this region's calendar moves from the baseline the crop data was
     written against. Returns 0 for frost-free regions and for missing dates —
     never a guess. */
  function frostShift(region, override) {
    var last = (override && override.last) || (region && region.lastFrost);
    var first = (override && override.first) || (region && region.firstFrost);
    var spring = last ? clamp(offset(doy(BASE_LAST_FROST), doy(last)), MAX_EARLY_SHIFT, MAX_LATE_SHIFT) : 0;
    var autumn = first ? clamp(offset(doy(BASE_FIRST_FROST), doy(first)), MAX_EARLY_SHIFT, MAX_LATE_SHIFT) : 0;
    return { spring: spring, autumn: autumn, frostFree: !!(region && region.frostFree) };
  }

  /* Which shift applies to one window: tender crops follow the last frost;
     everything sown into the second half of the year follows the first frost. */
  function shiftFor(crop, win, shift) {
    if (crop.tender) return shift.spring;
    var mid = doy(win.from) + forward(doy(win.from), doy(win.to)) / 2;
    var m = fromDoy(Math.round(mid)).month;
    return (m >= 8 && m <= 12) ? shift.autumn : shift.spring;
  }

  function shiftWindow(win, days) {
    return { mode: win.mode, from: forward(0, doy(win.from) + days), to: forward(0, doy(win.to) + days),
             days: days, rawFrom: win.from, rawTo: win.to };
  }

  /* Every window this crop has in this place, with the shift already applied. */
  function windowsFor(crop, shift) {
    var out = [];
    for (var i = 0; i < crop.sow.length; i++) {
      out.push(shiftWindow(crop.sow[i], shiftFor(crop, crop.sow[i], shift)));
    }
    return out;
  }
  function harvestsFor(crop, shift) {
    var out = [];
    for (var i = 0; i < crop.harvest.length; i++) {
      out.push(shiftWindow(crop.harvest[i], crop.tender ? shift.spring : shift.autumn));
    }
    return out;
  }

  /* Urgency is measured on the class's own scale. An annual's sowing window
     closes in days and missing it costs the crop; a perennial's planting window
     closes over a season and the unit that means anything is the month. */
  var URGENT_DAYS = { annual: 14, perennial: 30 };
  var SOON_DAYS = 30;
  var HORIZON_DAYS = 60;

  /* The crop's state on a given day: which window matters, how long is left,
     and the one dated sentence the crate has to say.
     `conditions` is the live forecast when there is one: { min, frostRisk }. A
     frost-tender crop whose calendar window is open is still held back while
     frost is forecast, because the calendar is a pattern and the forecast is
     what is actually happening. Without conditions nothing is gated and the
     board states it is working from the calendar alone. */
  function evaluate(crop, shift, today, conditions) {
    var wins = windowsFor(crop, shift);
    var open = null, next = null, nextIn = Infinity;

    for (var i = 0; i < wins.length; i++) {
      var w = wins[i];
      if (within(today, w.from, w.to)) {
        var left = forward(today, w.to);
        if (!open || left < open.daysLeft) open = { win: w, daysLeft: left };
      } else {
        var until = forward(today, w.from);
        if (until < nextIn) { nextIn = until; next = w; }
      }
    }

    var verb = crop.kind === 'perennial' ? 'Plant' : 'Sow';
    if (open) {
      var mode = open.win.mode === 'indoor' ? 'Start indoors' : verb;
      var held = conditions && conditions.frostRisk && crop.tender && open.win.mode !== 'indoor';
      if (held) {
        return {
          status: 'held', window: open.win, daysLeft: open.daysLeft, daysUntil: 0,
          line: 'Window open, but ' + conditions.min + '°C forecast this week — hold',
          closes: open.win.to, heldBy: 'frost'
        };
      }
      return {
        status: open.daysLeft <= URGENT_DAYS[crop.kind] ? 'urgent' : 'open',
        window: open.win, daysLeft: open.daysLeft, daysUntil: 0,
        line: mode + ' now — window closes ' + label(open.win.to),
        closes: open.win.to
      };
    }
    if (next && nextIn <= HORIZON_DAYS) {
      return {
        status: nextIn <= SOON_DAYS ? 'soon' : 'later',
        window: next, daysLeft: 0, daysUntil: nextIn,
        line: (next.mode === 'indoor' ? 'Start indoors from ' : verb + ' from ') + label(next.from),
        opens: next.from
      };
    }
    return {
      status: 'closed', window: next, daysLeft: 0, daysUntil: next ? nextIn : null,
      line: next ? 'Next window opens ' + label(next.from) : 'No window recorded',
      opens: next ? next.from : null
    };
  }

  /* Twelve cells, one per month: 'sow', 'harvest', 'both' or null. The crate's
     season bar is drawn straight from this. */
  function seasonBar(crop, shift) {
    var wins = windowsFor(crop, shift), harv = harvestsFor(crop, shift), bar = [];
    for (var m = 0; m < 12; m++) {
      var mid = doy(pad(m + 1) + '-15'), s = false, hv = false, i;
      for (i = 0; i < wins.length; i++) if (within(mid, wins[i].from, wins[i].to)) s = true;
      for (i = 0; i < harv.length; i++) if (within(mid, harv[i].from, harv[i].to)) hv = true;
      bar.push(s && hv ? 'both' : s ? 'sow' : hv ? 'harvest' : null);
    }
    return bar;
  }


  /* ── What the grower actually did ──────────────────────────────────────
     The calendar says when a window is open. It cannot know that this crop
     went in three weeks ago. A stage record is the grower overruling the
     suggestion with fact, and once it exists the crate stops advising and
     starts reporting: days-to-maturity finally computes against a real
     sowing date instead of being printed and ignored.

     Stage dates are absolute ISO days, unlike the windows, which are
     day-of-year patterns. `todayISO` is passed in so this stays pure. */

  var STAGE_LABEL = {
    sown: 'Sown', planted: 'Planted out', plantedPerennial: 'Planted',
    harvesting: 'Harvesting', cropping: 'Cropping', removed: 'Removed'
  };

  /* Only offer stages this crop can actually reach: a direct-sown crop is
     never "planted out", and a perennial is never sown. */
  function stagesFor(crop) {
    if (crop.kind === 'perennial') return ['planted', 'cropping', 'removed'];
    var hasIndoor = crop.sow.some(function (w) { return w.mode === 'indoor'; });
    return hasIndoor ? ['sown', 'planted', 'harvesting'] : ['sown', 'harvesting'];
  }

  /* Finishing means different things to the two classes, so it is not one
     control. An annual that is over is released back to the stall — it will be
     sown again next season, and the record of this one has served its purpose.
     A perennial that is over was taken out, which is a fact worth keeping. */
  function finishesByClearing(crop) { return crop.kind !== 'perennial'; }

  function stageLabel(crop, stage) {
    if (stage === 'planted' && crop.kind === 'perennial') return STAGE_LABEL.plantedPerennial;
    return STAGE_LABEL[stage] || stage;
  }

  function parseISO(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function shortDate(d) { return d.getDate() + ' ' + MONTH_NAMES[d.getMonth()]; }
  function longDate(d) {
    var now = new Date();
    return shortDate(d) + (d.getFullYear() !== now.getFullYear() ? ' ' + d.getFullYear() : '');
  }
  function daysBetween(a, b) { return Math.round((b - a) / 86400000); }

  /* The one sentence a staged crate says, and the key it sorts by. */
  function stageReport(crop, rec, todayISO) {
    if (!rec || !rec.stage) return null;
    var when = parseISO(rec.date), today = parseISO(todayISO);
    if (!when || !today) return null;
    var label = stageLabel(crop, rec.stage);
    var out = { stage: rec.stage, label: label, when: when, sortKey: 9e6, expected: null };

    /* A removed perennial is not growing, so it leaves the garden row and goes
       back to being advice — but the record stays on the crate, because the
       grower may well plant another and should not lose what happened. */
    if (rec.stage === 'removed') {
      out.line = 'Removed ' + longDate(when);
      out.retired = true;
      out.sortKey = 8e6;
      return out;
    }
    if (rec.stage === 'harvesting' || rec.stage === 'cropping') {
      out.line = label + ' since ' + longDate(when);
      out.sortKey = -1;                       // happening now: it leads the garden
      return out;
    }
    if (crop.kind === 'perennial') {
      var y0 = when.getFullYear() + crop.years[0], y1 = when.getFullYear() + crop.years[1];
      out.line = crop.years[0] === 0
        ? label + ' ' + longDate(when) + ' — cropping this year'
        : label + ' ' + longDate(when) + ' — first fruit ' + (y0 === y1 ? y0 : y0 + '–' + y1);
      out.sortKey = (y0 - today.getFullYear()) * 365;
      return out;
    }
    var from = addDays(when, crop.dtm[0]), to = addDays(when, crop.dtm[1]);
    var left = daysBetween(today, from);
    out.expected = { from: from, to: to, daysLeft: left };
    out.line = left > 0
      ? label + ' ' + longDate(when) + ' — harvest from about ' + shortDate(from)
      : label + ' ' + longDate(when) + ' — ready from about ' + shortDate(from);
    out.sortKey = left;
    return out;
  }

  var RANK = { urgent: 0, open: 1, held: 2, soon: 3, later: 4, closed: 5 };

  /* Front of the stall is ordered by urgency, with ease breaking ties so a
     beginner's eye lands on something they can actually succeed with. Everything
     past the front row holds a stable order, so the stall does not reshuffle
     unrecognisably each time the month changes. */
  function order(evaluated) {
    var front = [], back = [];
    evaluated.forEach(function (e) { (RANK[e.state.status] <= 2 ? front : back).push(e); });
    front.sort(function (a, b) {
      return (RANK[a.state.status] - RANK[b.state.status]) ||
             (a.state.daysLeft - b.state.daysLeft) ||
             (a.crop.ease - b.crop.ease) ||
             a.crop.name.localeCompare(b.crop.name);
    });
    back.sort(function (a, b) {
      return a.crop.family.localeCompare(b.crop.family) || a.crop.name.localeCompare(b.crop.name);
    });
    return { front: front, back: back };
  }

  function evaluateAll(crops, shift, today, conditions) {
    return crops.map(function (c) {
      return { crop: c, state: evaluate(c, shift, today, conditions), bar: seasonBar(c, shift) };
    });
  }

  /* Why the front row is empty, said in the grower's terms rather than "no
     results". Heat and cold are different answers and get different sentences. */
  function quietReason(monthIndex, familyName) {
    if (familyName) {
      return { season: 'filtered', filtered: true,
        text: 'No ' + familyName + ' have a window open this month. Other crops do — this is the ' +
              'filter talking, not your region or the season.' };
    }
    if (monthIndex >= 6 && monthIndex <= 7) {
      return { season: 'heat', text: 'High summer. The ground is too hot for almost anything to germinate, and what does germinate bolts. This is a month for watering and harvesting, not for starting.' };
    }
    if (monthIndex === 11 || monthIndex <= 0) {
      return { season: 'cold', text: 'Deep winter. Soil temperature, not frost, is what stops seed here — it will sit and rot rather than come up. The beds are working even when you are not.' };
    }
    return { season: 'between', text: 'A gap between the two sowing seasons. Nothing is ready to start this month in your region.' };
  }

  global.PlantLifeSeason = {
    doy: doy, fromDoy: fromDoy, label: label, dateToDoy: dateToDoy, forward: forward,
    within: within, offset: offset, frostShift: frostShift, windowsFor: windowsFor,
    harvestsFor: harvestsFor, evaluate: evaluate, evaluateAll: evaluateAll,
    seasonBar: seasonBar, order: order, quietReason: quietReason,
    stagesFor: stagesFor, stageLabel: stageLabel, stageReport: stageReport,
    finishesByClearing: finishesByClearing,
    MONTH_NAMES: MONTH_NAMES, MONTH_FULL: MONTH_FULL,
    BASE_LAST_FROST: BASE_LAST_FROST, BASE_FIRST_FROST: BASE_FIRST_FROST,
    MAX_EARLY_SHIFT: MAX_EARLY_SHIFT, MAX_LATE_SHIFT: MAX_LATE_SHIFT
  };
}(window));
