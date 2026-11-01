# Portafolio "El despacho" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y desplegar en AWS Amplify el portafolio de Matías (un despacho de detective interactivo con paneles, lupa de fichas, movimiento ambiental y versión móvil vertical) con un backend pequeño real (contacto por SES y contador de escaneos en DynamoDB) y entregarlo antes del 6 nov 2026, 23:59 PT.

**Architecture:** Sitio estático Vite + TypeScript sin framework de UI: una escena SVG (imagen + hotspots + capas de movimiento) y paneles/fichas en DOM plano, con el contenido en módulos de datos tipados. Un backend SAM (HTTP API + 2 Lambdas Node arm64 + DynamoDB + SES) que el sitio consume con degradación elegante: si falla, todo sigue funcionando.

**Tech Stack:** Node 18.19 (no subir de versión), Vite 5, TypeScript 5, Vitest 2 + jsdom, AWS SAM, AWS SDK for JavaScript v3, AWS Amplify Hosting.

**Spec:** `docs/superpowers/specs/2026-10-28-portafolio-scouter-design.md` (el nombre del archivo es heredado; el contenido es el diseño del despacho). Mock de referencia con coordenadas, textos, CSS y comportamiento ya probados: `spike/despacho-tarde-mock.html`. Reglas del hackathon: `docs/reglas-hackathon.md`.

## Global Constraints

- Entrega: **6 nov 2026, 23:59 PT**; el sitio debe estar vivo y estable hasta el **23 nov 2026**.
- Hosting obligatorio: **AWS Amplify Hosting**; la URL entregada es `*.amplifyapp.com`. Repositorio **público** en GitHub (`BlasterLc/build-your-tech`).
- Idioma del sitio y del texto de entrega: **inglés** (el mock está en inglés; pendiente 1 del spec, cámbialo solo si Matías lo decide).
- Tres secciones obligatorias presentes y legibles **sin** usar la lupa: About, Skills, Projects/Achievements. La lupa es la única feature creativa, con pista visible fija.
- Móvil = viewport de hasta **760 px**: usa `assets/despacho-vertical.webp` (1536×2736). Escritorio: `assets/despacho-tarde.webp` (2000×1116, viewBox `0 0 2000 1116`).
- `prefers-reduced-motion` detiene todas las animaciones. Foco visible, navegación por teclado, contraste AA en paneles.
- Backend en **AWS SAM**, Lambda **Node.js arm64**, DynamoDB on-demand, SES (sandbox: solo a direcciones verificadas), CORS solo para el dominio de Amplify, throttling **10 rps, ráfaga 20**, roles IAM de mínimo privilegio, alarma de presupuesto. Región: `us-east-1` (decisión de este plan).
- Ninguna clave ni secreto en el cliente. Una ficha cuenta como escaneo solo si estuvo abierta **≥ 700 ms** y **una vez por carga de página**. Honeypot y límites de longitud en el formulario.
- Declarar en README y texto de entrega que la ilustración está generada con IA. Original: sin copiar código ni assets de terceros.
- No mostrar código ni detalles de repos privados (JequeBot, Minuto Cero: solo nombre, descripción y premio). No mencionar IBM. No mostrar cara ni nombre de actores reales en las imágenes (solo en texto de la ficha). Práctica profesional en legal tech: línea genérica sin cliente.
- Sin dependencias en tiempo de ejecución salvo las del SDK en el backend; el sitio no usa librerías de UI.
- Cada tarea termina en un commit pequeño en `main` (el repo ya trabaja directo en `main` y Matías pide subir a `origin/main` al cerrar cada bloque).

## Review Focus

1. **Backend caído, lento o bloqueado por CORS:** el sitio, los paneles y la lupa funcionan igual; el contador se oculta y el formulario ofrece `mailto:` de respaldo (test en Task 9).
2. **Formulario abusivo o mal formado:** mensaje vacío o gigante, correo inválido, honeypot relleno, HTML/`<script>` en los campos → se rechaza con 400 y nada se envía; el HTML nunca se interpreta en el correo ni en el DOM (tests en Task 8).
3. **Escaneos falsos o repetidos:** objetivo fuera de la lista permitida, cuerpo inválido o ráfaga de peticiones → 400 sin escribir en DynamoDB; el incremento es atómico (tests en Task 8).
4. **Viewport límite:** 320 px de ancho, 760/761 px exactos, tablet horizontal y cambio de tamaño con la página abierta (hoy el mock recarga la página) → se elige el layout correcto sin recargar ni perder el panel abierto (tests en Task 3).
5. **Teclado y lectores de pantalla:** panel con foco atrapado y devuelto, `Esc` cierra, hotspots enfocables con `Enter`/`Espacio`, fichas anunciadas por `aria-live`, enlace directo a un hash desconocido ignorado, botón Atrás cierra el panel (tests en Tasks 4 y 6).

