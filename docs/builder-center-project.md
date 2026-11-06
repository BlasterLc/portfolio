<!-- Paste section by section. Lines in [square brackets] are image/video slots; the images are in docs/builder-center/images/ (guide: docs/builder-center/README.md). The cover image (`00-cover.png`) goes in the project's cover field, not in the text. Delete this comment. -->

# A portfolio you walk into: a room with a PlayStation 2

**Matías Rodríguez** · Computer Science Engineering student, Universidad San Sebastián, Santiago, Chile
**Live site:** https://main.d5w3zjhtyz0vy.amplifyapp.com/ · **Code:** https://github.com/BlasterLc/portfolio

**Challenge:** AWS Student Builder Challenge: Build Your Tech Superpower · built between 27 October and 6 November 2026, by one person

> I would rather show you than list it.

## The idea

Some of us grew up in front of a CRT TV. The ritual was always the same: press the power button, wait for the startup chord, slide a disc into the tray and move through the menus with a controller that was too big for our hands. Nothing about it was efficient, and that was the point: you had to walk in to get anywhere.

I can still remember the nervous hope that the game I had just bought would load, and the joy when it finally did.

A flat list of projects cannot do that, and it says little about the person who built them. A room does: the plant, the controller on the rug, the certificates on the wall. So my portfolio is a small bedroom with a CRT TV and a PlayStation 2, and moving through it works like using a console: switch the TV on, pick a disc, read a save.

## The creative feature: the portfolio is a console

When you open the site, the TV is off and a glowing ring marks its power button (the hint on screen says "Click the TV to get closer"). Click, and the camera glides to the TV. Press the power button and the console boots, with a startup chord and an intro. The menu on the screen is the portfolio:

1. **About**: who I am and what I am working on.
2. **Skills**: a *memory card* of saves, each one a small 3D icon (Python, JavaScript, Next.js, Supabase, TypeScript, GitHub, AWS, self-hosting, Anthropic).
3. **Projects**: *discs*. Inserting one makes the console read it, then the TV shows what the project is and links to the live app and the code.
4. **Guestbook**: visitors leave a save of their own on the memory card (a name, a short message, a colour).
5. **Contact**: plain links.

The **Options** screen (triangle button on Skills, or the O key) has a sound switch, a volume slider and a 12/24-hour clock; the volume is remembered between visits.

About, Skills and Projects are the three core sections the challenge asks for; Guestbook and Contact are extras. The two certificates I won hang on the wall of the room and open when clicked: *Hackathon Winner, AWS Zero to Shipped 2026* (Rumbo a Casa) and *1st place, Social Impact, Rally Latinoamericano de Innovación 2026* (Minuto Cero).

[IMAGE 1 of 5 · upload `02-tv-skills-and-disc.png` · alt text: Skills as a memory card of 3D icons, and a project disc with its links]

It never gets in the way of reading the site. The **Plain version** (button at the top right) shows exactly the same content as a normal page, in the style of the PS2 browser, and **phones start there** because the 3D room is heavy; the 3D models are only downloaded when you press "Enter the 3D room".

