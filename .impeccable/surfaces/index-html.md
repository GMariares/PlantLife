---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["assets/js/stall.js","assets/css/stall.css"]
---

## Scope and mode

The home surface, and its first-run state. Mode: **Operate** — success is a completed task, not a
persuaded reader. There is deliberately no separate setup route: with location as the only required
input, a dedicated setup page would be a door in front of a door, so first run is the same stall
before it knows where you are.

## Audience and job

A home food grower, most often on a phone, plausibly outdoors in bright sun with dirty hands, and
in February at a kitchen table planning a season. They arrive curious and unconvinced and will not
fill in a form to find out whether this is worth it.

The task: set location, then pick the first crops. Success is leaving with a location, roughly one
to eight crops chosen, and one unambiguous next action carrying a real date.

## The proof this surface owes

That PlantLife knows *this place, right now*. When location resolves the stall must visibly change —
crates reorder, dates appear, today's conditions land on the board. A grower who cannot tell the
difference between this and a printed calendar has not been given the product.

## Direction and memorable moment

**Banca** — the Iberian mercado stall, where what is on the stall is what is in season. Crops
sowable now sit forward at full produce colour; the rest set back in board grey, still legible and
still pickable.

The memorable moment is the **month rail**: one axis that re-lays the entire stall at once — every
crate, date, colour state and urgency re-read together — rather than filtering a list. This is
where "what grows well here across the year" lives without becoming a second page.

Five disciplines the direction carries, each donated by a rejected alternative: one rigid label grid
on every crate; the coherent axis re-lay; the app's reasoning printed as content in the flow rather
than in tooltips; urgency set in type size rather than a coloured pill; a crate that resolves the
crop completely with no "learn more".

## Content ranges this layout must survive

24 to ~120 crops in the catalogue (57 today); 0 to ~30 sowable in the shown month; 0 to 40+ crops in
the basket; crop names from "Kale" to "Purple sprouting broccoli".

## States that are designed, not discovered

No location yet (the board asks; the stall behind it is real, not blank); locating; location denied
or unavailable — typing a town is equal in weight to the geolocation button, because geolocation is
refusable and often refused; weather unavailable — falls back to the regional calendar and says so
on the board; **nothing sowable this month** — a first-class state with its own treatment: the
reason in the grower's terms, the next real window with its date, and the rail offered as the way
forward; offline; returning grower; empty and long basket.

## Constraints binding this surface

No secret can live in a static page, so every data source must be keyless and CORS-enabled. The
garden lives in this browser only and the basket rail says so. State is never carried by colour
alone — position, wording and form carry it too, because the surface is read in glare.

## Unresolved

Which fruit species make the launch set. Where growing space (pot, bed, plot, indoors) re-enters,
having been deferred out of first run. Reminder delivery, still undecided product-wide. Whether the
regional frost table is eventually replaced by per-coordinate derivation from climate history.