---

## File Structure

```
site/                         # frontend (Vite)
  index.html
  package.json, tsconfig.json, vite.config.ts
  public/assets/              # imágenes copiadas de spike/assets
  src/
    main.ts                   # arranque: elige layout, monta escena, paneles, lupa, efectos
    styles/main.css           # paleta, barra, paneles, fichas, móvil
    content/types.ts          # tipos compartidos
    content/data.ts           # skills, casos, proyectos, premios, fichas, textos
    content/stats.json        # generado por scripts/github-stats.ts
    scene/layouts.ts          # spots de escritorio y móvil + pickLayout
    scene/render.ts           # renderScene(): imagen + hotspots + etiquetas
    scene/effects.ts          # carretes, humo, luz, nube, bonsái, polvo
    ui/router.ts              # hash <-> panel
    ui/panel.ts               # abrir/cerrar, foco, aria
    ui/panels.ts              # contenido de About/Skills/Projects/Contact/Awards
    ui/skillsMap.ts           # mapa de conexiones (usa lib/connections.ts)
    lens/lens.ts              # estado de la lupa, teclas, toque, ficha
    lib/connections.ts        # puro: enlaces herramienta<->caso
    lib/api.ts                # cliente de contacto y escaneos con degradación
    lib/env.ts                # lectura de VITE_API_URL
  test/*.test.ts
  scripts/github-stats.ts
backend/                      # SAM
  template.yaml
  package.json, tsconfig.json
  src/contact/handler.ts, src/contact/validate.ts
  src/scan/handler.ts, src/scan/targets.ts
  test/*.test.ts
README.md                     # entrega
docs/entrega/builder-center.md
```

Responsabilidades: `data.ts` es la única fuente de contenido; `layouts.ts` es la única fuente de coordenadas; ninguna otra pieza hardcodea textos ni coordenadas.

---

### Task 1: Scaffold del sitio, assets y build verde

**Files:**
- Create: `site/package.json`, `site/tsconfig.json`, `site/vite.config.ts`, `site/index.html`, `site/src/main.ts`, `site/src/styles/main.css`, `site/test/smoke.test.ts`
- Create: `site/public/assets/` (copiar de `spike/assets/`: `despacho-tarde.webp`, `despacho-vertical.webp`)
- Modify: `.gitignore` (añadir `site/dist/`, `backend/.aws-sam/`)

**Interfaces:**
- Produces: scripts npm `dev`, `build`, `test`, `typecheck`; alias `@/` → `site/src`.

- [ ] **Step 1: Crear el proyecto** con `vite@5`, `typescript@5`, `vitest@2`, `jsdom` (devDependencies exactas, sin frameworks). `vite.config.ts` fija `test.environment = 'jsdom'` y `base: './'`.
- [ ] **Step 2: Escribir el test que falla** `smoke.test.ts`: `import { APP_NAME } from '@/main'` y `expect(APP_NAME).toBe('Matías Rodriguez')`.
- [ ] **Step 3: Verificar que falla:** `cd site && npx vitest run` → FAIL (`APP_NAME` no existe).
- [ ] **Step 4: Exportar `APP_NAME` desde `main.ts`** y hacer que `index.html` cargue `main.ts`, con `<title>Matías Rodriguez · Portfolio</title>`, `lang="en"` y meta viewport.
- [ ] **Step 5: Verificar:** `npx vitest run` PASS y `npm run build` genera `dist/` sin errores de TypeScript.
- [ ] **Step 6: Commit** `chore(site): scaffold Vite + TypeScript + Vitest`.

---

### Task 2: Contenido tipado y su integridad

**Files:**
- Create: `site/src/content/types.ts`, `site/src/content/data.ts`
- Test: `site/test/data.test.ts`

**Interfaces:**
- Produces (todo exportado desde `data.ts`):
  - `type SectionId = 'about' | 'skills' | 'projects' | 'contact' | 'plaque'`
  - `type CardId = SectionId | 'books' | 'poster'`
  - `interface Skill { name: string; group: 'Languages' | 'Backend' | 'Cloud & infra' | 'Testing & tooling' }`
  - `interface Case { name: string; blurb: string; uses: string[]; commits: number; repo: 'public' | 'private'; prize?: string; links?: { label: string; href: string }[] }`
  - `interface EvidenceCard { id: CardId; ex: string; name: string; lines: string[] }`
  - `const SKILLS: Skill[]`, `const CASES: Case[]` (Rumbo a Casa, FitTrack, JequeBot, Minuto Cero, en ese orden), `const CARDS: EvidenceCard[]`, `const ACHIEVEMENTS`, `const ABOUT`

