---
name: PlantLife
description: A market stall of food crops — limewash ground, chalked slate board, kraft crates, and eight produce colours that carry crop family as data.
colors:
  ground: "#E4E7DE"
  ground-deep: "#D7DBD0"
  slate: "#1E231C"
  slate-2: "#2B322A"
  chalk: "#EEF1E7"
  chalk-dim: "#AFB8A9"
  kraft-edge: "#A79C81"
  slate-rule: "#4A5247"
  slate-edge: "#58614F"
  zinc: "#98A093"
  ink: "#171A16"
  ink-2: "#525A4E"
  ink-3: "#3E453B"
  caution-amber: "#E8C46A"
  field-fruiting: "#C4302B"
  field-leaf: "#39752A"
  field-brassica: "#2A5A8A"
  field-root: "#9D570F"
  field-allium: "#7B4A86"
  field-legume: "#6E6A10"
  field-herb: "#2F5D42"
  field-fruit: "#91264C"
  mark-fruiting: "#B82D28"
  mark-leaf: "#366E27"
  mark-brassica: "#2A5A8A"
  mark-root: "#94520E"
  mark-allium: "#7B4A86"
  mark-legume: "#67640F"
  mark-herb: "#2F5D42"
  mark-fruit: "#91264C"
typography:
  scale:
    micro: "0.5625rem"
    caption: "0.625rem"
    label: "0.6875rem"
    label-lg: "0.75rem"
    body-sm: "0.8125rem"
    body: "0.875rem"
    body-lg: "0.9375rem"
    base: "1rem"
    lead: "1.0625rem"
    title-sm: "1.125rem"
    crate-name: "1.1875rem"
    title: "1.25rem"
    count: "1.375rem"
    headline-sm: "1.5rem"
    title-lg: "1.6rem"
    crate-urgent: "1.625rem"
    headline: "1.75rem"
    display-sm: "2rem"
    display-md: "2.5rem"
    display-lg: "2.75rem"
    display-xl: "4rem"
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 6vw, 4rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 118"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4.4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 2.6vw, 1.6rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 108"
  crate-name:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 78"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 84"
  micro:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.1em"
    fontVariation: "'wdth' 80"
rounded:
  none: "0"
  control: "2px"
spacing:
  hair: "0.15rem"
  xs: "0.35rem"
  sm: "0.6rem"
  md: "0.85rem"
  lg: "1.25rem"
  gap: "1.5rem"
  gap-mobile: "1rem"
  row: "2.75rem"
  gutter: "clamp(1rem, 4vw, 2.5rem)"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.1rem"
    typography: "{typography.label}"
  button-hover:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.slate}"
  button-solid:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.slate}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.1rem"
  button-solid-hover:
    backgroundColor: "{colors.field-fruiting}"
    textColor: "{colors.chalk}"
  button-dark:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.1rem"
  button-dark-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  field:
    backgroundColor: "{colors.slate-2}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.control}"
    padding: "0.7rem 0.85rem"
    size: "0.9375rem"
  mark:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "0.35rem 0.6rem"
    typography: "{typography.label}"
  mark-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  rail-month:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "0.6rem 0.1rem 0.55rem"
  rail-month-pressed:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
  crate:
    backgroundColor: "{colors.kraft-edge}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0"
  crate-produce:
    textColor: "{colors.chalk}"
    padding: "0.7rem 0.85rem 0.6rem"
    height: "5.35rem"
  crate-produce-closed:
    backgroundColor: "{colors.zinc}"
    textColor: "{colors.ink}"
  crate-foot:
    textColor: "{colors.ink-3}"
    padding: "0.5rem 0.85rem"
    typography: "{typography.label}"
  crate-foot-open:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  basket-chip:
    textColor: "{colors.chalk}"
    rounded: "{rounded.control}"
    padding: "0.25rem 0.45rem"
  alert:
    backgroundColor: "{colors.caution-amber}"
    textColor: "{colors.slate}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.6rem"
  crate-stagebar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "0.12rem 0.85rem"
    typography: "{typography.micro}"
  crate-drop:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    padding: "0.45rem 0.6rem"
  crate-drop-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  stage-btn:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    padding: "0.35rem 0.55rem"
    size: "0.6875rem"
  stage-btn-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  stage-date:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.4rem"
    size: "0.8125rem"
  offstall-back:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    padding: "0.35rem 0.55rem"
  offstall-back-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
---

# Design System: PlantLife

## Overview

**Creative North Star: "The Banca"** — the Iberian *mercado* stall. A limewashed wall, a
painted slate board chalked with today's answer, and kraft crates of produce set out on it.
What is on the stall is what is in season; nothing else is on the stall.

The world is made of four materials and nothing else: **limewash** (the pale mineral ground the
whole page sits on), **slate** (the near-black painted board and the basket rail, the only two
dark planes), **kraft** (the slatted crate board, a tiled SVG with real slat seams and a faint
turbulence grain), and **produce** (eight saturated field colours that are the only chromatic
surfaces in the system). Every one of those is a physical thing a market stall is actually built
from, which is why the surface can be loud without being decorative — the colour is stock, not
branding.

Density is high and deliberately so. This is a product read outdoors, in sun, on a phone, mid-task
— so the type is set tight, the contrast is measured rather than eyeballed, and information is
packed into rigid grids rather than spaced into calm. There is no soft card, no drop shadow, no
gradient except the one that splits a season-bar cell in half, and no rounded corner larger than
2px. Depth is done with rule weight and material change, never with light. Motion is authored at
exactly one moment and nowhere else.

