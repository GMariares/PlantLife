/* PlantLife — frost regions, Iberian & Mediterranean.
 *
 * PROVENANCE. Each entry is a REGIONAL APPROXIMATION of the average last spring
 * frost and first autumn frost, drawn from conventional horticultural practice for
 * that area. They are not measurements for any specific garden: a sheltered city
 * courtyard and an exposed plateau twenty minutes away differ by weeks, and
 * altitude moves these dates more than latitude does. The grower can override both
 * dates, and the interface says plainly that the table is a starting point.
 *
 * `confidence` is honest about that spread:
 *   high   — mild, maritime, low-altitude; frost behaviour is consistent year to year.
 *   medium — continental or mixed-altitude; real variation of two to four weeks.
 *
 * `frostFree: true` means frost is rare enough that timing is driven by heat and
 * daylength instead. Those regions carry no frost dates at all rather than a
 * fabricated one.
 *
 * Regions outside this table are NOT guessed at. When the nearest centroid is more
 * than MAX_MATCH_KM away, the app says the location is outside the checked area and
 * asks the grower for their own dates.
 */
(function (global) {
  'use strict';

  var MAX_MATCH_KM = 400;

  var REGIONS = [
    // ---- Portugal ----
    { id: 'pt-minho',      name: 'Minho e Litoral Norte',   lat: 41.70, lon: -8.50, lastFrost: '03-20', firstFrost: '11-30', confidence: 'high' },
    { id: 'pt-porto',      name: 'Grande Porto e Litoral',  lat: 41.15, lon: -8.61, lastFrost: '03-10', firstFrost: '12-05', confidence: 'high' },
    { id: 'pt-beiralit',   name: 'Beira Litoral',           lat: 40.30, lon: -8.50, lastFrost: '03-15', firstFrost: '12-01', confidence: 'high' },
    { id: 'pt-tras',       name: 'Trás-os-Montes',          lat: 41.50, lon: -7.00, lastFrost: '04-25', firstFrost: '10-25', confidence: 'medium' },
    { id: 'pt-beirainf',   name: 'Beira Interior',          lat: 40.40, lon: -7.30, lastFrost: '04-20', firstFrost: '11-01', confidence: 'medium' },
    { id: 'pt-oeste',      name: 'Estremadura e Oeste',     lat: 39.50, lon: -9.00, lastFrost: '02-25', firstFrost: '12-10', confidence: 'high' },
    { id: 'pt-lisboa',     name: 'Lisboa e Vale do Tejo',   lat: 38.72, lon: -9.14, lastFrost: '02-10', firstFrost: '12-20', confidence: 'high' },
    { id: 'pt-alentlit',   name: 'Alentejo Litoral',        lat: 37.95, lon: -8.70, lastFrost: '02-15', firstFrost: '12-15', confidence: 'high' },
    { id: 'pt-alentint',   name: 'Alentejo Interior',       lat: 38.30, lon: -7.80, lastFrost: '03-15', firstFrost: '11-25', confidence: 'medium' },
    { id: 'pt-algarve',    name: 'Algarve',                 lat: 37.02, lon: -7.93, lastFrost: '01-25', firstFrost: '12-28', confidence: 'high' },

    // ---- Spain ----
    { id: 'es-galicia',    name: 'Galicia',                 lat: 42.60, lon: -8.50, lastFrost: '03-25', firstFrost: '11-25', confidence: 'high' },
    { id: 'es-cantab',     name: 'Cornisa Cantábrica',      lat: 43.30, lon: -4.50, lastFrost: '03-20', firstFrost: '12-01', confidence: 'high' },
    { id: 'es-mesetan',    name: 'Meseta Norte',            lat: 41.80, lon: -4.70, lastFrost: '04-30', firstFrost: '10-15', confidence: 'medium' },
    { id: 'es-madrid',     name: 'Madrid e Meseta Sur',     lat: 40.42, lon: -3.70, lastFrost: '04-05', firstFrost: '11-10', confidence: 'medium' },
    { id: 'es-ebro',       name: 'Valle del Ebro',          lat: 41.65, lon: -0.88, lastFrost: '03-30', firstFrost: '11-15', confidence: 'medium' },
    { id: 'es-catlit',     name: 'Catalunya Litoral',       lat: 41.40, lon:  2.17, lastFrost: '02-20', firstFrost: '12-10', confidence: 'high' },
    { id: 'es-levante',    name: 'Levante',                 lat: 39.00, lon: -0.40, lastFrost: '02-05', firstFrost: '12-20', confidence: 'high' },
    { id: 'es-extrem',     name: 'Extremadura',             lat: 39.00, lon: -6.30, lastFrost: '03-10', firstFrost: '11-30', confidence: 'medium' },
    { id: 'es-andint',     name: 'Andalucía Interior',      lat: 37.60, lon: -5.30, lastFrost: '02-20', firstFrost: '12-10', confidence: 'medium' },
    { id: 'es-andlit',     name: 'Andalucía Litoral',       lat: 36.70, lon: -4.90, lastFrost: '01-20', firstFrost: '12-30', confidence: 'high' },
    { id: 'es-balears',    name: 'Illes Balears',           lat: 39.60, lon:  2.90, lastFrost: '02-05', firstFrost: '12-25', confidence: 'high' },

    // ---- Atlantic islands ----
    { id: 'pt-madeira',    name: 'Madeira',                 lat: 32.65, lon: -16.90, frostFree: true, confidence: 'high' },
    { id: 'pt-acores',     name: 'Açores',                  lat: 37.74, lon: -25.67, frostFree: true, confidence: 'high' },
    { id: 'es-canarias',   name: 'Canarias',                lat: 28.30, lon: -16.50, frostFree: true, confidence: 'high' },

    // ---- Wider Mediterranean ----
    { id: 'fr-midi',       name: 'Provence e Occitânia',    lat: 43.40, lon:  5.00, lastFrost: '03-15', firstFrost: '11-25', confidence: 'medium' },
    { id: 'it-tirreno',    name: 'Ligúria e Toscana',       lat: 43.80, lon:  9.50, lastFrost: '03-10', firstFrost: '12-05', confidence: 'medium' },
    { id: 'it-sud',        name: 'Itália Meridional',       lat: 40.90, lon: 14.50, lastFrost: '02-20', firstFrost: '12-10', confidence: 'medium' },
    { id: 'it-isole',      name: 'Sicília e Sardenha',      lat: 38.50, lon: 14.00, lastFrost: '01-30', firstFrost: '12-25', confidence: 'high' },
    { id: 'gr-attiki',     name: 'Grécia Litoral',          lat: 38.00, lon: 23.70, lastFrost: '02-25', firstFrost: '12-10', confidence: 'medium' },
    { id: 'ma-atlantico',  name: 'Marrocos Atlântico',      lat: 33.60, lon: -7.60, frostFree: true, confidence: 'medium' }
  ];

  function haversineKm(a, b, c, d) {
    var R = 6371, p = Math.PI / 180;
    var dLat = (c - a) * p, dLon = (d - b) * p;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(a * p) * Math.cos(c * p) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  /* Nearest region by great-circle distance, or null when the location sits
     outside the area this table was actually checked for. Returning null is the
     point: a silent nearest-match across 1500km would be a fabricated frost date. */
  function nearestRegion(lat, lon) {
    var best = null, bestKm = Infinity;
    for (var i = 0; i < REGIONS.length; i++) {
      var km = haversineKm(lat, lon, REGIONS[i].lat, REGIONS[i].lon);
      if (km < bestKm) { bestKm = km; best = REGIONS[i]; }
    }
    if (!best || bestKm > MAX_MATCH_KM) return null;
    return { region: best, km: Math.round(bestKm) };
  }

  global.PlantLifeRegions = { REGIONS: REGIONS, nearestRegion: nearestRegion, MAX_MATCH_KM: MAX_MATCH_KM };
}(window));