- [ ] **Step 1: Escribir los tests que fallan** en `data.test.ts`:
  - `every skill used by a case exists in SKILLS`
  - `CASES total commits is 673` (205 + 244 + 154 + 70)
  - `Rumbo a Casa is first and marked winner`
  - `private cases have no repo link` (JequeBot y Minuto Cero sin `links` de repositorio)
  - `card ids are unique and A..G exhibits are unique`
  - `no case or card text mentions IBM`
- [ ] **Step 2: Verificar que fallan:** `npx vitest run data` → FAIL (módulo inexistente).
- [ ] **Step 3: Implementar `types.ts` y `data.ts`** copiando los textos y relaciones del mock (`PANELS`, `SKILLS`, `CASES`, `SCAN`); las relaciones herramienta–caso son **provisorias** (spec pendiente 3): marcarlas con un comentario `// CONFIRMAR con Matías`. Los enlaces reales (GitHub, LinkedIn, correo, repos, Winners) se dejan como constantes `TODO_URL` exportadas desde un único lugar.
- [ ] **Step 4: Verificar:** `npx vitest run data` PASS.
- [ ] **Step 5: Commit** `feat(content): typed portfolio content with integrity tests`.

---

### Task 3: Layouts de escena y selección móvil/escritorio

**Files:**
- Create: `site/src/scene/layouts.ts`
- Test: `site/test/layouts.test.ts`

**Interfaces:**
- Consumes: `SectionId`, `CardId` de `data.ts`.
- Produces:
  - `interface Spot { id: CardId | 'lens' | 'tape'; label: string; pts: string; c?: [number, number]; tag?: [number, number]; nav?: boolean; prop?: boolean }`
  - `interface Layout { name: 'desktop' | 'mobile'; viewBox: [number, number]; image: string; tagScale: number; spots: Spot[] }`
  - `const DESKTOP: Layout`, `const MOBILE: Layout`
  - `function pickLayout(width: number): Layout`

- [ ] **Step 1: Escribir los tests que fallan:**
  - `pickLayout(760)` → `mobile`; `pickLayout(761)` → `desktop`; `pickLayout(320)` → `mobile`; `pickLayout(1024)` → `desktop`
  - cada layout tiene los spots `skills, about, contact, projects, plaque, lens, tape, books, poster` y los cinco primeros con `nav` o etiqueta (`nav: true` solo en about, skills, projects, contact)
  - `books` y `poster` tienen `prop: true` y no tienen `tag` ni `c`
  - todos los puntos de `pts` caen dentro del `viewBox` del layout
  - móvil: `tagScale === 2.4`, viewBox `[1536, 2736]`; escritorio: `tagScale === 1`, viewBox `[2000, 1116]`
  - la etiqueta `plaque` se llama `Awards` y cabe en el ancho móvil (`label.length * 18 + 34) * tagScale / 2 + tag[0] <= 1536`)
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar `layouts.ts` y `pickLayout`** copiando verbatim las coordenadas de `SPOTS` (escritorio) y `SM` (móvil) de `spike/despacho-tarde-mock.html`, y la rutina `pickLayout` con umbral `<= 760`.
- [ ] **Step 4: Verificar:** PASS.
- [ ] **Step 5: Commit** `feat(scene): desktop and mobile layouts`.

---

### Task 4: Render de la escena y hotspots accesibles

**Files:**
- Create: `site/src/scene/render.ts`
- Modify: `site/src/main.ts`, `site/src/styles/main.css` (estilos `.hs`, `.dot`, `.ring`, `.tag`, `#bar`, `#hint` del mock)
- Test: `site/test/render.test.ts`

**Interfaces:**
- Consumes: `Layout`, `Spot`, `pickLayout`.
- Produces:
  - `interface SceneHandle { svg: SVGSVGElement; fx: SVGGElement; hotspots: Map<Spot['id'], SVGPolygonElement>; destroy(): void }`
  - `function renderScene(host: HTMLElement, layout: Layout, onActivate: (id: Spot['id'], ev: MouseEvent | KeyboardEvent) => void): SceneHandle`
  - `function watchLayout(host: HTMLElement, mount: (layout: Layout) => void): () => void` — vuelve a montar al cruzar 760 px **sin recargar la página**.

