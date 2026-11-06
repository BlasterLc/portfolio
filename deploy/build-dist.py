#!/usr/bin/env python3
"""Builds deploy/dist and deploy/dist.zip from the site in site/.

Only the files the page actually loads are copied, and every 3D model is checked
for a redistributable licence (CC0 / CC BY 4.0) before anything is packed, so a
model with a "Sketchfab Standard" licence can never end up on the public site.
"""
import json, os, re, shutil, struct, sys, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'site')
OUT = os.path.join(ROOT, 'deploy', 'dist')
ZIP = os.path.join(ROOT, 'deploy', 'dist.zip')
OK_LICENSES = ('CC-BY-4.0', 'CC0')

html = open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
prop_ids = re.findall(r"\{ id: '([a-z_0-9]+)', [hw]:", html)               # the PROPS list in the page
glbs = ['assets/playstation_2GRANDE2.glb', 'assets/playstation_2GRANDE2_512.glb', 'assets/crt_tvCC3.glb']
extra = ['assets/intro/intro.mp4', 'assets/intro/intro.webm']

def glb_license(path):
    d = open(path, 'rb').read()
    n = struct.unpack('<I', d[12:16])[0]
    ex = (json.loads(d[20:20 + n]).get('asset') or {}).get('extras') or {}
    return (ex.get('license') or '').split(' ')[0], ex.get('title'), ex.get('author')

problems = []
for g in glbs:
    lic, title, author = glb_license(os.path.join(SRC, g))
    print(f'  model {g}: {title} / {author} / {lic}')
    if lic not in OK_LICENSES:
        problems.append(f'{g}: licence "{lic}" is not redistributable')
credits = json.load(open(os.path.join(SRC, 'assets/props/credits.json')))
for pid in prop_ids:
    c = credits.get(pid)
    print(f'  prop  {pid}: {c and c["license"]}')
    if not c or not c['license'].startswith('CC0'):
        problems.append(f'prop {pid}: not listed as CC0 in assets/props/credits.json')
    if not os.path.isdir(os.path.join(SRC, 'assets/props', pid)):
        problems.append(f'prop {pid}: folder missing')
if problems:
    print('\nREFUSING TO BUILD:\n - ' + '\n - '.join(problems)); sys.exit(1)

shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(OUT)
shutil.copy(os.path.join(SRC, 'index.html'), os.path.join(OUT, 'index.html'))
for f in glbs + extra:
    os.makedirs(os.path.dirname(os.path.join(OUT, f)), exist_ok=True)
    shutil.copy(os.path.join(SRC, f), os.path.join(OUT, f))
for pid in prop_ids:
    shutil.copytree(os.path.join(SRC, 'assets/props', pid), os.path.join(OUT, 'assets/props', pid))
shutil.copy(os.path.join(SRC, 'assets/props/credits.json'), os.path.join(OUT, 'assets/props/credits.json'))
os.makedirs(os.path.join(OUT, 'assets/icons'))
for iid in re.findall(r"id: '([a-z]+)', name: '[^']+', abbr:", html):          # the 3D skill icons the SKILLS list uses
    shutil.copy(os.path.join(SRC, 'assets/icons', iid + '.png'), os.path.join(OUT, 'assets/icons', iid + '.png'))
os.makedirs(os.path.join(OUT, 'assets/fonts')); shutil.copy(os.path.join(SRC, 'assets/fonts/Dosis.ttf'), os.path.join(OUT, 'assets/fonts/Dosis.ttf'))          # Dosis (SIL OFL) for the buttons
shutil.copy(os.path.join(SRC, 'assets/props/certificate.jpg'), os.path.join(OUT, 'assets/props/certificate.jpg'))          # the framed Rally certificate on the wall
shutil.copy(os.path.join(SRC, 'assets/props/certificate-zts.jpg'), os.path.join(OUT, 'assets/props/certificate-zts.jpg'))          # the framed Zero to Shipped certificate on the wall

n = 0
with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for r, _, fs in os.walk(OUT):
        for f in sorted(fs):
            p = os.path.join(r, f); z.write(p, os.path.relpath(p, OUT)); n += 1
print(f'\nBuilt {n} files, {os.path.getsize(ZIP) / 1e6:.1f} MB -> deploy/dist.zip')
