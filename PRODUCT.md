# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML / CSS / JS — the user's explicit choice. No build step, no framework, no
backend, no accounts. This is a durable constraint, not a starting point to be upgraded away
from: it decides persistence, data sources, and how reminders can possibly be delivered (see
Capabilities and Constraints). Deploy target undecided; any static host works.

## Users

**Home food growers.** People growing food for themselves at home — not businesses, not
nurseries, not ornamental-houseplant owners.

The job they open PlantLife to do: *know what to do, and when.* Specifically — when to sow,
when to transplant, when to expect harvest, when to water, and how to plan a season ahead of
time.

All four growing settings are in scope and confirmed:

- balcony and patio containers (pots, grow bags, window boxes)
- backyard and raised beds (succession planting, rotation)
- allotments and larger plots visited on a schedule
- indoor growing under lights or on windowsills

The data model therefore cannot assume a single growing unit. A pot, a bed, and a single plant
are all first-class; indoor growing has no frost dates at all and must not be forced through a
seasonal-outdoor model.

## Product Purpose

Turn "I want to grow my own food" into a specific, correct, timely instruction — sow this now,
move that outside next week, water today, harvest in three weeks.

Success is the grower acting at the right moment and getting food. Failure is generic advice
that ignores where they live, or a schedule so noisy they stop opening it.

## Positioning

Timing is derived from the grower's real location and live weather, not from fixed intervals or
a generic printed calendar. "Water every 7 days" and "sow in March" are what neighboring apps
say; PlantLife computes against the conditions actually happening at this plot.

The second half of the position: it covers container, bed, allotment, and indoor growing in one
model, rather than assuming everyone has a garden.

## Operating Context

- Checked in short bursts, frequently on a phone, often outdoors and often mid-task with dirty
  hands. Long sessions are the exception — season planning is the one case where the user sits
  down properly.
- The rhythm is seasonal, not uniform: heavy planning in late winter and spring, near-daily
  checks through summer, harvest recording, then a quiet off-season. The product is used
  differently in each phase.
- Growing surfaces are heterogeneous within one user — the same person may have two beds, six
  pots on a balcony, and seedlings under a light indoors.
- Because there is no account, the user's garden lives in the browser they entered it in.
  Switching devices or clearing site data loses it. This is a user-visible fact, not just a
  technical one.

## Capabilities and Constraints

**Confirmed capabilities:**

- Care scheduling and reminders — the core, chosen explicitly over identification, cataloguing,
  and sensor tracking.
- Per-crop sow / transplant / harvest / watering timing.
- Season planning across multiple growing units.
- Location plus a live weather feed driving that timing, including reactive concerns like
  watering need and frost warnings.

**Constraints that follow from the static, backend-free stack:**

- *No server to hold a secret.* Any weather or climate provider must be keyless and
  CORS-enabled for direct browser calls; a provider requiring a private API key is unusable,
  because a static page cannot hide one. (Open-Meteo is the obvious candidate — free, keyless,
  CORS-enabled — but the provider is not yet a confirmed decision.)
- *No database.* Persistence is browser storage. No cross-device sync, no multi-user, no
  server-side backup. Data export/import is the natural mitigation but has not been confirmed
  as a requirement.
- *No push infrastructure.* "Reminders" cannot mean server-sent notifications. The available
  mechanisms are an in-app due list, and optionally Web Notifications via a service worker
  while the browser permits it. Delivery mechanism is undecided.
- Location comes from the browser geolocation API or manual entry; both paths must work, since
  geolocation is refusable.

**Explicitly undecided — record, do not invent:**

- Where per-crop timing data comes from (sowing windows, days to maturity, frost tolerance).
  This is a real content dependency that must be sourced or authored, never fabricated.
- Weather and climate provider.
- Hemisphere and climate-zone handling.
- Reminder delivery mechanism.
- Backup / export.
- Deploy target.

## Brand Commitments

Name: **PlantLife**. Nothing else is established — no logo, voice, palette, typography, or
identity constraint has been set, and none should be treated as pre-existing.

## Evidence on Hand

None. The repository was empty at init: no copy, no assets, no logo, no crop data, no users, no
testimonials, no press, no screenshots.

Future work must not fabricate: crop timing figures, frost dates, user counts, testimonials,
partnerships, pricing, or any agronomic claim. Crop data in particular is a dependency to
source, not a detail to improvise — wrong sowing dates make the product actively harmful to
someone's season.

## Product Principles

1. **Timing is local truth.** Every date the product shows is computed against this grower's
   location and conditions. A number that could have been printed in a generic almanac is a
   failure of the core premise.
2. **A pot is not a lesser bed.** Containers, beds, plots, and indoor setups are equally
   first-class. Nothing should read as a garden app that tolerates balconies.
3. **Answer "what do I do today" first.** The default view resolves the immediate question;
   planning and history are destinations the user chooses, not tolls on the way in.
4. **The garden belongs to the user's device.** No account, no server copy. Be honest about
   that in the interface rather than letting people discover it by losing a season.
5. **Never invent agronomy.** If the data isn't known, say it isn't known. A confident wrong
   sowing date costs someone real food and real months.

## Accessibility & Inclusion

No standard was specified by the user. One product-specific need is established by the confirmed
operating context: the interface is read outdoors, in direct sunlight, on a phone, frequently
one-handed and with dirty or gloved hands. High contrast, generous touch targets, and legibility
under glare are functional requirements here, not polish.