- [ ] **Step 1: Escribir los tests que fallan:**
  - `renders one polygon per spot` y los no-prop tienen `role="button"`, `tabindex="0"` y `aria-label` igual a su etiqueta; los props tienen `aria-hidden="true"` y sin `tabindex`
  - `Enter and Space on a focused hotspot call onActivate with its id`
  - `non-prop spots render a tag, a dot and a ring; props render none of them`
  - `watchLayout remounts when the window crosses 760px and keeps panel state` (simular `matchMedia` y comprobar que `mount` se llama una vez al cruzar y que no se llama `location.reload`)
  - `renderScene.destroy removes the svg` 
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar `renderScene`** extrayendo la función `renderSpot` del mock (tamaño del punto, anillo y etiqueta multiplicados por `tagScale`; la línea de la etiqueta sale por abajo si `tag.y > c.y`). `watchLayout` usa `matchMedia('(max-width: 760px)')` con `change`.
- [ ] **Step 4: Verificar:** PASS; abrir `npm run dev` y comprobar a ojo que las etiquetas coinciden con `localhost:8765` (mock).
- [ ] **Step 5: Commit** `feat(scene): render hotspots with keyboard support and live layout switching`.

---

### Task 5: Router de hash y panel accesible

**Files:**
- Create: `site/src/ui/router.ts`, `site/src/ui/panel.ts`
- Test: `site/test/router.test.ts`, `site/test/panel.test.ts`

**Interfaces:**
- Consumes: `SectionId`.
- Produces:
  - `function parseHash(hash: string): SectionId | null` (acepta `#about`, ignora cualquier otro valor)
  - `function createRouter(onChange: (id: SectionId | null) => void): { go(id: SectionId | null): void; dispose(): void }`
  - `function createPanel(root: HTMLElement, render: (id: SectionId) => HTMLElement): { open(id: SectionId): void; close(): void; isOpen(): boolean }`

- [ ] **Step 1: Escribir los tests que fallan:**
  - `parseHash('#skills')` → `'skills'`; `'#nope'`, `''`, `'#'` → `null`
  - `router.go('about')` pone `#about`; `go(null)` limpia el hash; el evento `popstate`/`hashchange` llama `onChange` (el botón Atrás cierra el panel)
  - `panel.open` pone `role="dialog"`, `aria-modal="true"`, mueve el foco al botón de cerrar y marca `body.panel-open`
  - `Escape` y clic en el velo cierran; al cerrar el foco vuelve al elemento que lo tenía antes
  - `Tab` en el último elemento enfocable vuelve al primero (foco atrapado)
  - abrir un id dos veces seguidas no duplica el contenido
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar router y panel.** El panel usa un velo (`#veil`) y una hoja (`#panel`) con los estilos del mock; la animación `pop` se omite con `prefers-reduced-motion`.
- [ ] **Step 4: Verificar:** PASS.
- [ ] **Step 5: Commit** `feat(ui): hash router and accessible panel`.

---

### Task 6: Paneles de contenido y mapa de conexiones

**Files:**
- Create: `site/src/lib/connections.ts`, `site/src/ui/skillsMap.ts`, `site/src/ui/panels.ts`
- Test: `site/test/connections.test.ts`, `site/test/panels.test.ts`

**Interfaces:**
- Consumes: `SKILLS`, `CASES`, `ACHIEVEMENTS`, `ABOUT` de `data.ts`; `createPanel`.
- Produces:
  - `interface Link { skill: string; caseName: string }`
  - `function buildLinks(skills: Skill[], cases: Case[]): Link[]` (ignora, sin lanzar, usos de skills inexistentes)
  - `type Selection = { skill: string } | { caseName: string } | null`
  - `function related(links: Link[], sel: Selection): { skills: Set<string>; cases: Set<string> }`
  - `function renderPanel(id: SectionId): HTMLElement`
  - `function mountSkillsMap(host: HTMLElement): void` — hilos SVG recalculados con `ResizeObserver`