[IMAGE 2 of 5 · upload `04-plain-version-phone.png` · alt text: On a phone: the plain version (home and projects) and the 3D room's TV menu]

## Technical decisions

- **All the sound is synthesized in the browser.** The boot chord, the menu sounds and every click are generated with Web Audio, and the intro is a 250 KB video rendered by a script in the repository. A full 3D room with no audio files to download.
- **The 3D room is optional, not required.** It is about 14 MB and demanding to warm up. Phones start in the plain version and fetch the models on demand; the choice is remembered. On phones the render resolution and the TV's redraw rate are tuned for legibility, and the page drops to a lighter profile if the frame rate stays low.
- **Licences are enforced by code.** The packaging script refuses to build if any 3D model is not CC0 or CC BY, and the page footer credits every author. An early version of the room used models that could not be redistributed; this is how that cannot happen again.
- **Moderation before publication.** The guestbook has no login, so every new save waits as *pending* and nothing is public until I approve it.

## Architecture on AWS

[IMAGE 3 of 5 · upload `06-architecture.png` · alt text: Architecture diagram: the visitor reaches Amplify Hosting for the static site and API Gateway, Lambda and DynamoDB for the guestbook, with CloudWatch alarms, SNS, CDK and CloudTrail]

| Service | What it does here |
|---|---|
| **AWS Amplify Hosting** | Serves the site over HTTPS from a CDN. Deployed with a script (`deploy/amplify-deploy.sh`) that builds the package, checks licences, uploads it, waits for the job to succeed, checks the public URL and keeps a log. |
| **Amazon API Gateway (HTTP API)** | `GET /saves` and `POST /saves`. CORS limited to the site and a request-rate cap (5 per second, burst 10) before the function is even invoked. |
| **AWS Lambda** | Validates the request, applies the usage limits, reads or writes the table. TypeScript, no framework. |
| **Amazon DynamoDB** | One table: approved saves (kept 60 days), pending saves (14 days) and the usage counters. Everything expires by TTL. |
| **Amazon CloudWatch and SNS** | An alarm for Lambda errors and one for unusual call volume. |
| **AWS CloudTrail** | The audit trail of every deploy call. |
| **AWS CDK (TypeScript)** | The backend as code, with tests. |

[IMAGE 4 of 5 · upload `03-aws-evidence-grid.png` · alt text: The CDK stack, the tests passing, the live smoke test against the API, and the Amplify console showing deployment 35 succeeded]

## Guardrails

There is no login, so the guestbook is protected by volume and by validation:

- **Usage limits** with atomic counters in DynamoDB: 3 saves per visitor per hour, 10 per minute and 300 per day for the whole site.
- **Validation of everything the visitor sends**: body size (2 KB), JSON shape, field lengths (20 characters for the name, 140 for the message), control and hidden characters, markup, links, a basic filter for insults and a honeypot field real visitors never fill.
- **Nothing is public until approved.** A script (`moderate.sh list | approve | reject | remove`) handles it.
- **Alarms** for 5 or more Lambda errors in five minutes and for more than 600 calls in an hour.
- **46 automated tests** cover the backend and the CDK stack, with the DynamoDB client faked.

## Try it without typing anything

You do not need to write anything to see everything: there is no login, no form, and the guestbook is read-only unless you choose to leave a save. Open the site, click the TV, and use the arrow keys and Enter (or tap and swipe).

## Privacy and responsible use

- No login, no cookies, no analytics. The only thing the browser stores is which version (3D or plain) you picked.
- A save holds the name, message and colour the visitor typed; the page asks not to write personal data in it.
- The visitor's IP address is never stored, only a salted one-way hash, kept for about two hours at most, to enforce the limit.
- The contact section is plain links (email, GitHub, LinkedIn).

## Accessible by design

- The **plain version** has the whole content as a normal document and works with the keyboard (arrow keys between tabs, skills and projects).
- `prefers-reduced-motion` is respected: transitions, spinning and the intro animation are replaced by static states.
- The 3D room works with the keyboard: arrow keys to move, Enter to open, Esc to go back.

## How I built it with a coding agent connected to AWS

I built the site with Claude Code, as a one-person project. The repository has more than 80 commits and 46 automated tests (40 for the backend, 6 for the CDK stack). The first deployment to Amplify was done by the agent through the official AWS MCP server, and those calls are recorded in CloudTrail (an extract is in the repository). Some of the real problems along the way:

- **The 3D room lagged.** Instead of guessing, I added a diagnostics panel that measured it: drawing the TV cost half a millisecond, the GPU was the real cost. That led to dynamic resolution and later to the phone profile.
- **My first boot sound was wrong** (a low hum). Measuring the reference clips, their spectrum and volume curve, showed a dense chord between 200 and 1,300 Hz. Lesson: measure before you tune.
- **Licences.** Several 3D models I had downloaded could not be redistributed. The packaging script now refuses to build if a model is not CC0 or CC BY.
- **A one-line comment swallowed the code after it**, twice, and silently broke the page. Each time the symptom was that the page stopped starting; the fix was to test in a real browser before deploying.
- **The room stayed stuck on the loading screen on a real device** while it worked in my tests: the last warm-up step could throw without anyone noticing. It now skips the failing step and has a time limit.
- **An expired `aws login` session** looks like a broken deploy; it is not.

## Proof of the agent connection

Claude Code was connected to my AWS account in two ways, and both leave a trail in AWS CloudTrail:

- **The official AWS MCP server (`aws-mcp`).** The agent made the first deployment to Amplify through it (`CreateApp`, `CreateBranch`, `CreateDeployment`, `StartDeployment`). CloudTrail records those calls under my IAM user with the user agent `aws-mcp.amazonaws.com`.
- **The AWS CLI and CDK**, from my terminal, for the repeatable deploys (`deploy/amplify-deploy.sh`) and for the backend stack.

A redacted CloudTrail extract and the deploy logs are in the repository under `docs/evidence/`.

## AWS services and coding agent

- **AWS:** Amplify Hosting, API Gateway (HTTP API), Lambda, DynamoDB, CloudWatch and SNS, CloudTrail, IAM, and CloudFormation through the CDK. The site was deployed to Amplify Hosting, as the challenge requires.
- **Coding agent:** Claude Code, working against the account through the official AWS MCP server, the AWS CLI and the CDK.

## Evidence

[IMAGE 5 of 5 · upload `05-cloudtrail-extract.png` · alt text: CloudTrail: the agent's Amplify deploy calls through the AWS MCP server]

More screenshots (the menu, the guestbook, Options, the plain version, the phone) are in `docs/evidence/screens/`. Deploy logs (the account id is masked), screenshots of the terminal and of the site, and a CloudTrail extract are in the repository: https://github.com/BlasterLc/portfolio/tree/main/docs/evidence

## Limitations

- The usage limits are global, not per person (300 saves a day for the whole site): at a very busy moment a visitor may be told to try again later.
- Guestbook moderation is manual (a script); there is no admin page yet.
- The 3D room is about 14 MB and needs WebGL. Low-end phones are better served by the plain version, which is the default on phones. Sound starts after the first click or key press, as browsers require.
- The guestbook API only accepts requests from the deployed site, so it shows an error when the page is opened from `localhost`.
- Deploys are manual (a zip uploaded by a script), not continuous deployment.

## What I would do next

Make the 3D room lighter for low-end phones, add an admin page for the guestbook, split the single `index.html` into modules, and connect the repository to Amplify for continuous deployment.

## Credits

PlayStation 2 model by Artem P and Crt_tv model by teacherap123 (both CC BY 4.0, from Sketchfab); room props from Poly Haven (CC0); skill icons from simple-icons paths (CC0 data, logos belong to their owners); the Dosis typeface (SIL OFL). All sound and the intro are synthesized or rendered for this project. "PlayStation" is a trademark of Sony Interactive Entertainment; this is an unofficial homage.
