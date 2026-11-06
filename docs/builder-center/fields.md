# Builder Center form: what goes in each field

## Title (max 255)
A portfolio you walk into: a room with a PlayStation 2

## Description (max 512)
Option A (nostalgic, 318 chars):
Some of us grew up with a CRT TV, a memory card and a stack of discs on the rug. I rebuilt that room and put my portfolio inside it: switch the TV on, hear the startup chord, pick a disc to open a project, read a save to see a skill. It runs on AWS, with a moderated guestbook where visitors leave a save of their own.

Option B (shorter, names the services, 297 chars):
Remember a CRT TV, a memory card and a stack of discs on the rug? I rebuilt that room and put my portfolio inside it. Switch the TV on, pick a disc to open a project, read a save to see a skill, and leave a save of your own in the guestbook. Built on AWS Amplify, API Gateway, Lambda and DynamoDB.

## Body
Paste `docs/builder-center-project.md` with these changes:
1. Delete the HTML comment at the top and the line `# A portfolio you walk into...` (it is the title field).
2. Start at the line `**Matías Rodríguez** · ...`.
3. Replace each `[IMAGE n of 4 ...]` line with the image it names (see `README.md`), and the `▶ [VIDEO ...]` line with the video link, or delete it.
4. The cover image `00-cover.png` goes in the cover field, not in the body.