- [ ] **Step 1: Escribir los tests que fallan:**
  - `buildLinks` produce un enlace por par herramienta–caso existente y no falla con un uso desconocido
  - `related({skill:'TypeScript'})` devuelve los casos que la usan y solo esos; `related(null)` devuelve conjuntos vacíos
  - `renderPanel('about')` contiene el nombre, la frase de la legaltech y el bloque "Outside the code"
  - `renderPanel('projects')` muestra 4 tarjetas, Rumbo a Casa primero con "Winner", y **ningún enlace de repositorio** en JequeBot ni Minuto Cero
  - `renderPanel('plaque')` muestra "Achievements" con las dos entradas (AWS Zero to Shipped y Rally de Innovación) y la nota del certificado
  - `renderPanel('contact')` contiene los campos nombre, correo, mensaje, un campo honeypot oculto (`aria-hidden`, `tabindex="-1"`) y los tres enlaces directos
  - en el mapa de Skills, enfocar o tocar una herramienta marca como resaltados sus hilos (`.str.on`) y sus casos (`.rel`), y salir del mapa limpia la selección
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar** `connections.ts` (funciones puras), `skillsMap.ts` (la lógica de `initMap` del mock, con los hilos calculados desde `getBoundingClientRect` y redibujados en `ResizeObserver`) y `panels.ts` (los cinco paneles, escapando todo texto con `textContent`, nunca `innerHTML` con datos).
- [ ] **Step 4: Verificar:** PASS.
- [ ] **Step 5: Commit** `feat(ui): content panels and skills connection map`.

---

### Task 7: Lupa: estado, teclas, toque y fichas

**Files:**
- Create: `site/src/lens/lens.ts`
- Modify: `site/src/main.ts` (conectar escena, lupa y paneles)
- Test: `site/test/lens.test.ts`

**Interfaces:**
- Consumes: `CARDS`, `SceneHandle`, `createPanel`.
- Produces:
  - `interface LensState { on: boolean; shown: CardId | null }`
  - `function createLens(deps: { scene: () => SceneHandle; openPanel: (id: SectionId) => void; announce: (text: string) => void; isTouch: () => boolean }): { toggle(): void; isOn(): boolean; activate(id: Spot['id'], ev: MouseEvent | KeyboardEvent): void; hover(id: Spot['id'] | null, pos: { x: number; y: number }): void }`
  - `function hintText(on: boolean, touch: boolean): string`

- [ ] **Step 1: Escribir los tests que fallan:**
  - la tecla `S` alterna la lupa (ignorada con foco en `input` o `textarea`); `Esc` la apaga si no hay panel abierto
  - escritorio, lupa encendida: `hover('projects')` muestra la ficha Exhibit A y `hover(null)` la oculta; `activate('projects')` abre el panel
  - toque, lupa encendida: el **primer** toque en un objeto con panel muestra su ficha y el **segundo** abre el panel; los props (`books`, `poster`) siempre solo muestran la ficha
  - con la lupa apagada, `hover` no muestra nada y los props no responden
  - cada ficha mostrada llama a `announce` con "name: line1. line2." (región `aria-live`)
  - `hintText` devuelve el texto de escritorio o móvil, encendida o apagada, tal como en el mock
  - la ficha de un id sin tarjeta (`lens`, `tape`) nunca se muestra
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar `createLens`** con la lógica del mock: lente que sigue el cursor (solo escritorio), ficha de papel (`#read`), hoja inferior con botón de cerrar en móvil, botón 🔍 en la barra solo en móvil, `body.lens-on`. El pulso del hotspot de la lupa se mantiene.
- [ ] **Step 4: Verificar:** PASS; revisar a ojo con `npm run dev` en escritorio y en modo dispositivo de 390×844.
- [ ] **Step 5: Commit** `feat(lens): evidence-card magnifier with touch two-tap flow`.

---

### Task 8: Backend SAM: contacto y escaneos

**Files:**
- Create: `backend/template.yaml`, `backend/package.json`, `backend/tsconfig.json`
- Create: `backend/src/contact/validate.ts`, `backend/src/contact/handler.ts`, `backend/src/scan/targets.ts`, `backend/src/scan/handler.ts`
- Test: `backend/test/contact.test.ts`, `backend/test/scan.test.ts`

**Interfaces:**
- Produces:
  - `function validateContact(body: unknown): { ok: true; value: { name: string; email: string; message: string } } | { ok: false; error: string }` — límites: nombre 1–80, correo válido ≤ 254, mensaje 1–2000; honeypot `company` debe estar vacío
  - `const TARGETS: readonly CardId[]` = `['projects','skills','plaque','about','contact','books','poster']`
  - Lambda `contact`: `POST /contact` → 200 `{ ok: true }` | 400 `{ error }`; envía con SES `Reply-To` del visitante; el cuerpo del correo es **texto plano**
  - Lambda `scan`: `POST /scan` body `{ target }` → 200 `{ count: number }` incrementa `target` y `_total` con `UpdateItem ADD`; `GET /scans` → 200 `{ counts: Record<string, number> }`
  - Salidas del stack: `ApiUrl`
- Consumes (de Task 2 por contrato, no por import): los ids de `CardId`.

