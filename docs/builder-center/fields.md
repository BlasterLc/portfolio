# Builder Center form: what goes in each field

## Title (max 255)
A portfolio you walk into: a room with a PlayStation 2

## Description (max 512)
My portfolio is a small bedroom with a CRT TV and a PlayStation 2: switch the TV on, pick a disc for each project, read a save for each skill. Hosted on AWS Amplify Hosting, with a moderated guestbook on API Gateway, Lambda and DynamoDB, and a plain version that phones start in.

## Body
Paste `docs/builder-center-project.md` with these changes:
1. Delete the HTML comment at the top and the line `# A portfolio you walk into...` (it is the title field).
2. Start at the line `**Matías Rodríguez** · ...`.
3. Replace each `[IMAGE n of 4 ...]` line with the image it names (see `README.md`), and the `▶ [VIDEO ...]` line with the video link, or delete it.
4. The cover image `00-cover.png` goes in the cover field, not in the body.
