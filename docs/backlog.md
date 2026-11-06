# Known limitations and next steps

- The 3D room is heavy on low-end phones; phones start in the plain version and load the 3D models on demand. Resolution and the TV redraw rate are lowered on phones, and the page drops to a lighter profile if the frame rate stays low.
- Guestbook entries are moderated by hand (`deploy/moderate.sh`); there is no admin page.
- The site is one `index.html`; splitting it into modules would make it easier to maintain.
- Amplify Hosting is fed by a manual zip deployment (`deploy/amplify-deploy.sh`); connecting the GitHub repository for CI/CD is the natural next step.
- Earlier design directions and the old working notes are in `docs/archive/`.