- [ ] **Step 1: Escribir los tests que fallan** (Vitest, SES y DynamoDB simulados con `aws-sdk-client-mock`):
  - contacto válido → 200 y `SendEmail` llamado una vez con `ReplyToAddresses: [email]`
  - honeypot relleno → 400 y **ningún** `SendEmail`
  - correo inválido, nombre vacío, mensaje vacío, mensaje de 2001 caracteres → 400
  - un mensaje con `<script>alert(1)</script>` se envía como texto literal (sin HTML en el cuerpo)
  - JSON inválido o cuerpo ausente → 400
  - `scan` con `target: 'projects'` → 200 y `UpdateItem` con `ADD`; con `target: 'hack'` → 400 y ningún `UpdateItem`
  - `GET /scans` devuelve los conteos conocidos y `0` para los ausentes
  - si SES o DynamoDB lanzan, el handler responde 500 `{ error: 'unavailable' }` sin filtrar detalles
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar** validadores y handlers (AWS SDK v3, `@aws-sdk/client-ses`, `@aws-sdk/lib-dynamodb`), y `template.yaml` con: HTTP API (CORS con el dominio de Amplify como parámetro `AllowedOrigin`, throttling 10/20), dos funciones `nodejs20.x` + `arm64`, tabla DynamoDB on-demand (clave `target`), permisos mínimos (`ses:SendEmail` sobre la identidad verificada, `dynamodb:UpdateItem|GetItem|Scan` sobre la tabla), `AWS::Budgets::Budget` con alarma a `ContactEmail`. Parámetros: `AllowedOrigin`, `ContactEmail`.
- [ ] **Step 4: Verificar:** `cd backend && npx vitest run` PASS y `sam validate --lint` sin errores (instalar SAM CLI con `pipx install aws-sam-cli` si falta).
- [ ] **Step 5: Commit** `feat(backend): SAM stack with contact and scan Lambdas`.

---

### Task 9: Cliente de API, formulario y contador con degradación

**Files:**
- Create: `site/src/lib/env.ts`, `site/src/lib/api.ts`
- Modify: `site/src/ui/panels.ts` (envío del formulario), `site/src/lens/lens.ts` (contador y registro de escaneo)
- Test: `site/test/api.test.ts`, `site/test/degrade.test.ts`

**Interfaces:**
- Consumes: `VITE_API_URL` (puede faltar).
- Produces:
  - `function sendContact(input: { name: string; email: string; message: string; company?: string }): Promise<{ ok: true } | { ok: false; reason: 'invalid' | 'unavailable' }>`
  - `function recordScan(target: CardId): Promise<number | null>` — `null` si falla; nunca lanza
  - `function fetchCounts(): Promise<Record<string, number> | null>`
  - `function shouldCountScan(shownMs: number, alreadyCounted: Set<CardId>, target: CardId): boolean` — verdadero solo si `shownMs >= 700` y no se contó en esta carga

- [ ] **Step 1: Escribir los tests que fallan:**
  - `shouldCountScan(699, new Set(), 'books')` → false; `(700, new Set(), 'books')` → true; `(900, new Set(['books']), 'books')` → false
  - con `fetch` rechazando (red caída), `sendContact` → `{ ok:false, reason:'unavailable' }` y `recordScan` → `null` sin lanzar
  - con respuesta 400, `sendContact` → `reason: 'invalid'`
  - sin `VITE_API_URL`, ninguna función hace una petición
  - **degradación (UI):** con el backend caído el formulario muestra el enlace `mailto:` y un mensaje, la ficha aparece sin contador, y los paneles y la lupa siguen funcionando
  - el campo honeypot se envía como `company` y vacío en uso normal
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar el cliente** con `fetch` + `AbortController` (timeout 5 s) y conectar: el formulario deshabilita el botón mientras envía; la ficha pide `recordScan` solo cuando `shouldCountScan` lo permite y muestra "seen N times" solo si hay número.
- [ ] **Step 4: Verificar:** PASS.
- [ ] **Step 5: Commit** `feat(site): API client with graceful degradation`.

---

### Task 10: Movimiento ambiental

**Files:**
- Create: `site/src/scene/effects.ts`
- Modify: `site/src/main.ts`, `site/src/styles/main.css` (keyframes `wisp`, `sway`, `cloud`, `breathe`, `spin`, `lampflick`, `drift`)
- Test: `site/test/effects.test.ts`

**Interfaces:**
- Consumes: `SceneHandle.fx`, `Layout`, `matchMedia('(prefers-reduced-motion: reduce)')`.
- Produces: `function mountEffects(scene: SceneHandle, layout: Layout, opts: { reducedMotion: boolean; tapeOn: () => boolean }): () => void`

