# Builder Center: images and where each one goes

Text to paste: `../builder-center-project.md`. How the *Rumbo a Casa* text was structured (the mould): `../builder-center-esquema.md`.
Upload the images in numeric order. Alt text is the caption to paste under each one.

## Ready (in `images/`)

| File | Section of the text | Caption / alt text |
|---|---|---|
| `01-hero-room-tv-off.png` | Under the title (cover / main image) | The room with the TV off and a glowing ring on its power button |
| `02-tv-home-menu.png` | The creative feature, list of the menu | The PS2-style home menu on the TV |
| `03-tv-skills-memory-card.png` | The creative feature | Skills as a memory card of 3D icons |
| `04-tv-project-disc.png` | The creative feature | A project disc read by the console, with its links |
| `05-tv-guestbook.png` | The creative feature | The guestbook: visitors leave a save on the memory card |
| `10-tv-options-volume.png` | The creative feature (after the list, Options paragraph) | Options: sound switch, volume slider and clock |
| `06-plain-version-desktop.png` | Right after the TV screenshots (plain version) | The plain version, same content as a normal page |
| `07-plain-version-phone.png` | Same place | Phone (390 px) starts in the plain version |
| `08-phone-tv-menu.png` | Same place / Accessible by design | The TV menu on a phone |
| `09-cloudtrail-extract.png` | Evidence (and "How I built it with a coding agent") | CloudTrail: the agent's Amplify deploy calls via the AWS MCP server (rendered from the API, not a console capture) |

Extras (only if the form allows more images): `extra-plain-home-desktop.png`, `extra-plain-projects-desktop.png`, `extra-phone-plain-projects.png`, `extra-phone-room.png`.

## Needs redoing

- `extra-options-OLD-no-volume.png` shows Options **before** the volume slider. Do not use it; `10-tv-options-volume.png` replaces it.

## Still to capture (account owner, AWS console, keep the account id out of the frame)

Save them in `images/` with these names. Details of each page: `../evidence/README.md`.

| File to create | Page | Goes in |
|---|---|---|
| `aws-01-amplify-app.png` | Amplify app `ps2-room-portfolio`, overview with the live URL | Architecture on AWS |
| `aws-02-amplify-deployments.png` | Amplify, branch `main`, Deployments (Deploy + Verify succeeded; latest job is 34) | Architecture on AWS |
| `aws-03-cloudformation-stack.png` | CloudFormation `PortfolioApi`, Resources | Architecture on AWS |
| `aws-04-apigateway-routes.png` | API Gateway `portfolio-guestbook`, routes + throttling | Architecture on AWS |
| `aws-05-lambda-function.png` | Lambda `PortfolioApi-ApiFn...`, Node.js 22 | Architecture on AWS |
| `aws-06-dynamodb-items.png` | DynamoDB table, Explore items (saves + counters with TTL) | Architecture on AWS / Guardrails |
| `aws-07-cloudwatch-alarms.png` | CloudWatch alarms `ApiErrors`, `ApiVolume` (OK) | Guardrails |
| `aws-08-cloudtrail-history.png` | CloudTrail event history, source `amplify.amazonaws.com` | Evidence |
| `deploy-terminal.png` | Terminal: `bash deploy/amplify-deploy.sh` ending in `DONE` | Technical decisions / Evidence |

Optional: a 20-30 s video (TV on, boot, open a disc) for the slot under the title; the `/brag` video in `_local/brag/` can serve.
