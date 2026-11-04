# Plain landing: design decisions (awwwards pass, 4 Nov 2026)

Brief: the non-3D landing of Matías's portfolio. Audience: AWS Student Builder Challenge jurors and recruiters who may never open the 3D room. Job: show the two wins and the projects fast, then let the visitor choose the room. Constraint: one static file, no build, no new CDNs.

## Three concepts
1. **Memory card browser** (the page is the PS2 browser; projects are save slots). Originality 3, fit 5, feasibility 5, portability 3.
2. **Boot sequence** (the page opens with the PS2 boot). Originality 3, fit 4, feasibility 3, portability 4: already exists in the 3D room, would clone it.
3. **The orb as compass** (one huge radial-bar orb sits behind the page, and the page is read *through* it: it turns with the scroll, snaps one step per chapter and changes its glow, the way the PS2 menu orb answers the selection). Originality 4, fit 5, feasibility 5, portability 2.

Pick: **3**, with the save-slot idea from 1 for projects (each project is a disc, the same discs as the TV's Projects screen, painted with the project's own colours from `PROJECTS`).

## Concept card
- Idea: the page is read through the PS2 menu orb, which answers every move.
- Metaphor: the PS2 system menu (selection moves, the background reacts).
- Signature: the fixed orb behind everything. Scroll turns it, each chapter snaps it one step and changes its glow (blue, cyan for Skills, gold for Projects, warm room orange for Contact). The nav pill's highlight slides to the current chapter on the same driver.
- Emotion (first 3 s): "I am inside the console's menu".
- Motion verb: *settle like glass*: quick exponential ease-out, no bounce.
- Screenshot: hero, huge name over the half-visible orb with the glass nav pill.

## System
- Palette: ground #060a3a, mid #0d1468, light #1c2c9c, ink #eef2ff, muted #b4c2ee, gold #e8e464, cyan #86dcff, warm #ff9a52 (the room, used only for the Contact chapter glow).
- Type: Dosis (display, bundled), Quicksand (body, already loaded by the page).
- Driver: one `plainFx` module. Inputs: scroll position, pointer, current chapter. Outputs: orb rotation/offset, glow colour, nav indicator, progress line, cube parallax. No constant loop: rAF runs only while something is still moving. Idle life comes from a slow CSS spin on the orb group. Everything is off under `prefers-reduced-motion` except the instant chapter colour change.
- Honest content: all copy comes from the page's own data. Nothing invented.

## Round 2 (critic score 6.5): the page becomes the PS2 browser
Critic's verdict: same left-title/right-list layout in every section, no scale contrast, concept (menu, discs, memory card) not used structurally. Bold move adopted: **screens, not a long scroll**.
- A cross-bar of seven glass icon tiles (Home, Wins, About, Skills, Projects, Guestbook, Contact) like the PS2 browser. The selected tile lifts, scales and glows gold; keys left/right and the tiles switch screens; a screen change settles in from the side (direction follows the move), instant under reduced motion.
- Each screen has its own structure: Home (poster + orb), Wins (two plates + big certificate), About (small paragraph + huge pull statement), Skills (tile grid), Projects (disc select: row of discs + one big spinning disc and details), Guestbook (memory-card slots), Contact (big rows).
- The fixed orb is the compass: each screen snaps it 30 degrees and changes its glow; it dims on dense screens. Progress line = position along the cross-bar. Mobile: the cross-bar is a bottom tab bar.
- Accessibility: tablist/tab/tabpanel roles, arrow keys, inactive panels hidden, all content in the DOM.