- [ ] **Step 1: Escribir los tests que fallan:**
  - con `reducedMotion: true`, `fx` no contiene ningún elemento animado (`.reel`, `.thread`, `.sway`, `.mote`, `#cloud`)
  - escritorio: contiene dos carretes, tres hilos de humo, la nube, la luz que respira, el bonsái que se mece y 30 motas de polvo
  - móvil: contiene dos carretes, dos hilos de humo, el bonsái, la luz y 14 motas, y **no** la nube de escritorio
  - cada carrete tiene un recorte elíptico de su cara (no del borde): para escritorio `[[328,664,24.5,52],[378,654,22,50]]`, para móvil `[[125,1414,27,64],[186,1378,24,60]]`
  - con `tapeOn() === true` los carretes usan la clase de giro rápido
  - la función de limpieza elimina todo lo que montó
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar `mountEffects`** trasladando del mock las capas (`reel`, humo, polvo, `#lampglow`, `#sunbreath`, `#cloud`, bonsái). Las capas van bajo los hotspots con `pointer-events: none`. En móvil se omiten la nube y el humo de escritorio.
- [ ] **Step 4: Verificar:** PASS; revisión visual en 1600×900 y 390×844 con el Chrome headless usado en el spike (`#tape` en la URL activa la cinta).
- [ ] **Step 5: Commit** `feat(scene): ambient motion layers with reduced-motion support`.

---

### Task 11: Estadísticas de GitHub y fichas con datos reales

**Files:**
- Create: `site/scripts/github-stats.ts`, `site/src/content/stats.json`
- Modify: `site/src/content/data.ts` (las fichas de Projects, Skills y About leen `stats.json`)
- Test: `site/test/stats.test.ts`

**Interfaces:**
- Produces:
  - `function summarize(byMonth: Record<string, number>): { total12: number; busiest: { from: string; to: string; minPerMonth: number }; first: { month: string; count: number }; peak: { month: string; count: number } }`
  - `site/src/content/stats.json` con la forma `{ generatedAt: string; byMonth: Record<string, number>; totalCommitsByCase: Record<string, number> }`

- [ ] **Step 1: Escribir el test que falla:** con los datos del spec (`2026-03: 17, 04: 9, 05: 106, 06: 382, 07: 408, 08: 404, 09: 308, 10: 151`), `summarize` da `total12 === 1785`, `peak` = julio (408), `first` = marzo (17) y los meses de junio a septiembre con 300+ al mes.
- [ ] **Step 2: Verificar que falla.**
- [ ] **Step 3: Implementar `summarize` y el script** que consulta la API de GraphQL de GitHub con `GITHUB_TOKEN` del entorno (nunca guardado en el repo) y escribe `stats.json`; si no hay token, el script termina sin tocar el archivo. `data.ts` construye las líneas de las fichas A, B y D a partir de `stats.json`.
- [ ] **Step 4: Verificar:** PASS y que las fichas A (673 commits) y B (1.785 contribuciones) siguen mostrando los mismos valores que el mock.
- [ ] **Step 5: Commit** `feat(content): real GitHub stats feed the evidence cards`.

---

### Task 12: Accesibilidad, rendimiento y móvil real

**Files:**
- Modify: `site/index.html`, `site/src/styles/main.css`, `site/src/main.ts`
- Create: `site/test/a11y.test.ts`, `docs/entrega/verificacion.md` (lista de comprobación manual)

**Interfaces:**
- Consumes: todo lo anterior.

- [ ] **Step 1: Escribir los tests que fallan:**
  - existe una región `aria-live="polite"` única para las fichas
  - la barra de navegación tiene `nav` con `aria-label="Sections"` y los botones tienen texto accesible (incluido el 🔍 con `aria-label`)
  - las imágenes de la escena tienen texto alternativo en el `svg` (`role="img"` + `aria-label`)
  - `prefers-reduced-motion` desactiva `pop`, giro, humo y luz (comprobar que el CSS contiene la regla de reducción)
  - la pista inferior es visible con la lupa apagada y encendida (texto distinto)
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar los ajustes:** precarga de la imagen del layout activo, `loading="eager"` solo para esa; tamaño de las imágenes ≤ 350 KB cada una (ya cumplen); foco visible en hotspots; `meta theme-color`. Resolver los pendientes visuales del spec: alineación de hotspots, franja inferior, etiquetas Contact/Projects en móvil.
- [ ] **Step 4: Verificar:** tests PASS; **Lighthouse móvil** (Chrome) con rendimiento ≥ 80, accesibilidad ≥ 95; probar en un **teléfono real** y en 320 px, 390 px, 768 px y horizontal; registrar los resultados en `docs/entrega/verificacion.md`.
- [ ] **Step 5: Commit** `chore(site): accessibility and performance pass`.

