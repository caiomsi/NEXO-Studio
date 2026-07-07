# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What this is

NEXO STUDIO — Caio's **second agency**, run with friends in Brazil, **separate from
MSI Studio**. All content is pt-BR. Static HTML/CSS/JS, no build step. There's also a
`README.md` in this repo — check it too. See the root `../CLAUDE.md` for shared
conventions.

## Structure

`index.html` at root, `css/style.css`, `js/main.js`, `404.html`, portfolio thumbnails
in `images/` (`work-bluepipe.jpg`, `work-brasa-e-sal.jpg`, `work-maple-and-bean.jpg`,
`work-photofolio.jpg`, `work-strata.jpg`, `work-verso-coffee.jpg` — keep in sync as
the portfolio grows), `nexo-logo-original.svg`. No custom domain yet
(`caiomsi.github.io/NEXO-Studio`).

## Design language

Editorial-Swiss: white/black/red (`#E63946`), Bodoni Moda + Schibsted Grotesk + Space
Mono, red-✕ motif taken from the logo. Portfolio = the live demo sites themselves.

## Lead flow — two channels, one placeholder

A 3-step brief wizard both (a) POSTs to the shared `MSI-Forms` backend
(`site: nexo-studio`) and (b) generates a pre-filled `wa.me` message. **`js/main.js`
line 6, `WHATSAPP_NUMBER = '5534999999999'`, is still a placeholder** — not a real
number. Fix this (and check for other pt-BR placeholder prices/copy) before treating
this as launch-ready.