What this world explicitly refuses: the sage-green, soft-cornered, three-step wellness wizard the
gardening category ships. There is no setup route in front of the product — the asking state is
the same board, with no place written on it yet, and the crates are already laid out behind it.

**Key Characteristics:**
- Four materials only: limewash ground, slate board, kraft crate, produce colour.
- One superfamily (Archivo variable) doing display, body, and label work across a 62–125% width axis.
- Eight crop-family colours that are *data*, not decoration — each with two solved roles.
- Squared containers, 2px chamfer on controls, 1px hairlines with 2–3px structural rules.
- Zero elevation shadows. The system has no light source.
- Every colour pairing in the palette measured to 4.5:1 or better, including the blended ones.

## Colors

A limewashed neutral ground carrying two dark planes and eight saturated produce hues; the
neutrals are all faintly green-cast so the chromatic crops read as the only real colour on screen.

### Primary

The produce hues are the primary palette. Each crop family owns one hue in **two solved roles**,
and the choice between them is mechanical, not aesthetic.

- **Field** (`--f-*`): the saturated hue used as a filled plane with chalk type on it — the crate's
  produce band, the season-bar's sow cells, the basket chip. Every field colour clears 4.5:1
  against chalk (measured range 4.83:1 tomato-red to 7.11:1 fruit-magenta).
- **Mark** (`--m-*`): the same hue solved dark enough to survive *as* type or as a rule on the
  limewash ground — the family-filter chip, and the sow cells of an out-of-season crate. Every mark
  colour clears 4.5:1 against the ground (4.83:1 to 6.49:1).

Four families needed no darkening and their two roles are the same value (brassica, allium, herb,
fruit); four were darkened by one step to clear the ground (fruiting, leaf, root, legume). That
asymmetry is the measurement showing, and it should be preserved rather than tidied into a uniform
offset.

Family assignment is fixed and semantic: **Fruiting** tomato-red, **Leaves** field-green,
**Brassicas** slate-blue, **Roots** earth-orange, **Onions** allium-violet, **Legumes** olive,
**Herbs** deep herb-green, **Fruit** wine-magenta.

### Secondary

- **Caution Amber** (`#E8C46A`): the single warning colour, used two ways — as the fill of the
  frost-alert strip on the board (with slate type, 9.55:1) and as the text colour of a warning note
  on slate (also 9.55:1). It is the only hue in the system that is neither a neutral nor a produce
  colour, and it appears at most once per screen.

### Neutral

- **Limewash Ground** (`--ground`): the page. Also the "on" colour of the selected month cell in the
  rail and the type colour when ink becomes a filled plane.
- **Deep Limewash** (`--ground-deep`): the month rail's own plane and the quiet-state panel, one
  step down from the page so the rail reads as a fixture rather than as content.
- **Slate** / **Slate-2** (`--slate`, `--slate-2`): the painted board and the basket rail; slate-2 is
  the inset — text fields and suggestion chips sitting *in* the board.
- **Chalk** / **Dim Chalk** (`--chalk`, `--chalk-dim`): everything written on slate. Chalk is 14:1 on
  the board; dim chalk is 7.81:1 and carries secondary metadata only.
- **Kraft Edge** (`--kraft-edge`): every hairline on a kraft or limewash surface — crate borders,
  internal dividers, the rail's bottom edge.
- **Zinc** (`--zinc`): the drained produce band of an out-of-season crate, and the scrollbar thumb.
  It is the *absence* of produce colour, and it is never used for anything in season.
- **Ink / Ink-2 / Ink-3**: three deliberate steps of near-black, not a ramp for convenience.
  **Ink** is the darkest structural line and the filled "on" plane. **Ink-2** is secondary type on
  the open ground (5.73:1). **Ink-3** exists for exactly one reason: the crate's foot bar sits on a
  5%-ink wash over the kraft slat, and on that blended ground ink-2 measures 3.83:1 while ink-3
  measures 5.3:1. Do not substitute ink-2 there.

### Named Rules

**The Two-Role Produce Rule.** Every crop-family hue exists twice — `--f-*` for a filled plane that
takes chalk type, `--m-*` for the same hue standing on the limewash ground. Choose by what the
colour is sitting *on*, never by preference. A field colour used as a rule on the ground, or a mark
colour used as a plane, breaks the measurement.

**The Never-Hue-Alone Rule.** No state in this system is carried by colour alone, anywhere. Out of
season is zinc *and* a smaller crate name *and* a lighter bottom border *and* the sentence "Next
window opens 15 Jan". A held crop is ink-bordered *and* carries a printed `HOLD` bar across the
bottom of its produce band *and* says why. A staged crop is ink-bordered *and* carries the stage
word printed in that same bar *and* sits in its own row *and* reports a date instead of advising
one. In your garden is a 2px ink border *and* a check-marked "IN GARDEN" tag. Add the redundant
signal before you reach for the hue. Verified against the build: none of the crate's four states —
held, staged, picked, closed — is separable by hue, and the produce band's hue continues to mean
only crop family.

**The Measured 4.5 Rule.** Every foreground/background pair in this palette was solved to ≥4.5:1 by
measurement, including composited grounds. A new colour joins the system by being measured against
the exact surface it will land on — including any alpha wash over it — not by looking dark enough.