---

### Task 13: Despliegue en AWS (Amplify + SAM)

**Files:**
- Create: `amplify.yml` (raíz del repo, `applications: - appRoot: site`, build `npm ci && npm run build`, artefactos `dist`)
- Modify: `README.md` (cómo desplegar), `backend/README.md`

**Interfaces:**
- Consumes: salida `ApiUrl` del stack SAM; Task 8 y Task 9.

- [ ] **Step 1: Confirmar prerequisitos con Matías:** cuenta AWS activa con Amplify disponible, estado de estudiante verificado en Builder Center, y correo verificado en SES para `ContactEmail` (spec pendiente 9). **Si no están listos, parar y resolverlo antes de seguir**.
- [ ] **Step 2: Desplegar el backend:** `cd backend && sam build && sam deploy --guided` en `us-east-1` con `AllowedOrigin` provisional `*`; anotar `ApiUrl`. Probar con `curl` un `POST /contact` válido (llega el correo) y un `POST /scan` con `target: projects` (devuelve `count`).
- [ ] **Step 3: Conectar el repositorio** a **AWS Amplify Hosting** (rama `main`), definir la variable de entorno `VITE_API_URL=<ApiUrl>` y desplegar. Anotar la URL `*.amplifyapp.com`.
- [ ] **Step 4: Cerrar CORS:** actualizar el stack con `AllowedOrigin=<URL de Amplify>` y repetir las pruebas; comprobar que desde otro origen la petición es rechazada.
- [ ] **Step 5: Verificar el sitio vivo:** carga desde cero, paneles, lupa, formulario (llega el correo), contador, y en móvil real. Comprobar la alarma de presupuesto en la consola.
- [ ] **Step 6: Commit** `chore: Amplify build spec and deployment docs`.

---

### Task 14: Entrega: README, texto de Builder Center y envío

**Files:**
- Modify: `README.md`
- Create: `docs/entrega/builder-center.md`, `docs/entrega/capturas/` (sitio escritorio y móvil; consola: Amplify, API Gateway, Lambda, DynamoDB, SES)

**Interfaces:**
- Consumes: URL viva, resultados de Task 12, capturas reales de la consola.

- [ ] **Step 1: Escribir el README** con: concepto, capturas, arquitectura (diagrama), tabla de servicios AWS, cómo correr y desplegar, **declaración de uso de IA para la ilustración**, licencia y créditos.
- [ ] **Step 2: Escribir `builder-center.md`** con secciones que calzan con la rúbrica: la feature creativa (la lupa y su regla de pruebas + objetos personales), capturas del sitio (escritorio y móvil), capturas de la consola AWS, tabla de servicios, aprendizajes y desafíos concretos (reels, móvil, degradación). Sin marcadores sin reemplazar.
- [ ] **Step 3: Verificación final** (en este orden): `grep -R "TODO_URL\|CONFIRMAR\|sample data" site/src docs/entrega` no devuelve nada; todos los enlaces del sitio abren; el repo es público; la URL de Amplify carga en una ventana privada.
- [ ] **Step 4: Enviar** el proyecto en Builder Center con la URL de Amplify y el enlace al repo, **antes del 6 nov 2026, 23:59 PT** (colchón: enviar el 5 nov).
- [ ] **Step 5: Commit** `docs: submission README and Builder Center text`.

---

## Calendario (hoy es 29 oct; quedan 8 días)

| Día | Tareas |
|---|---|
| 29–30 oct | Task 1, 2, 3, 4 (escena viva en Vite) |
| 31 oct | Task 5, 6 (paneles y mapa) |
| 1 nov | Task 7 (lupa), Task 8 (backend) en paralelo si hay cuenta AWS lista |
| 2 nov | Task 9, 10 |
| 3 nov | Task 11, 12 |
| 4 nov | Task 13 (despliegue) |
| 5 nov | Task 14 y envío (colchón hasta el 6) |

**Riesgos y orden de recorte:** si falta tiempo, recortar primero el contador de escaneos (Task 9, la parte `recordScan`), luego el movimiento móvil (Task 10, solo luz, polvo y carretes) y luego el humo. El despliegue (Task 13) se adelanta si la cuenta AWS no está lista, porque bloquea la entrega. **El contenido real de Matías** (cargo exacto, capturas de proyectos, enlaces, relaciones herramienta–caso, títulos de libros y películas) debe llegar antes de la Task 12; hasta entonces `data.ts` lleva `TODO_URL` y `CONFIRMAR`.
