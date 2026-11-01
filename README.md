# build-your-tech

A personal portfolio you explore as a room: a 3D bedroom with a CRT TV and a PlayStation 2. Switch the TV on, hear the console boot, and the menu on the screen is the portfolio (About, Skills, Projects, Contact). Built for the **AWS Student Builder Challenge: Build Your Tech Superpower**.

**Live site:** https://main.d5w3zjhtyz0vy.amplifyapp.com/ (AWS Amplify Hosting, us-east-1)

> Status: work in progress. The room, the TV, the boot intro and the sound are working; the portfolio text is still placeholder and the AWS backend is not built yet.

## How to explore it

1. Click the TV (a pulsing ring marks its power button) and the camera moves in.
2. Click the power button: the TV boots with a synthesized startup chord and an intro.
3. Drag, scroll or use the arrow keys to move through the menu; Enter opens, Esc / the back button returns.
4. Prefer a plain page? The **Plain version** button shows the same content as a normal document. `prefers-reduced-motion` is respected.

## Repository layout

| Path | What it is |
|---|---|
| `site/` | The site itself: one `index.html` (three.js from a CDN) plus `assets/` (3D models, intro video, props) |
| `deploy/` | `build-dist.py` packs only what the page loads and refuses to build if a 3D model is not CC0 / CC BY; `amplify-deploy.sh` deploys the zip to Amplify Hosting and writes a log |
| `tools/` | Generators used to make assets: the sound lab (all audio is synthesized with Web Audio, no samples), the boot-intro renderer and the 3D skill-icon renderer |
| `docs/` | Notes, the backlog, the AWS evidence log (`docs/evidence/`) and archived earlier directions (`docs/archive/`) |

## Run it locally

```bash
python3 -m http.server 8766 --directory site
# open http://localhost:8766/   (add ?debug for the performance panel, ?quality=low to test the light profile)
```

## Deploy

```bash
AWS_PROFILE=<profile> aws login      # when the session has expired
bash deploy/amplify-deploy.sh         # builds, checks licences, deploys, verifies, logs to docs/evidence/
```

## Credits and licences

The code and the boot sounds, intro and icons renders in this repository are original work. Third-party material is limited to openly licensed assets, and the page footer credits it:

- **PlayStation 2** by Artem P, CC BY 4.0 (https://sketchfab.com/3d-models/playstation-2-99d0c0c7f024430ca1c6179a07d85ffa), scaled and re-centred.
- **Crt_tv** by teacherap123, CC BY 4.0 (https://sketchfab.com/3d-models/crt-tv-3b38466fa2f74b388c4a104e8872caca), with its printed brand and controls covered.
- **Room props** (aloe plant, throw pillows, rubber duck, alarm clock, picture frame) from [Poly Haven](https://polyhaven.com), CC0.
- **Skill icons** are extruded from [simple-icons](https://simpleicons.org) paths (CC0 data); the logos remain the property of their owners and are used only to name technologies.
- Typeface of the intro name: **Dosis** (SIL Open Font License). Boot sound, menu sounds and the intro are synthesized / rendered here; no Sony audio, logo or typeface is used.
- "PlayStation" is a trademark of Sony Interactive Entertainment; this project is an unofficial homage and is not affiliated with Sony.
