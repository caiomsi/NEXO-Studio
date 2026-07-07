# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What this is

NEXO STUDIO — Caio's **second agency**, run with friends in Brazil, **separate from
MSI Studio**. All content is pt-BR. Static HTML/CSS/JS, no build step. There's also a
`README.md` in this repo — check it too. See the root `../CLAUDE.md` for shared
conventions.

## Structure

`index.html` at root, `css/style.css`, `js/main.js`, `404.html`. In `images/`:
portfolio thumbnails (`work-bluepipe.jpg`, `work-brasa-e-sal.jpg`,
`work-maple-and-bean.jpg`, `work-photofolio.jpg`, `work-strata.jpg`,
`work-verso-coffee.jpg` — keep in sync as the portfolio grows), `nexo-estudio-noite.jpg`
(studio photo), `nexo-og.jpg` (OG card), `nexo-logo-original.svg`. No custom domain yet
(`caiomsi.github.io/NEXO-Studio`).

## Design language

**Dark cinematic studio** (redesigned 2026-07-07 from the original white editorial-Swiss
look). Near-black canvas `#0a0a0b`, red-as-light glow system (`#E63946` / bright
`#ff5a66` / `--glow`) — everything red carries a glow, nothing red is flat. Display =
**Archivo** expanded (`font-stretch:125%`, heavy); **Space Mono** for kickers/labels;
**Bodoni Moda 700** kept *only* for the brand word + giant footer word (echoes the
logo). Film grain + vignette overlays, red spotlight gradients. Red-✕ motif throughout.

Hero signature = **"o filamento"**: a scroll-drawn SVG light-wire (`#thread` in the
markup, thread module in `js/main.js`) — straight vertical/45° segments like circuit
traces, born at the neon word "conectam", drawing the brand ✕ in the hero then weaving
the whole page to the footer. Two layers: a faint always-visible base wire + a glowing
path that fills as you scroll (the tip chases scroll with a lerp, carries a light halo).
Reduced-motion draws it statically. Don't reintroduce hero *objects* (a framed X photo
and a looping X video were both rejected) — Caio wants page-wide motion, not a hero prop.

Portfolio = the live demo sites themselves.

## Lead flow — two channels, one placeholder

A 3-step brief wizard both (a) POSTs to the shared `MSI-Forms` backend
(`site: nexo-studio`) and (b) generates a pre-filled `wa.me` message. **`js/main.js`
line 6, `WHATSAPP_NUMBER = '5534999999999'`, is still a placeholder** — not a real
number. Fix this (and check for other pt-BR placeholder prices/copy) before treating
this as launch-ready.
