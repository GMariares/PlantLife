/* PlantLife — the week's work.
 *
 * Pure derivation, no DOM: the ledger is computed from what the app already
 * knows — open windows, weather holds, stage records, days-to-maturity — plus
 * two recurring checks lifted from the grower's own adviser notes (caterpillar
 * patrol on brassicas in the warm months, strawberry tidying in late summer).
 * Nothing here invents agronomy; every line traces to the crop data, the
 * grower's own records, or their own project notes.
 *
 * A task that WRITES something says so: ticking "sow the kale" records the
 * sowing (stage + date), because the tick and the record are the same fact.
 * Care tasks only tick for the week and come back next week.
 */
(function (global) {
  'use strict';

  var S = global.PlantLifeSeason;

  var SUCCESSION_GAP_DAYS = 21;
  var READY_LOOKAHEAD_DAYS = 7;
  var PLANT_OUT_MIN_DAYS = 21;

  function isoWeekKey(d) {
    var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var day = (date.getDay() + 6) % 7;              // Monday = 0
    date.setDate(date.getDate() - day + 3);          // the week's Thursday
    var jan4 = new Date(date.getFullYear(), 0, 4);
    var week = 1 + Math.round(((date - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
    return date.getFullYear() + '-W' + (week < 10 ? '0' : '') + week;
  }

  function weekSpan(d) {
    var mon = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
    var sun = new Date(mon.getTime()); sun.setDate(sun.getDate() + 6);
    function f(x) { return x.getDate() + ' ' + S.MONTH_NAMES[x.getMonth()]; }
    return f(mon) + ' – ' + f(sun);
  }

  function parseISO(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function daysSince(iso, today) {
    var d = parseISO(iso);
    return d ? Math.round((today - d) / 86400000) : null;
  }
  function lc(name) { return name.charAt(0).toLowerCase() === name.charAt(0) ? name : name.charAt(0).toLowerCase() + name.slice(1); }

  /* Every task: { id, kind, urgency (0 do-now, 1 this-week, 2 softer, 3 watch),
     line, crop, writes? }. Sorted most-pressing first. */
  function derive(opts) {
    var tasks = [];
    var today = opts.today, todayDoy = opts.todayDoy, month = today.getMonth();
    var shift = opts.shift, conditions = opts.conditions, stages = opts.stages;

    opts.crops.forEach(function (c) {
      var rec = stages[c.id] || null;
      var st = S.evaluate(c, shift, todayDoy, conditions);
      var verb = c.kind === 'perennial' ? 'Plant' : 'Sow';

      if (!rec) {
        if (st.status === 'urgent' || st.status === 'open') {
          var mode = st.window && st.window.mode === 'indoor'
            ? 'Start ' + lc(c.name) + ' indoors' : verb + ' ' + lc(c.name);
          tasks.push({ id: 'sow:' + c.id, kind: 'sow', crop: c,
            urgency: st.status === 'urgent' ? 0 : 1,
            line: mode + ' — window closes ' + S.label(st.window.to),
            writes: { stage: 'sown' } });
        } else if (st.status === 'held') {
          tasks.push({ id: 'hold:' + c.id, kind: 'hold', crop: c, urgency: 3,
            line: 'Hold ' + lc(c.name) + ' — ' + conditions.min + '°C forecast this week' });
        }
        return;
      }

      if (rec.stage === 'removed' || rec.stage === 'harvesting' || rec.stage === 'cropping') {
        maybeSuccession(c, rec);
        return;
      }

      /* Plant out: sown indoors long enough ago, and the outdoor window is
         open. Skipped while frost is forecast for a tender crop — the board
         already carries that warning. */
      if (rec.stage === 'sown' && c.kind !== 'perennial' &&
          S.stagesFor(c).indexOf('planted') !== -1) {
        var since = daysSince(rec.date, today);
        var directOpen = S.windowsFor(c, shift).some(function (w) {
          return w.mode !== 'indoor' && S.within(todayDoy, w.from, w.to);
        });
        var frostBlocked = conditions && conditions.frostRisk && c.tender;
        if (since !== null && since >= PLANT_OUT_MIN_DAYS && directOpen && !frostBlocked) {
          tasks.push({ id: 'plantout:' + c.id, kind: 'plantout', crop: c, urgency: 1,
            line: 'Plant out the ' + lc(c.name) + ' — its outdoor window is open',
            writes: { stage: 'planted' } });
        }
      }

      /* Ready to pick: the expected date computed from the grower's own
         sowing date has arrived, or arrives within the week. */
      var rep = S.stageReport(c, rec, iso(today));
      if (rep && rep.expected) {
        var left = rep.expected.daysLeft;
        if (left <= READY_LOOKAHEAD_DAYS) {
          tasks.push({ id: 'ready:' + c.id, kind: 'ready', crop: c, urgency: left <= 0 ? 1 : 2,
            line: c.name + (left <= 0 ? ' should be ready' : ' may be ready this week') +
              ' — ' + lc(rep.label) + ' ' + S.label(S.dateToDoy(rep.when)) +
              (c.dtm ? ' (' + c.dtm[0] + '–' + c.dtm[1] + ' days)' : ''),
            writes: { stage: 'harvesting' } });
        }
      }

      maybeSuccession(c, rec);
    });

    /* Succession: crops the data marks as sow-little-and-often, last batch
       three weeks old or more, window still open. Ticking re-dates the record
       to today — the newest batch is the one the clock runs from. */
    function maybeSuccession(c, rec) {
      if (!c.succession || !rec || !rec.date) return;
      var since = daysSince(rec.date, today);
      var open = S.windowsFor(c, shift).some(function (w) {
        return w.mode !== 'indoor' && S.within(todayDoy, w.from, w.to);
      });
      if (since !== null && since >= SUCCESSION_GAP_DAYS && open) {
        var weeks = Math.round(since / 7);
        tasks.push({ id: 'again:' + c.id, kind: 'succession', crop: c, urgency: 2,
          line: 'Sow another batch of ' + lc(c.name) + ' — the last went in ' +
            weeks + ' week' + (weeks === 1 ? '' : 's') + ' ago',
          writes: { redate: true } });
      }
    }

    /* Recurring checks, from the grower's own project notes. Weekly; they
       come back every week while the season and the plants are there. */
    var growingFamilies = {};
    opts.crops.forEach(function (c) {
      var rec = stages[c.id];
      if (rec && rec.stage !== 'removed') growingFamilies[c.family] = true;
    });
    if (growingFamilies.brassica && month >= 3 && month <= 9) {
      tasks.push({ id: 'care:caterpillar', kind: 'care', urgency: 3,
        line: 'Check the brassicas for caterpillars — look under the leaves' });
    }
    var straw = stages.strawberry;
    if (straw && straw.stage !== 'removed' && month >= 6 && month <= 8) {
      tasks.push({ id: 'care:strawberry', kind: 'care', urgency: 3,
        line: 'Tidy the strawberries — old leaves off, root the runners you want to keep' });
    }

    tasks.sort(function (a, b) {
      return a.urgency - b.urgency ||
        (a.crop && b.crop ? a.crop.name.localeCompare(b.crop.name) : a.id.localeCompare(b.id));
    });
    return tasks;

    function iso(d) {
      function p(n) { return (n < 10 ? '0' : '') + n; }
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    }
  }

  global.PlantLifeTasks = { derive: derive, isoWeekKey: isoWeekKey, weekSpan: weekSpan };
}(window));