**The Colour-Is-Stock Rule.** Chromatic colour in this system means produce. Never use a produce hue
for a UI affordance that isn't a crop: buttons, rails, and filters are neutral until a crop family
gives them a hue. The one exception is the fruiting red, which serves as the system's single accent
for focus rings, carets, selection, the active-month tick, and the solid button's hover.

## Typography

**Display Font:** Archivo (variable, `system-ui, sans-serif` fallback)
**Body Font:** Archivo — the same face
**Label Font:** Archivo — the same face

Self-hosted as two woff2 subsets (latin and latin-ext) under OFL, preloaded, `font-display: swap`,
with the full `400 800` weight and `62% 125%` width ranges exposed.

**Character:** One grotesque doing every job, with the **width axis** carrying the register a second
family would normally carry. It is a signwriter's logic: the same brush, pushed wide for the name on
the board and squeezed narrow for the crate label. Nothing here is set at its default width.

### Hierarchy

- **Display** (700, `clamp(2rem, 6vw, 4rem)`, 0.92, `-0.03em`, **118% width**, uppercase): the place
  name on the board, and only that. The largest thing on the page is the answer to "where".
- **Headline** (700, `clamp(1.5rem, 4.4vw, 2.75rem)`, 1, `-0.025em`, **112% width**, uppercase): the
  board's question in the asking state ("WHERE ARE YOU GROWING?"), and the temperature readout
  (105% width). It occupies the same slot as Display — the board is either asking or answering.
- **Title** (700, `clamp(1.125rem, 2.6vw, 1.6rem)`, 1.05, `-0.01em`, **108% width**, uppercase): row
  headings — "GROWING NOW", "SOW THIS WEEK", "NOT YET, OR NOT NOW", "OFF THE STALL". The quiet-state heading uses
  the same register one step larger in width terms (106%).
- **Crate Name** (700, 1.1875rem, 1.02, **78% width**, uppercase): the crop name inside the produce
  band, with the Portuguese name beneath at 0.75rem/88% width. Deliberately condensed so a long name
  ("ESCAROLE & ENDIVE") fits the fixed band without a second line. Scales *up* to 1.625rem when the
  crate is urgent and *down* to 1rem when it is out of season — size is a state channel here.
- **Body** (400, 1rem, 1.5, tabular numerals): the base. The crate's one dated sentence sits at
  0.875rem/92% width and goes 600 weight when urgent or held.
- **Label** (600, 0.75rem, `0.04–0.06em`, **80–88% width**, uppercase): every control — buttons,
  month rail, family marks, row counts, the basket's caption, the fact-list terms.
- **Micro** (600–700, 0.625rem / 0.5625rem, `0.1–0.16em`, **74–80% width**, uppercase): the
  ANNUAL/PERENNIAL class tag, the HOLD bar and the stage bar (identical spec), the IN GARDEN tag,
  and the season bar's twelve single-letter month initials.

### Named Rules

**The One Superfamily Rule.** Archivo is the only face. There is no serif, no mono, no icon font,
and no system display fallback in the design — only in the loading fallback. A second family is not
an escape hatch; reach for the width axis instead.

**The Width-Tracks-Role Rule.** Width is a semantic axis, not a fitting tool. Display and headline
type is **expanded** (104–118%) because it is signage; body sits near normal (92–96%); controls and
micro-labels are **condensed** (74–88%) because they are stencilled. The one principled inversion is
the crate name at 78% — it is signage, but it lives in a fixed-width band, and the band wins.

**The Tight-Uppercase Rule.** Uppercase display type always carries negative tracking (−0.01em to
−0.03em); uppercase *label* type always carries positive tracking (+0.04em to +0.16em). Large caps
need closing up, small caps need opening out. Never ship uppercase at default tracking.

## Layout

**Container.** One measure, `92rem` max-width, centred, applied independently to the board's inner,
the rail's inner, the family marks, the stall, and the basket's inner — so all five stacked bands
align to the same edges while their backgrounds run full-bleed. The gutter is
`clamp(1rem, 4vw, 2.5rem)` everywhere except the rail, which uses a narrower
`clamp(0.5rem, 3vw, 2rem)` so twelve month cells can breathe.

**The vertical stack** is fixed and is the product's argument: **board** (sticky, top) → **month
rail** (sticky, directly beneath the board) → **family marks** (scrolls) → **stall rows** →
**basket rail** (fixed to the viewport bottom). Body carries `padding-bottom: 5.5rem` to clear the
basket.

**Two-stage sticky.** The board sticks at `top: 0`. The rail sticks at `top: var(--board-h)` — a
custom property the script writes from the board's measured height on every render and on resize,
because the board's height is content-dependent (asking vs answered, with or without a frost alert).
Any new sticky band beneath the rail must join the same measured chain rather than guessing an
offset.

**The crate grid.** `repeat(auto-fill, minmax(15.5rem, 1fr))` with a `1.5rem` gap and
`align-items: start` — five columns at 1440px. The secondary "not yet" row uses a tighter track
(`minmax(14.25rem, 1fr)`, `1rem` gap) so the waiting stock reads as smaller stock. `align-items:
start` is load-bearing: it is what allows one crate to open downward without stretching its
neighbours.

**Rows.** `2.75rem` above each row (`1.5rem` on mobile). Every row head is a baseline-aligned
flex pair — title left, count and legend right — over a `2px` ink rule. The "off the stall"
row demotes that rule to `1px` kraft-edge and its title to ink-2, because it is an archive, not
a section.

