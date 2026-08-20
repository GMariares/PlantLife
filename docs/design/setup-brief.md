# Surface brief — first run ("the stall")

Output of `/impeccable shape`. Planning only: no code, no direction contract, no DESIGN.md.
The canonical `.impeccable/surfaces/` brief is written later by new-work, at build time, once a
concrete target file exists.

**Status:** confirmed. Reviewed and approved, including the two decisions flagged for argument:
perennial fruit is a distinct timing model (§6, §7.4) and "nothing sowable this month" is a
first-class designed state (§5). The structural reading in §0 — first run is a state of the home
stall, not a separate route — went uncontested and stands.

---

## 0. The structural consequence you should push back on first

The request said "the initial setup page". The flow you chose — *location, then grow* — argues
against there being one.

If the only required input is location, a dedicated setup page would be a single field with a
button on it, and then a hard cut to a different-looking screen. That is a door in front of a
door. The honest reading of your own answer is:

**There is no separate setup page. The app's home surface is the stall, and first run is that
same stall before it knows where you are.** The location board across the top is empty and
asking; the crates behind it are real but generic; answering the board re-lays the whole stall
to your latitude in place. Setup is a *state* of the home surface, not a route.

Everything below assumes that. If you want a discrete `/setup` route — for a guided first
session, or because you plan to add growing-space and experience questions later — say so and
I will reshape; it changes the topology but not the world.

## 1. Job and audience

- **Visitor:** a home food grower arriving for the first time, most likely on a phone, plausibly
  standing outdoors in bright sun with dirty hands, plausibly at a kitchen table in February
  with the whole season ahead.
- **State of mind:** curious and unconvinced. They have not committed to anything and will not
  fill in a form to find out whether this is worth it.
- **Mode: Operate.** Success is a completed task, not a persuaded reader. Scanability, honest
  data and native expectations outrank expression — the world lives in precise details, not in
  a hero.

## 2. Outcome and proof

