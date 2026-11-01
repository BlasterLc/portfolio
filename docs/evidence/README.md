# Evidence: portfolio on AWS (AWS Student Builder Challenge)

Running record of how the site was put on AWS, so the Builder Center write-up (services used, screenshots, what was learned) can be assembled from facts instead of memory. Same idea as the evidence folder of the previous project.

## Live public URL (ship gate)

**SiteUrl:** https://main.d5w3zjhtyz0vy.amplifyapp.com/

- Service: **AWS Amplify Hosting** (manual deployment of a zip; S3 + CloudFront underneath, managed by Amplify)
- App id: `d5w3zjhtyz0vy` (name `ps2-room-portfolio`), branch `main` (stage PRODUCTION), region `us-east-1`
- First deploy: 2026-10-31 22:24-22:25 (-03) = 2026-11-01 01:24 UTC, job `1`: steps `DEPLOY` and `VERIFY` both `SUCCEED`.
- Status of the site: **prototype** (placeholder text, no backend yet). It proves the hosting path; content and the AWS backend come next.

## How it was deployed

1. **First deploy, by the coding agent (Claude Code) through the official AWS MCP server (`aws-mcp`, `run_script`)**, as IAM user `blaster`: `amplify:CreateApp`, `CreateBranch`, `CreateDeployment`; the zip was uploaded with `curl -X PUT` to the presigned URL; then `StartDeployment` and `GetJob` until `SUCCEED`. These calls are in CloudTrail (see below).
2. **Repeatable deploys, from the developer's terminal:** `bash deploy/amplify-deploy.sh` (needs `AWS_PROFILE=blaster aws login` first). It builds the package, runs a licence check, deploys, waits for `SUCCEED`, checks the public URL and writes `docs/evidence/amplify-deploy-<UTC timestamp>.log` (12-digit account id masked, upload URL never printed).
3. `deploy/build-dist.py` packs only the files the page loads and **refuses to build** if any 3D model is not CC0 / CC BY 4.0 (a model with a "Sketchfab Standard" licence cannot be republished).

## Verified (2026-10-31, after the first deploy)

- `GET /` -> 200 `text/html`; `/assets/playstation_2GRANDE2.glb`, `/assets/crt_tvCC3.glb` -> 200 `model/gltf-binary`; `/assets/intro/intro.webm` -> 200 `video/webm`; `/assets/props/.../*.gltf` -> 200. A file that was left out on purpose (`/assets/props/football/...`) -> 404.
- A real browser (headless Chromium) loaded the live URL with no console errors and no 4xx responses: 5 of 5 props loaded; the TV starts **off** and the hint reads "Click the TV to get closer".

## Services used (update as they are added)

| Service | What for | Status |
|---|---|---|
| AWS Amplify Hosting | Hosts the site (HTTPS, CDN) | **Live** |
| API Gateway (HTTP API) + Lambda + DynamoDB | Guestbook: visitors leave a "save" on the memory card (`GET/POST /saves`), with usage limits, input validation and TTL | Code + tests done (35 tests); stack `PortfolioApi` defined in `infra/`; deploy with `bash deploy/api-deploy.sh` |
| CloudWatch + SNS | Alarms for Lambda errors and for unusual call volume | Defined in the stack |
| SES | Contact form email | Not built yet |
| CloudTrail | Audit trail of every call above | On (default 90-day event history) |

## Evidence to collect for the Builder Center project ("your project")

Capture these as they happen, redact the account id and any ARN with the account id:

- [ ] Terminal: `bash deploy/amplify-deploy.sh` finishing (`DONE`, `SiteUrl`, job `SUCCEED`) -> `deploy-terminal.png`
- [ ] Amplify console: app overview with the live URL; the deployment job with `DEPLOY` + `VERIFY` succeeded -> `amplify-console-app.png`, `amplify-console-job.png`
- [ ] The live site on desktop and on a phone-width window (390 px), TV off and TV on -> `site-live-desktop.png`, `site-live-mobile.png`
- [x] CloudTrail: `CreateApp`, `CreateBranch`, `CreateDeployment`, `StartDeployment` (user `blaster`, user agent `aws-mcp.amazonaws.com`), 2026-10-31 22:24-22:25 (-03). Redacted extract `cloudtrail-amplify.json` and a rendering of it, `cloudtrail-amplify-extract.png` (generated from the API, **not** a console screenshot). Still worth adding a real console screenshot of CloudTrail > Event history, filtered by event source `amplify.amazonaws.com`.
- [ ] Backend services (API Gateway / Lambda / DynamoDB / SES) once they exist: console pages + a working request
- [ ] A short list of lessons and problems (see below), written while fresh

## Notes for the "challenges and lessons" section

- Manual (zip) deployment avoids needing the repository first; once the GitHub repo is public it can be connected in Amplify for CI/CD.
- `aws login` sessions expire; a 401-style "session has expired" from the CLI means re-running `aws login`, not a broken deploy.
- Third-party 3D models are the main licensing risk of the project: only CC0 and CC BY are published, and the page footer credits every author.