**Row order inside the stall** is a claim about whose knowledge wins, and it is fixed: **"Growing
now"** (the grower's own record, only present when something is staged) → **"Sow this week"** (the
front of the stall) → **"Not yet, or not now"** → **"Off the stall"**. The garden row keeps the full
`2px` ink rule and an ink title — it is the one row that is explicitly *not* demoted, because what
the grower actually did outranks what the calendar is suggesting. Anything the grower has told the
system about themselves belongs above anything the system is telling them.

**Responsive** at a single breakpoint, `46rem`:
- The month rail reflows from `repeat(12, 1fr)` to `repeat(6, 1fr)` (two rows of six) and its active
  indicator moves from a top border to a bottom border.
- The crate grid becomes exactly `repeat(2, minmax(0, 1fr))`, gap `0.75rem`; the gap token drops to `1rem`.
- Family marks become a single no-wrap horizontal scroller with hidden scrollbars and a
  `linear-gradient` mask fading the last `2rem` — the affordance that more filters exist.
- The weather readout leaves the flow and absolutely positions to the board's top-right; its
  condition word is dropped and only the temperature and icon survive.
- The basket's "next action" line reorders below the count and chips, and the chip list becomes a
  no-wrap scroller.

### Named Rules

**The Sticky Claim Rule.** The board and the month rail never leave the screen. They are the
product's claim ("this place, this month") and everything below them is an answer to them. A new
screen inherits both, or it is not part of this product.

**The One-Measure Rule.** Every band aligns to the same `92rem` measure and the same gutter, even
when its background is full-bleed. Do not introduce a second content width.

## Elevation & Depth

**This system has no light source and no elevation.** There is not a single depth shadow in the
stylesheet. Two `box-shadow` declarations exist and neither is elevation: a `0 0 0 2px var(--ink)`
ring that marks the *current month* cell inside a season bar, and a `inset 0 0 0 1px` hairline that
gives the legend's harvest swatch an edge. Both are drawing, not lifting.

Depth is carried entirely by three devices:

1. **Material change.** Limewash ground → deep limewash rail → kraft slat crate → slate board. Four
   distinct surfaces, each obviously a different substance.
2. **Rule weight as hierarchy.** `1px` kraft-edge for internal hairlines; `2px` ink for a row head;
   `3px` ink for the board's bottom edge and the basket's top edge — the two rules that separate the
   dark planes from the stall. A crate's bottom border is `3px` kraft-edge while its other three
   sides are `1px`, which is the whole trick that makes it read as a box with a front lip rather
   than a rectangle.
3. **Alpha washes over the crate's own material.** The crate's interior zones are translucent films
   over the kraft slat, never solid fills: label `rgba(chalk, .2)`, opened panel `rgba(chalk, .45)`,
   foot bar `rgba(ink, .05)` rising to `.1` on hover, out-of-season label `rgba(chalk, .14)`. The
   slat grain stays visible through all of them, which is why the crate never flattens into a card.

### Named Rules

**The No-Light Rule.** No `box-shadow` for depth, ever — no ambient shadow, no offset shadow, no
glow, no `filter: drop-shadow`. If something must come forward, change its material, thicken its
rule, or invert it to an ink plane.

**The Ink-Inversion Rule.** The system's "pressed / active / open" treatment is a full inversion to
an ink plane with ground-coloured type — the selected family mark, the opened crate's foot bar, the
hover state of every drop and put-back control. It is the only promotion the system has, and it is
binary. There is no half-step.

## Shapes

**Squared by default.** Containers — crate, produce band, foot bar, opened panel, alert strip,
season-bar cells, HOLD bar, IN GARDEN tag, off-stall item — are all `border-radius: 0`.

**A 2px chamfer on controls.** Buttons, text fields, suggestion chips, family marks, basket chips
and the quiet-state panel carry `border-radius: 2px`. It is not a rounded corner; it is the amount
of softening a painted wooden edge has. Nothing in the system exceeds 2px, and the only circle is
the 7px ease pip (`border-radius: 50%`), which is a dot by nature.

**The slat.** The crate's material is a repeating 236×140 inline SVG tile: a kraft base with a
fractal-noise grain at 5.5% opacity and six vertical rules — four dark seams, two light highlights —
at irregular intervals so the repeat does not read as a pattern. It is the only texture in the
system besides the board's 5% noise, and both are baked as data URIs with no network cost.

**Squares as marks.** Where a colour swatch is needed it is a hard square, never a dot: the family
chip (9×9), the legend swatch (12×10), the off-stall item's family square (9×9). The circle is
reserved exclusively for the three-pip ease meter.

### Named Rules

**The 2px Chamfer Rule.** `0` for anything that holds content, `2px` for anything you press or type
into. There is no third radius.

## Components

### Buttons

- **Shape:** squared with a 2px chamfer, `2px` solid border, `0.7rem 1.1rem` padding, uppercase
  label type at 92% width with `0.04em` tracking, and an inline 18px icon before the word.
- **Ghost (default, on slate):** chalk border, chalk text, transparent fill. Inverts to a chalk fill
  with slate text on hover, over a `0.12s linear` transition.