- **Primary task:** set location, then pick the first crops into the garden.
- **Success:** the grower leaves with a location set, between one and roughly eight crops chosen,
  and one unambiguous next action with a real date attached ("sow broad beans — window closes 12
  March").
- **The proof the surface must deliver, and the only one that matters:** that PlantLife knows
  *this place, right now*. The moment location resolves, the stall must visibly change — crops
  reorder, dates appear, today's actual weather is on the board. A grower who cannot tell the
  difference between PlantLife and a printed calendar has not been given the product.
- **Product-specific truth carried here:** real frost dates for the location, real current
  conditions, real sowing windows for Iberian/Mediterranean climates.

## 3. Selected direction — Banca

Locked from the direction roll (assigned index 5 of the grounded candidates; seed `e37357e1`).

- **World:** the Iberian *mercado* produce stall. Crates and painted boards, chalked signs,
  galvanised zinc, kraft crate board. The organising truth of a market is that **what is on the
  stall is what is in season** — a stall in Porto in April looks nothing like the same stall in
  October, and that is exactly the answer this surface exists to give.
- **Colour strategy:** full palette, rationed. Ground is a cool mineral off-white (explicitly not
  cream); structure is near-black slate; produce colour is the categorical system and carries
  data — crop family and season state — never decoration. Saturation is spent only on crops
  currently sowable; everything else desaturates to board grey.
- **Light, not dark, forced by the scene:** a phone held at arm's length in direct Iberian sun.
  Dark grounds lose that fight.
- **Type:** a heavy condensed grotesque in the register of painted market signage for display,
  the same superfamily at text sizes, tabular lining numerals so dates read as data. Candidate:
  the Archivo superfamily — self-hostable, no key, wide widths and weights. Confirmed at build.
  Explicitly not a hand-lettered chalk face: the *board* is the material, the letterforms stay
  legible at arm's length in glare.
- **First viewport:** a chalked location board across the top — `Porto · 41.15°N · last frost
  ~20 Feb · 18°C, raining now` — over a field of crop crates. The dozen sowable this week sit
  forward at full produce colour; the rest are set back in board grey, still legible, still
  pickable.
- **Visitor path:** empty board asks for location → answered by geolocation or by typing a town →
  the stall re-lays in place, crates reordering to this latitude and month → grower picks crates
  into the basket → the basket rail resolves to one dated next action.
- **Signature interaction:** the **month scrubber**. One axis along the top that moves the entire
  stall coherently — every crate's season bar, urgency, colour state and dates re-read together.
  Not a filter chip; the whole stall travels through the year. This is where "what grows well
  here" lives, without becoming a second page.
- **Cross-surface reach:** the crate plus its season bar becomes the crop card everywhere in the
  product; the chalked board becomes the app's persistent context bar; the basket becomes "my
  garden".
- **Honest risk:** a field of produce colour goes carnival if every crate shouts — the saturation
  ration is load-bearing, not a preference. And a market implies buying; nothing here may read as
  commerce.

### Raises carried in from the hands it beat

Each is a discipline donated by a challenger the direction defeated, not a borrowed motif.

1. **From the box-wall index —** one rigid label grid on every crate: identical fields, identical
   order, identical position, so forty crops scan as an index rather than a collage.
2. **From the depth-scrub —** the month scrubber re-lays the entire surface at once rather than
   filtering a list.
3. **From the phosphor terminal —** the app's reasoning prints itself as content in the flow
   ("frost until ~20 Feb, so tomatoes start indoors"), never as a tooltip or a badge.
4. **From the telop field —** urgency is set in type: a window closing in four days is physically
   larger and heavier than one with three months of runway.
5. **From the vertical feed —** opening a crate resolves the crop completely — windows, spacing,
   water, days to harvest — with no teaser and no "learn more".

### Kept from the competitive challenger

The Normalled Jackfield beat the stall on product clarity by encoding state in stroke pattern
rather than hue. Even though the world lost, that discipline is binding here: **no crate state may
be carried by colour alone.** Every state is also positional (forward or set back), labelled in
words, and marked in form. Sun glare and colour-blindness are the same requirement.

## 4. Scope and boundaries

- **Fidelity:** production-ready surface, not exploration.
- **Breadth:** one surface — the home/first-run stall — including its empty, resolving, denied,
  degraded and returning states. Crop detail is in scope only as the opened crate.
- **Interactivity:** full. Location resolution, month scrubbing, crate picking, basket, and
  persistence to browser storage.
- **Named target:** the app entry document (`index.html` and its stylesheet/script), to be created.
- **Untouched:** nothing exists yet. `PRODUCT.md` is authority and is not rewritten by the build.
- **Anti-goals:**
  - no separate signup, account, or login wall;
  - no gamification — no streaks, points, badges, confetti, or mascot;
  - no commerce affordances: no prices, no cart language, no "buy", despite the market world;
  - no sage-green rounded-card wellness look and no leaf iconography;
  - no emoji standing in for icons;
  - no invented crop timings, and no confident date the data does not support;
  - no blocking multi-step wizard.

## 5. States and ranges

**Content ranges the layout must survive:**

| Thing | Minimum | Typical | Maximum |
|---|---|---|---|
| Crops in the catalogue | 24 | 40–60 (veg, herbs, a small perennial fruit set) | ~120 later |
| Crops sowable in the shown month | 0 | 8–15 | ~30 in spring |
| Crops picked into the basket | 0 | 3–8 in a first session | 40+ for an allotment |
| Crop name length | "Kale" | "Broad bean" | "Purple sprouting broccoli" |

**States that must be designed, not discovered:**

- **No location yet** — the board is asking. The stall is real but generic; it must not be blank,
  a spinner, or a modal.
- **Locating** — geolocation pending.
- **Location denied or unavailable** — a first-class path, not an error. Typing a town must be
  equal in weight to the geolocation button, because geolocation is refusable and often refused.
- **Weather unavailable** — the surface falls back to climate-normal dates and *says so on the
  board*. It never presents a normal as a live reading.
- **Nothing sowable this month** — **confirmed in review as a first-class state, not an edge
  case.** Real in an Iberian August and a wet December. The front row can legitimately be empty;
  the stall must read as "not now, here's what's next" rather than broken, which means an empty
  front row needs its own designed treatment — a named reason, the nearest upcoming window with
  its date, and the month scrubber offered as the way forward. This is the state that decides
  whether the design is honest, and it is built first, not last.
- **Offline** — the catalogue and the garden are local and must still work; only live conditions
  degrade.
- **Returning grower** — already has a location and a garden. The same stall, already answered.
- **Empty basket** and **long basket**.

## 6. Interaction and layout

- **Hierarchy:** location board → the front row of what to sow now → the rest of the stall →
  basket. The board is the only element that is ever full-width and sticky; it is the product's
  claim, so it stays on screen.
- **Topology:** a single scrolling field of crates under a fixed board and month axis. No steps,
  no pagination, no accordion; depth happens by opening a crate in place.
- **Ordering:** urgency first — sowing window closing soonest leads, with ease of success breaking
  ties, so a beginner's eye lands on a crop they can actually succeed with. Out-of-season crates
  keep a stable position so the stall does not reshuffle unrecognisably each month.
- **The crate:** crop name, class marker (annual vs perennial), a 12-month season bar for *this*
  location, the next dated action, an ease mark. One grid, every crate, always.
- **Responsiveness:** mobile-first single column; wider viewports open the stall into a multi-column
  field rather than stretching crates. The board condenses but never leaves.
- **Affordances:** picking is one tap on a large target — minimum 44px, sized for gloved and dirty
  hands. Picking is instantly reversible; nothing is confirmed by dialog.
- **Feedback:** picking moves the crate to the basket visibly, so the garden is seen accumulating.
  The location answer causes a visible re-lay of the whole stall — that re-lay *is* the proof and
  should be the one moment the surface spends motion on.
- **Transitions:** re-lay and crate opening only. Everything respects `prefers-reduced-motion`,
  under which the re-lay resolves without travel.

## 7. Constraints and open decisions

**Binding constraints (from PRODUCT.md):**

- Plain static HTML/CSS/JS. No build step, no framework, no backend.
- No server means no secret: every data source must be keyless and CORS-enabled from the browser.
- Persistence is browser storage; no accounts, no sync. The surface must be honest that the garden
  lives on this device.
- Region of correctness at launch: Portugal / Iberian and Mediterranean only.
- Accessibility is functional here, not cosmetic: sunlight contrast, large targets, one-handed
  reach, and state never carried by colour alone.

**Open decisions a builder must not invent:**

1. **Crop timing dataset** — the single largest dependency. Sowing and planting windows, days to
   maturity, frost tolerance and ease ratings for the Iberian/Mediterranean set must be authored
   from a real source and reviewed. PRODUCT.md forbids fabricating these, and a wrong sowing date
   costs someone a season.
2. **Weather and geocoding provider** — Open-Meteo is the standing candidate (keyless, CORS, has
   both forecast and geocoding), but it is not yet a decision.
3. **How last-frost dates are derived** — from climate normals, from a lookup table, or entered by
   the grower. The whole timing model rests on this and it is currently unresolved.
4. **Fruit and perennials — RESOLVED in review, no longer open.** Perennial fruit is a second
   timing model, not a longer list. Perennial crates carry a *planting* window (bare-root and
   container seasons) and years-to-first-harvest, where annual crates carry a sowing window and
   days-to-harvest. The two classes share one crate grid and one label order so the stall still
   scans as an index, but they are visibly different kinds of thing and their urgency is computed
   differently: an annual's window closes in days, a perennial's in a season. What stays open is
   only which fruit species make the launch set.
5. **Growing space (pot, bed, plot, indoors)** — you dropped "what fits my space" from the
   suggestion basis, so it is deferred out of first run, not deleted. Where it re-enters is open.
6. **Reminder delivery** — out of scope for this surface, still undecided product-wide.
7. **Final typeface selection** — character is fixed above; the specific family is confirmed at
   build.
