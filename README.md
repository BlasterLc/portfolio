# build-your-tech

My portfolio, built as a room you walk into: a small bedroom with a CRT TV and a PlayStation 2. Switch the TV on, hear the console boot, and the menu on the screen is the portfolio: About, Skills (a "memory card" of saves), Projects (discs you insert into the console), Guestbook and Contact. Made for the **AWS Student Builder Challenge: Build Your Tech Superpower**.

**Live site:** https://main.d5w3zjhtyz0vy.amplifyapp.com/ (AWS Amplify Hosting, us-east-1)

## The creative feature

The portfolio *is* the PS2 menu. Projects are discs: inserting one makes the console read it, then the TV shows what that project is and links to it. Skills are saves on a memory card, each with a small 3D icon. Visitors can leave a save of their own on the memory card (the guestbook). The two certificates I won hang on the wall of the room and open when clicked. Everything you hear (the boot chord, the menu sounds) is synthesized in the browser; there is no sampled audio.

It never gets in the way of reading the site: the **Plain version** (top right) is a normal page with the same content, a PS2-style cross-bar of tabs. Phones start in the plain version, because the 3D room is about 14 MB and heavy to warm up; the 3D models are only fetched when you press "Enter the 3D room". It respects `prefers-reduced-motion`.

## How to explore it

1. Click the TV; the camera moves in. Click its power button (a glowing ring marks it).
2. On the TV: arrow keys / drag / swipe to move, Enter to open, Esc to go back. Skills has an **Options** button (sound, 12/24 h clock).
3. Or press **Plain version** for the same content as a normal page.

## AWS services

| Service | What it does here |
|---|---|
| **AWS Amplify Hosting** | Hosts the site (HTTPS, CDN). Deployed with `deploy/amplify-deploy.sh` (manual zip deployment), which also writes a log to `docs/evidence/` |
| **API Gateway (HTTP API) + Lambda + DynamoDB** | The guestbook: `GET/POST /saves`, with input validation, link blocking, rate limits and TTL. New saves wait as *pending* until I approve them (`deploy/moderate.sh`) |
| **CloudWatch + SNS** | Alarms for Lambda errors and for unusual call volume |
| **CloudTrail** | Audit trail of every deploy call |
| **AWS CDK (TypeScript)** | The backend stack (`infra/`), with tests |

The contact section uses plain links (email, GitHub, LinkedIn); there is no contact form.

## Repository layout

| Path | What it is |
|---|---|
| `site/` | The site: one `index.html` (three.js from a CDN) plus `assets/` (3D models, intro video, props, certificates) |
| `backend/` | The guestbook Lambda (TypeScript) and its tests |
| `infra/` | CDK stack for the guestbook API, table and alarms, with tests |
| `deploy/` | `build-dist.py` packs only what the page loads and refuses to build if a 3D model is not CC0 / CC BY; `amplify-deploy.sh` and `api-deploy.sh` deploy; `moderate.sh` approves guestbook entries |
| `tools/` | Generators used to make assets: the sound lab, the boot-intro renderer and the 3D skill-icon renderer |
| `docs/` | Notes, the AWS evidence (`docs/evidence/`: deploy logs and console screenshots) and archived earlier directions |

## Run it locally

```bash
python3 -m http.server 8766 --directory site
# open http://localhost:8766/   (?view=3d forces the room on a phone, ?quality=low tests the light profile, ?debug shows a performance panel)
```

Serve it over http: opened as a `file://` page the browser blocks the 3D models. The guestbook API only accepts requests from the deployed site, so on localhost the guestbook shows an error; that is expected.

Tests for the backend and the CDK stack: `npm install && npm test`.

## Deploy

```bash
aws login --profile <profile>        # when the session has expired
bash deploy/amplify-deploy.sh         # builds, checks licences, deploys, verifies, logs to docs/evidence/
bash deploy/api-deploy.sh             # the guestbook API (CDK)
```

## Credits and licences

The code and the boot sounds, intro and icons renders in this repository are original work. Third-party material is limited to openly licensed assets, and the page footer credits it:

- **PlayStation 2** by Artem P, CC BY 4.0 (https://sketchfab.com/3d-models/playstation-2-99d0c0c7f024430ca1c6179a07d85ffa), scaled and re-centred.
- **Crt_tv** by teacherap123, CC BY 4.0 (https://sketchfab.com/3d-models/crt-tv-3b38466fa2f74b388c4a104e8872caca), with its printed brand and controls covered.
- **Room props** (aloe plant, throw pillows, rubber duck, alarm clock, picture frame) from [Poly Haven](https://polyhaven.com), CC0.
- **Skill icons** are extruded from [simple-icons](https://simpleicons.org) paths (CC0 data); the logos remain the property of their owners and are used only to name technologies.
- Typeface of the intro name: **Dosis** (SIL Open Font License). Boot sound, menu sounds and the intro are synthesized / rendered here; no Sony audio, logo or typeface is used.
- "PlayStation" is a trademark of Sony Interactive Entertainment; this project is an unofficial homage and is not affiliated with Sony.