- **Solid (primary):** chalk fill, slate text — used for exactly one action per state ("Use my
  location", "Save"). Its hover is the *only* place a produce colour fills a control: it goes
  fruiting-red with chalk text.
- **Dark (`btn--dark`, on limewash):** the same ghost geometry in ink, inverting to an ink fill with
  ground text. This is the on-ground twin, used in the quiet state and the off-stall row.
- **Disabled:** `opacity: .5` plus `cursor: not-allowed`, and the label changes ("Finding you…").
- **Focus:** the global ring — `3px solid` fruiting-red with `2px` offset.

### Inputs / Fields

- **Style:** slate-2 fill (inset into the board), `2px` solid `#58614F` border, 2px chamfer,
  `0.7rem 0.85rem` padding, 0.9375rem at 92% width, chalk text.
- **Focus:** the border goes chalk and the outline is suppressed — the field is already inside a
  focus-ring-bearing form; the border shift is the signal.
- **Placeholder:** `#9AA394`, and it is instructional rather than a repeated label ("or type a town —
  Porto, Sevilla, Palermo").
- **Results** appear as a wrapping row of slate-2 suggestion chips beneath the field, never as an
  overlay dropdown.

### Chips

- **Family mark (filter):** transparent with a kraft-edge hairline and ink-2 label type, carrying a
  9×9 square of its family's **mark** colour. Selected inverts to a full ink plane with ground text —
  and the square then inherits the family colour still, so the filter identifies itself in two ways.
- **Basket chip:** filled with the family's **field** colour, chalk text, 2px chamfer, with an
  11px close icon. Hovering inverts it to chalk-on-slate. It is a remove control, and it says so.

### Navigation

The **month rail** is the only navigation: twelve equal cells in a CSS grid over the deep-limewash
plane, uppercase 0.75rem at 80% width, ink-2 at rest.
- **Selected** (`aria-pressed="true"`): a `3px` fruiting-red top border, the ground colour as fill so
  the cell appears to punch through the rail into the page, ink text at weight 700.
- **Today**: a 4×4 ink-2 square pinned at the cell's bottom centre — suppressed when today's cell is
  also the selected one, so the two signals never stack.
- **Hover:** ink text over a 5% ink wash.
- **Mobile:** two rows of six; the active indicator moves to the bottom edge.

### Cards / Containers

There are no cards. The container is the **crate** (see below) and the **quiet panel** — a
`2px` ink border on deep limewash with `clamp(1.25rem, 4vw, 2.25rem)` padding and a `1rem`
grid gap, holding a heading, a plain-language reason, and a bottom row of next-step controls above
a kraft-edge rule.

### The Crate (signature component)

The system's whole argument in one object. It is an `<article>`, not a button, because it contains
**two independent buttons** and a button cannot nest inside a button: a full-width invisible *take*
button wrapping the produce band and the label, and a separate *open* button as the foot bar.
Keyboard focus on either lights the whole crate via `:focus-within` with the global red ring, so the
composite still reads as one object.

Vertically it is four fixed zones:

1. **Produce band** — the family's field colour, chalk type, `min-height: 5.35rem`, contents
   bottom-aligned. Carries the crop name, its Portuguese name, and a micro class tag
   (ANNUAL/PERENNIAL) in the top-right corner.
2. **Label** — a 20% chalk wash over the slat, holding the twelve-cell season bar, its twelve month
   initials, and the crate's single dated sentence (`min-height: 2.7rem`).
3. **Foot bar** — a 5% ink wash with a kraft-edge top rule, ink-3 label type, carrying the ease
   meter on the left, the maturity span on the right, and a chevron. Opening it inverts the bar to an
   ink plane and rotates the chevron 180° over `0.16s`.
4. **Opened panel** (conditional) — a 45% chalk wash holding, in order: a five-term fact list, a
   growing note, an optional uncertainty caveat, the stage control, and the drop control. The
   ordering is deliberate — what the crop is, then what you did, then the way to remove it, with the
   only irreversible-sounding action last and behind a disclosure.

The **season bar** is twelve 17px cells at a 1px gap: sow months in the field colour, harvest months
in a 34% tint of it, months that are both split by a hard-stop linear gradient at 55%, and empty
months in `#C9CFC2`. The current month's cell wears a 2px ink ring. Out of season, sow cells switch
from field to **mark** colour so they stay legible against the drained band.

**States**, each carrying at least two signals:
- **Urgent** — crate name jumps to 1.625rem, sentence goes 600 weight.
- **Held** (live weather overruling the calendar) — ink border on all sides, a full-width ink `HOLD`
  bar printed across the bottom of the produce band (band padding grows to `1.4rem` to make room),
  sentence at 600 weight naming the forecast temperature.
- **Staged** (the grower's own record overruling the calendar) — ink border on all sides, a
  full-width ink **stage bar** across the bottom of the produce band carrying the stage word
  (`SOWN`, `PLANTED OUT`, `HARVESTING`, `CROPPING`, `PLANTED`, `REMOVED`), the same `1.4rem` band
  padding, sentence at 600 weight, and the crate moves into the "Growing now" row. Staged
  suppresses urgent, held and closed entirely: a crate the grower has spoken about is never also
  drained to zinc or told to hold.
- **Picked** — `2px` ink border, and an ink `✓ IN GARDEN` tag pinned into the produce band's
  top-left. The tag is suppressed on a staged crate, because the stage bar already says the crop is
  in the garden and two badges in one band is one badge too many.
- **Closed / out of season** — produce band drains to zinc with ink type, crate name drops to 1rem,
  the front-lip border thins from 3px to 1px, the label wash drops to 14%, sow cells go to mark colour.

### Named Rules

**The Fixed Field Rule.** The crate grid is held by **fixed field heights**, not by equal card
heights: a uniform produce band `min-height`, a uniform bar height, a uniform foot bar, and an
absolute `min-height` on the dated sentence. That, plus `align-items: start` on the grid, is what
lets a single crate open in place without stretching its row. Never reach for equal-height rows or a
stretch alignment to tidy a grid — pin the fields instead.

**The Two-Button Crate Rule.** Take and open are separate controls with separate `aria` semantics
(`aria-pressed` on take, `aria-expanded` on open). A composite object that has two actions is a
container with two buttons, never one button that guesses at intent.

**The Overrule Slot Rule.** There is exactly one place on a crate where something that outranks the
calendar is printed: a full-width ink bar with ground-coloured micro type, flush to the bottom edge
of the produce band, with the band's padding growing to `1.4rem` to hold it. Two things claim that
slot — the weather (`HOLD`) and the grower's own record (the stage word) — and they are drawn to a
single identical spec on purpose, because they are the same kind of statement: *the calendar is not
the last word here*. They are mutually exclusive by construction; the grower's record wins, and the
only thing that distinguishes them is the word in the bar and the row the crate is sitting in. A
third overruling source joins the same bar, in the same ink-on-family-colour, or it does not ship.

**The Report-Don't-Advise Rule.** A crate that knows nothing about the grower gives advice from the
calendar ("Sow now — window closes 30 Sep"). A staged crate stops advising and reports from what it
was told ("Sown 5 Aug — harvest from about 14 Sep", "Harvesting since 28 Jul"). Once the grower has
told the system something, the system never talks over them with its own guess.

### The Stage Control

**The Finish-Diverges Rule.** Finishing is not one control, because it does not
mean one thing. An annual that is over is an *action*: "Finished — put it back on
the stall" clears the record and returns the crop to the advice rows, since it
will be sown again next season and this season's record has served its purpose.
A perennial that is over is a *state*: `removed` is a stage like any other, it
keeps its date, and the crate carries "Removed <date>" quietly beneath the advice
rather than in the ink overrule slot — a plant that is gone is not overruling the
calendar. A retired crop leaves the Growing-now row but stays in the garden list,
so the grower can plant another without losing what happened to the last one.

Inside the opened panel, above a `1px` kraft-edge rule: an uppercase ink-3 label type question —
**"What have you actually done?"**, phrased as a question and not as a field name — over a wrapping
row of stage buttons.

- **Stage button:** squared (no chamfer, unlike the page's other controls — it is inside a crate,
  and crate interiors are square), `1px` kraft-edge border, transparent over the slat, ink-3
  uppercase label type at 0.6875rem/86%. Hover darkens border and text to ink. **Selected inverts to
  a full ink plane with ground text** — the same single promotion the family mark and the crate's
  foot bar use.
- **Clear ("Not started"):** the same button with a **dashed** border. It appears only once a stage
  is set, and its dashed edge is the one place in the system where a border style carries meaning:
  this control undoes rather than sets.
- **Date field:** a native `<input type="date">` on the limewash ground with a `1px` kraft-edge
  border and ink text, focus shifting the border to ink. It appears only after a stage is chosen,
  introduced by an inline uppercase label ("SOWN ON"), capped at today, and it is the only lowercase
  numeric field in the interface because that is how a date input reads.
- **Note:** a 0.6875rem ink-3 sentence, sentence case, stating the estimate's honesty — "Days to
  maturity for this crop run 70–95, so the window above is an estimate from your date, not a
  promise." It appears only when an expected-harvest window is actually being shown.

**The Offered-Stages Rule.** The stage row only ever offers stages the crop can physically reach:
an annual that can be started indoors offers sown / planted out / harvesting; a
direct-sown annual drops "planted out"; a perennial offers planted / cropping / removed.
Finishing an annual is a separate action rather than a fourth toggle — see the
Finish-Diverges Rule. A control
that offers a state its subject cannot occupy is a lie the interface tells; enumerate from the
crop's own class, never from a fixed list.

**The Progressive Record Rule.** The control reveals itself in three steps — question, then date,
then caveat — and each step appears only once the previous one has an answer. No empty date field
waits for a stage that has not been chosen; no caveat explains an estimate that is not on screen.

### The Basket Rail

A slate plane fixed to the viewport bottom with a `3px` ink top rule. It carries, in order: a large
count with an uppercase caption; the single next dated action in plain sentence case; a persistent
honest line — "Saved in this browser only — no account, no sync." — in dim chalk at 0.6875rem; and
the picked crops as family-coloured chips. It is the only place in the interface where a sentence is
not uppercase and not a label, because it is the thing the grower leaves with.

### Off The Stall (removal and its reversal)

Removal is one pair of surfaces, and neither of them is a dialog.

**The drop control** sits at the bottom of the opened crate: full-width, squared, `1px` kraft-edge
border, transparent over the slat, ink-3 uppercase label type with a 13px close icon, inverting to a
full ink plane on hover. It is labelled in the grower's own words — **"I don't grow this"** — not
"Hide" or "Remove", because the grower is stating a fact about themselves, not operating the
software. When the crop is also in their garden it carries a **sub-note** on its own line, 0.6875rem
at weight 400 in sentence case: "also takes it out of your garden". The consequence is printed on the
control that causes it, before the press, and it is the only place in the system where a control
carries two registers of type at once.

**The reversal row** is where it lands: an "Off the stall" row of slat-backed items — a
family-coloured square, the crop name in sentence case, and a hairline-divided "put back" control
that inverts to ink on hover — with a "Put them all back" dark button beneath. The row demotes its
head rule to `1px` kraft-edge and its title to ink-2 (see Layout), because it is an archive, not a
section. Its count is written in the grower's voice too: "3 you don't grow".

**When everything is hidden**, the whole stall is replaced by the **quiet panel** — the same
component the empty month uses — headed "The stall is empty", saying in plain language that nothing
is lost and the dates return exactly as they were, with both ways back in its bottom row. Reusing
the quiet panel is the point: an empty stall the grower caused is the same *kind* of answer as an
empty stall the calendar caused, and it gets the same designed treatment rather than an error.

**The Land-It-Somewhere Rule.** Any removal in this system lands in a visible row, keeps its
identity there, and is reversible from where it landed — both one at a time and all at once. There
is no confirm dialog anywhere in this product, and there does not need to be: nothing is destroyed,
so nothing needs guarding.

### Browser-Drawn Surfaces

The parts the browser draws are themed from the palette, and a new screen inherits them for free:
`::selection` is fruiting-red with chalk text; `caret-color` is fruiting-red; `accent-color` is
leaf-green; the scrollbar is a zinc thumb with a 3px deep-limewash inset border on a deep-limewash
track; `:focus-visible` is a `3px` fruiting-red outline at `2px` offset; and the body carries
`font-variant-numeric: tabular-nums` so dates and temperatures never jitter.

That extends to **the widgets inside a native control**, not only the page chrome around it. The
date field's calendar-picker button is a browser-drawn glyph the design cannot redraw, so it is
brought into the palette instead: `::-webkit-calendar-picker-indicator` is desaturated and darkened
(`filter: saturate(0) brightness(.35)`) until it reads as the same near-black as the ink type beside
it, and given `cursor: pointer`.

**The Themed-Native Rule.** Prefer the native control and theme it into the world; do not rebuild it
as a custom widget to get the look. Every browser-drawn surface a screen touches — selection, caret,
accent, scrollbar, focus ring, and any shadow-DOM part a native input exposes — is claimed by the
palette rather than left at its default. A stock blue or a stock colour picker glyph is a hole in the
world, and the fix is a filter or a token, never a replacement widget.

### Icons

Ten authored SVG paths — `pin`, `search`, `check`, `close`, `clear`, `cloud`, `rain`, `frost`, `fog`,
`chev` — all drawn on a 24×24 grid at a single `1.75` stroke, `fill: none`, round caps and joins,
`stroke: currentColor`, and `aria-hidden`. Sizes in use: 11px (chip close), 12–13px (tag, drop),
15px (chevron, caveat), 18px (button, alert), 24–34px (weather). There is no icon library and no
emoji anywhere in the system.

### Motion

**One authored moment.** When the place, the month, the family filter, or the hidden set changes, the
stall physically re-lays itself: every `.crate[data-crop]` is measured before the re-render, the
difference is applied as an inverted transform, and the crates play back to their new positions once
over `0.52s` with `cubic-bezier(.16, 1, .3, 1)`. The identifier the measure keys on lives on the
`<article>` itself, so a crate is tracked across a re-render as one object even though its two
buttons carry their own ids. Answering the board's question also flashes it brighter and settles over
`0.5s`. Everything else is a `0.12–0.16s linear` colour or transform change on hover and disclosure.
Under `prefers-reduced-motion: reduce` all animation and transition durations are forced to `0.001ms`
and the re-lay is skipped entirely before it measures anything.

**What earns the re-lay** is a change to the *composition* of the stall — the place, the month, the
family filter, a crop going off the stall or coming back, and a stage being set, changed or cleared
(which moves the crate into or out of the "Growing now" row). What does not earn it is a change
confined to a single crate: taking a crop into the garden and opening or closing a crate both
re-render in place, with no measure and no transform. If the crate is in the same spot afterwards,
nothing animates.

### Named Rules

**The One-Grammar Rule** (replaces the former One-Moment Rule, at the owner's
request for more flair). Motion is no longer a single moment, but it is still a
single idea: the stall's own physics. Things are WRITTEN ON — chalk wipes left
to right via `clip-path`, used for the board's place name and for a stage bar
being recorded; SLID ALONG — the month rail's marker is one element that travels
between months rather than a border blinking off in one place and on in another;
and SET DOWN — the FLIP re-lay settles crates from `scale(1.03)` with a stagger
proportional to distance travelled, capped at 150ms, the way a hand works across
a stall. Nothing fades in for decoration. Every animation is bound to an action
the grower took: the chalk wipe fires only when a location resolves, the stage
wipe only on the crate just staged (`crate--just-staged`), the tally only when
the count actually changes, the unroll only when the legend is opened. A render
triggered by an unrelated action animates nothing. Under `prefers-reduced-motion`
the travel is dropped and the state changes remain.

## Do's and Don'ts

### Do:

- **Do** pick the produce role by what the colour sits on: `--f-*` for a filled plane taking chalk
  type, `--m-*` for the hue standing on the limewash ground.
- **Do** measure any new colour against the exact composited surface it will land on, alpha washes
  included — that is why `--ink-3` exists at 5.3:1 where `--ink-2` would have shipped at 3.83:1.
- **Do** give every state at least two channels: colour plus wording, plus position or a printed
  mark.
- **Do** set new type on the Archivo width axis — expanded (104–118%) for signage, ~92–96% for prose,
  condensed (74–88%) for controls and micro-labels.
- **Do** close up uppercase display type (negative tracking) and open out uppercase label type
  (positive tracking).
- **Do** hold grids with fixed field heights and `align-items: start`, so one item can expand without
  disturbing its neighbours.
- **Do** join any new sticky band to the measured `--board-h` chain rather than hard-coding an offset.
- **Do** land every destructive action somewhere visible and reversible from the row it lands in —
  one at a time and all at once — instead of guarding it with a confirm dialog.
- **Do** print a control's side effect on the control itself, before the press, in the smaller
  sentence-case register ("also takes it out of your garden").
- **Do** let what the grower recorded outrank what the system computed: move that crate above the
  advice rows, and switch its sentence from advice to report.
- **Do** print anything that overrules the calendar in the crate's one overrule slot — the ink bar
  across the bottom of the produce band — in ground-coloured micro type.
- **Do** enumerate a control's options from its subject's own class, so it never offers a state the
  subject cannot occupy.
- **Do** theme the browser's own widgets into the palette — including the shadow-DOM parts of a
  native input — rather than rebuilding the control to get the look.
- **Do** reuse the quiet panel for any empty stall, whatever emptied it.
- **Do** draw new icons on the 24×24 grid at `1.75` stroke with round caps, in the same authored set.
- **Do** state uncertainty in the interface — the medium-confidence caveat, the out-of-area note, the
  "working from the calendar alone" line, and the storage disclosure are design elements, not
  disclaimers to be tucked away.

### Don't:

- **Don't** use a `box-shadow` for depth. The system has no light source; change the material,
  thicken the rule, or invert to an ink plane instead.
- **Don't** exceed a `2px` radius, and don't put a radius on anything that holds content.
- **Don't** introduce a second typeface, an icon font, or an emoji. The width axis replaces the
  second family.
- **Don't** let a produce hue decorate a control that isn't a crop; the fruiting-red accent on focus,
  caret, selection, active month and the solid button's hover is the whole chromatic UI budget.
- **Don't** use `--zinc` for anything that is in season — it means "drained", and only that.
- **Don't** put setup, or any prerequisite, on a route in front of the stall. A missing input is a
  state of the board, not a door.
- **Don't** nest an interactive control inside another interactive control; make the container an
  `<article>` and give each action its own button and its own `aria` state.
- **Don't** solve a ragged grid with equal-height rows or stretch alignment.
- **Don't** animate anything other than the re-lay for longer than 0.16s, and don't add entrance or
  scroll-triggered motion.
- **Don't** show an empty result as a failure. An empty front row gets a designed panel with the
  reason in the grower's terms, the next real date, and the way to it.
- **Don't** open a dialog to confirm a removal, or anything else. Nothing here is destroyed, so
  nothing needs guarding; the reversal row is the confirmation.
- **Don't** stack two badges in one produce band. If the stage bar is saying the crop is in the
  garden, the IN GARDEN tag comes off.
- **Don't** invent a second place for "the calendar is overruled here". There is one bar, at the
  bottom of the produce band, and a new overruling source shares it or does not ship.
- **Don't** animate a change that lives inside a single crate. The re-lay is for the stall
  recomposing, not for a badge or a disclosure.
- **Don't** name a control after the software's verb when the grower has a sentence for it. "I don't
  grow this" and "What have you actually done?" beat "Hide" and "Status".

<!--
NOT CANONIZED — defects the build carries, recorded so they are not inherited:

1. One reused literal is still untokenized: `#E7EADF`, the colour-mix partner behind every harvest
   tint (3 uses). It is a composition detail rather than a palette entry, so it is not recorded in
   the frontmatter; `#C9CFC2` (the empty season-bar cell) and `#9AA394` (the field placeholder) are
   single-use and likewise not tokens.
2. The off-stall item's 9×9 family square is filled with the **field** colour (`--f-*`) while
   sitting on the kraft slat, where the family filter chip in the same situation uses the **mark**
   colour. It is a solid swatch and not type, so no contrast threshold is breached, but it is an
   inconsistency against the Two-Role Produce Rule as written. Recorded as observed, not smoothed:
   the rule is the system, the square is the exception, and the square should move to `--m-*`.
3. `.row--garden .row__title { color: var(--ink) }` restates the default rather than changing it.
   It is harmless and reads as a deliberate note-to-self that this row is not demoted the way
   `.row--off` is, but it is not a live declaration and is documented above as intent, not effect.
4. The direction contract says "1px rules" and "squared corners". The built world uses 1px as the
   hairline default but 2px and 3px as deliberate structural weights, and a 2px chamfer on controls.
   The build is recorded; the contract's phrasing was the ambition, not the measurement.

FIXED SINCE THE LAST PASS — previously recorded here, now resolved in the build and removed:
- `--kraft` / `--kraft-2` are gone from `:root`; a comment now explains that the slat's base and
  grain live inside the SVG data URI, which cannot read custom properties.
- `#E8C46A`, `#58614F` and `#4A5247` are tokenized as `--caution`, `--slate-edge` and `--slate-rule`.
- The FLIP re-lay now runs: `withRelay()` queries `.crate[data-crop]` and the `<article>` carries
  `data-crop`. The built-world note under Motion has been removed and the section now describes
  observed behaviour.
-->
