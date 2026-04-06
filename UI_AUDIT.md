# CauseHealth UI Audit — Stitch 22-25 vs Current Build

## LAYOUT & SPACING
- Reference: pt-28 (112px below top bar) | We have: content starts too close
- Reference: px-6 consistent horizontal padding | We have: sections bleed edge-to-edge
- Reference: space-y-12 (48px) between sections | We have: inconsistent 16-24px
- Reference: max-w-5xl mx-auto container | We have: no max-width
- Reference: pb-32 bottom padding for nav | We have: content hidden behind nav
- Reference: cards never touch screen edges | We have: cards go edge-to-edge

## TOP BAR
- Reference: h-20 (80px tall) | We have: shorter
- Reference: bg-[#FAF9F5]/70 backdrop-blur-3xl glass | We have: less blur
- Reference: shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] | We have: wrong shadow
- Reference: avatar w-10 h-10 ring-1 ring-[#C1C8C4]/20 | We have: no ring
- Reference: brand text-xl font-serif italic tracking-tighter | We have: not italic
- Reference: Material Symbols wght:200 thin icons | We have: Lucide (heavy)

## BOTTOM NAV
- Reference: h-24 (96px) with pb-4 | We have: shorter
- Reference: rounded-t-[32px] | We have: less rounded
- Reference: bg-white/70 backdrop-blur-3xl | We have: using surface color
- Reference: shadow-[0_-8px_32px_-4px_rgba(27,28,26,0.06)] | We have: wrong shadow
- Reference: active = full opacity + tiny dot below | We have: filled pill bg (WRONG)
- Reference: inactive = text-[#1A3C34]/40 | We have: wrong opacity
- Reference: labels text-[10px] uppercase tracking-widest font-bold | We have: wrong size
- Reference: Material Symbols wght:200 | We have: Lucide icons
- Reference: active:scale-90 on tap | We have: no tap feedback

## CARDS
- Reference: rounded-[32px] | We have: rounded-xl or rounded-3xl (too small)
- Reference: shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] | We have: heavier shadows
- Reference: p-8 (32px) inside every card | We have: p-4 or p-6
- Reference: NO borders anywhere | We have: some borders
- Reference: toolkit cards bg-[#F4F4F0] rounded-[24px] | We have: wrong bg/radius
- Reference: protocol card double-ring (outer bg-[#E9E8E4] rounded-[40px] p-1, inner bg-white rounded-[38px] p-10) | We have: flat single card
- Reference: dark cards bg-[#1A3C34] with gradient overlay | We have: flat dark bg
- Reference: dark card badge bg-white/10 backdrop-blur-md rounded-2xl p-4 | We have: missing

## TYPOGRAPHY
- Reference: greeting text-4xl tracking-tight NOT italic | We have: some wrongly italic
- Reference: score text-7xl italic | We have: may be wrong size
- Reference: section titles text-3xl NOT italic | We have: wrong style
- Reference: card titles font-bold text-sm Manrope | We have: may use serif
- Reference: labels text-[10px] uppercase tracking-[0.2em] font-bold | We have: inconsistent
- Reference: /100 in text-xl gold tertiary #BDAC52 | We have: no gold accent
- Reference: italic ONLY for score number, protocol quote, protocol title | We have: too liberal

## COLORS
- Reference: primary #01261F | We have: #012D1D or #1A3C34
- Reference: primary container #1A3C34 | We have: sometimes wrong shade
- Reference: surface #FAF9F5 | We have: may not be everywhere
- Reference: surface-container-low #F4F4F0 | We have: missing
- Reference: surface-container #EFEEEA | We have: missing
- Reference: surface-container-high #E9E8E4 | We have: missing
- Reference: on-surface #1B1C1A (NOT pure black) | We have: may use #000
- Reference: on-surface-variant #414846 | We have: inconsistent
- Reference: on-primary-container #83A69C | We have: wrong shade
- Reference: tertiary gold #6C5E06 / #BDAC52 | We have: MISSING entirely
- Reference: outline-variant #C1C8C4 at 10-20% for dividers | We have: full opacity

## TOOLKIT GRID
- Reference: grid-cols-2 md:grid-cols-4 gap-4 | We have: may be wrong
- Reference: each card bg-[#F4F4F0] p-6 rounded-[24px] | We have: wrong
- Reference: icon w-12 h-12 rounded-2xl bg-white shadow-sm mb-6 | We have: no container
- Reference: hover:scale-[1.02] transition-transform | We have: no hover
- Reference: title font-bold text-sm (Manrope) | We have: may be serif
- Reference: subtitle text-[11px] leading-relaxed | We have: wrong size

## SETTINGS PAGE
- Reference: back arrow + brand center + avatar right | We have: missing elements
- Reference: "Settings" font-headline italic text-4xl | We have: different style
- Reference: section icon + uppercase label | We have: plain text
- Reference: fields in bg-white inside bg-[#F4F4F0] rounded-[32px] container | We have: no container
- Reference: custom dark mode toggle bg-[#1A3C34] | We have: default toggle
- Reference: save button full-width uppercase tracking | We have: wrong style
- Reference: sign out text-[#BA1A1A] uppercase centered | We have: different

## LABS PAGE
- Reference: "Lab Results" font-headline italic text-4xl | We have: different
- Reference: full-width upload button uppercase | We have: different
- Reference: methodology dark card with sage checkmarks | We have: missing/different
- Reference: analytical framework section with feature cards | We have: missing

## MEDICATIONS PAGE
- Reference: heading font-headline italic text-4xl | We have: different
- Reference: + ADD DATA button bg-[#F4F4F0] uppercase | We have: different
- Reference: empty state with overlapping icons | We have: less refined
- Reference: philosophy + warning cards | We have: missing/different
- Reference: modal rounded-t-[32px] with drag handle | We have: styling off

## ONBOARDING
- Reference: goal cards full-width with icon + title + description | We have: inline text chips
- Reference: selected = bg-[#1A3C34] text-white full card | We have: small chips
- Reference: thin single progress bar | We have: may be segmented
- Reference: STEP 01 OF 07 + percent complete | We have: different format
- Reference: inspirational quote before Continue | We have: missing
- Reference: Continue full-width uppercase | We have: different style

## INTERACTIONS
- Reference: active:scale-90 on nav taps | We have: none
- Reference: hover:scale-[1.02] on toolkit cards | We have: none
- Reference: group-hover:shadow-md on icons | We have: none
- Reference: decorative SVG opacity transitions | We have: none
