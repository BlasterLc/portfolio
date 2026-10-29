# Portafolio de Matías: el despacho. Documento de diseño

Fecha: 28 oct 2026 · Estado: borrador para aprobación · Entrega: **6 nov 2026, 23:59 PT**
Nota: este documento reemplaza la versión anterior (Scouter sobre una ilustración de Santiago cyberpunk). Esa dirección y el modelo "landing + despacho como feature" se descartaron; ver sección 12. El mock vigente es `spike/despacho-tarde-mock.html` (servir `spike/` con `python3 -m http.server 8765`).

## 1. Intención y por qué

Matías participa (individual) en el **AWS Student Builder Challenge: Build Your Tech Superpower**. Debe entregar un portafolio público alojado en AWS Amplify Hosting, con tres secciones obligatorias (About Me, Skills, Projects/Achievements), **una** feature creativa interactiva con pista visible, un repositorio público en GitHub y un proyecto escrito en Builder Center (descripción de la feature, capturas del sitio y de AWS, servicios usados, aprendizajes y desafíos). Resumen de reglas en `docs/reglas-hackathon.md`.

| Criterio | Peso | Cómo lo atendemos |
|---|---|---|
| Creatividad y memorabilidad | 30% | El despacho como identidad visual y la lupa, que revela cosas que no están en ningún panel |
| Implementación AWS funcionando | 25% | Amplify + backend pequeño real (API Gateway, Lambda, DynamoDB, SES) con IaC y documentación |
| Calidad de comunicación | 25% | README y texto de entrega con secciones que calzan 1:1 con la rúbrica, capturas reales de la consola |
| Completitud y usabilidad | 20% | Menú fijo, objetos con etiqueta visible, paneles legibles, responsivo (escritorio y móvil) |

**Decisión de fondo.** El sitio abre directo en el despacho, que es el portafolio completo: no hay landing aparte ni dos vistas del mismo contenido. Para que no se sienta como un videojuego, el despacho funciona como un **menú ilustrado**: barra fija, etiquetas visibles y paneles de lectura convencionales. La creatividad está en la ilustración y en una sola feature, la lupa.

## 2. Objetivos, no-objetivos y anti-objetivos

**Objetivos**
- Portafolio claro, bonito y rápido, con identidad propia (despacho de detective al atardecer, luz de persianas).
- Lupa funcional, descubrible y que no estorbe la navegación.
- Que el sitio se sienta vivo (movimiento visible pero no invasivo).
- Backend AWS pequeño pero real, definido como código, con costos controlados.
- Entrega completa y verificada antes del plazo, con el sitio estable durante todo el periodo de evaluación (hasta el 23 nov 2026).

**No-objetivos**
- Juego: sin narrador, sin progreso de objetos, sin minijuego ni interrogatorio.
- Chat con IA, presencia multiusuario en tiempo real y datos de GitHub en vivo.
- CMS, blog, autenticación, internacionalización compleja.

**Anti-objetivos (fracaso aunque "funcione")**
- Que se vea como un decorado con contenido escondido; que haya que "jugar" para encontrar un proyecto. Sin la lupa, todo lo profesional debe estar visible y leerse.
- Oscuridad excesiva o texto poco legible; la ilustración nunca compite con el contenido.
- Que la lupa bloquee la navegación.
- Copiar código o assets de terceros (el portafolio debe ser original y no publicado antes).
- Mencionar IBM como meta, mostrar código o detalles de repos privados, o exponer trabajo de la práctica profesional sin permiso.

## 3. Restricciones

- Plazo: 6 nov 2026, 23:59 PT. Hoy quedan ~9 días.
- Hosting obligatorio: **AWS Amplify Hosting** (usa S3 y CloudFront por debajo). La URL entregada es la de Amplify (`*.amplifyapp.com`). Un dominio propio es opcional y debe seguir apuntando a Amplify.
- Cuenta de AWS de estudiante, nivel gratuito. SES inicia en *sandbox* (solo envía a direcciones verificadas).
- Higgsfield sin créditos (plan gratuito). El arte nuevo, si hace falta, se genera en Gemini u otra herramienta que Matías ejecuta con prompts que escribe Claude. El movimiento se hace con capas SVG/CSS, no con video de IA.
- La ilustración está generada con IA: declararlo en el README y en el texto de entrega.
- Un solo envío por persona; el sitio debe cargar durante la ventana de evaluación.

## 4. Concepto: el despacho

**Quién es quién.** El despacho es **de Matías** y él es el detective. El visitante es un invitado en su oficina: lee sus informes y, con la lupa, mira de cerca lo que dejó sobre la mesa. No es un caso sobre Matías ni hay misión para el visitante. Esto explica los objetos:
- Máquina de escribir → **About**: el detective escribe su propio informe.
- Teléfono → **Contact**: se llama al detective.
- Tablero de corcho con hilos → **Skills**: es donde conecta sus herramientas con sus casos.
- Archivero → **Projects**: los casos archivados.
- Placa en la pared → **Awards**: sus reconocimientos (panel "Achievements").

**Ilustración.** `spike/assets/despacho-tarde.webp` (2000×1116): segunda versión (29 oct), editada en Higgsfield con `flux_3_image` a partir de la primera (cinematic_studio_2_5, conservada en el historial de git y como `despacho-tarde-original.webp` sin retoques). Luz de tarde con persianas; añade los libros junto al teléfono y el afiche de cine entre el tablero y la ventana, iguales a la versión vertical. Todo lo demás conserva su posición, por lo que los hotspots casi no cambiaron. No se rehace el arte; si se regenera, que sea para añadir espacio o props concretos.

**Escena.** SVG con la imagen y una capa de hotspots poligonales en coordenadas de la imagen. La escena se ajusta con `preserveAspectRatio="xMidYMid slice"`.

## 5. Navegación

- **Barra superior fija (opción A):** marca "Matías Rodriguez" y menú **About, Skills, Projects, Contact**. Funciona sin tocar la escena.
- **Objetos con etiqueta visible** (punto pulsante y etiqueta de papel): Skills, About, Contact, Projects y Awards (placa), más el carrete de cinta ("Play") y la lupa ("Magnifier").
- **Paneles:** hoja clara sobre la escena atenuada, texto legible, sin rotaciones ni máquina de escribir, con enlaces directos. Se cierran con la X, con `Esc` o haciendo clic fuera. Foco visible y navegación por teclado en los hotspots.
- **Pista inferior fija:** "Pick up the magnifier on the desk to inspect the objects · or use the menu above · press play on the tape". Cambia mientras la lupa está activa.
- Sin Journey ni trayectoria como sección: los reconocimientos viven en la placa (Achievements) y en las tarjetas de Projects.

## 6. Paneles (contenido)

**About.** Quién es (estudiante de 4º año, USS, egreso 2027; desarrollador en una legaltech, cargo exacto por confirmar), cómo trabaja (sistemas de punta a punta, una tecnología por proyecto real), enlaces a GitHub, LinkedIn y Contact. Incluye un bloque breve "Outside the code" con los gustos que no se pueden representar con un objeto de época: servidores propios (self-hosting) y servidor de Minecraft para amigos, Age of Empires II, mods de Dragon Ball Sparking! Zero y entrenamiento cinco días a la semana. Los libros y el cine tienen su propio objeto en la oficina (sección 8).

**Skills: mapa de conexiones.** Dos columnas: herramientas a la izquierda (agrupadas por área: lenguajes, backend, cloud e infra, testing y tooling) y los casos a la derecha. Hilos rojos unen cada herramienta con los casos donde se usó. Al pasar el cursor, enfocar o tocar una herramienta se resaltan sus hilos y casos; con un caso, sus herramientas. Sin niveles ni porcentajes. Los datos viven en un solo objeto (`CASES` en el mock). **Las relaciones herramienta–caso del mock son provisorias y hay que confirmarlas.** En móvil se mantienen las dos columnas y se oculta la descripción corta de cada caso.

**Projects.** Tarjetas con captura, línea descriptiva, stack y enlaces; el detalle se abre en la misma hoja. Solo los repos públicos llevan enlace.

| Proyecto | Stack | Commits | Público | Resumen |
|---|---|---|---|---|
| Rumbo a Casa (primero, "Winner") | TypeScript, AWS Lambda, CloudFront, DynamoDB, Polly | 205 | sí | AWS Zero to Shipped, ganador entre 5 |
| FitTrack | React Native, FastAPI, Supabase | 244 | sí | Seguimiento de gimnasio y nutrición, estimación de calorías por IA |
| JequeBot | Python, Discord | 154 | no | Bot de música para Discord |
| Minuto Cero | TypeScript, FastAPI (en migración) | 70 | no | ERP para minimarkets chilenos; 1º lugar Impacto Social, Rally de Innovación 2026 (USS), con el equipo Helix |

Total: 673 commits (dato de la ficha de la lupa). Los repos privados (JequeBot, Minuto Cero) muestran solo nombre, descripción y premio. Otros repos (DealJudge, Alexa-PC, Asistente) quedan fuera por decisión de curaduría.

**Contact.** Formulario corto (nombre, correo, mensaje) que usa API Gateway + Lambda + SES, más enlaces a GitHub, LinkedIn y correo, con `mailto:` de respaldo.

**Awards (placa): panel "Achievements".** Contenido propio, sin repetir las tarjetas de Projects: AWS Zero to Shipped (ganador, 1 de 5, con Rumbo a Casa, con enlace a la pestaña Winners y al proyecto) y Rally de Innovación 2026, USS (1º lugar Impacto Social con el equipo Helix, por Minuto Cero). Cuando llegue el certificado de AWS se añade aquí. Responde a la sección "Projects/Achievements" que piden las reglas.

La práctica profesional en legal tech se menciona como una línea genérica, sin nombre de cliente ni detalles de código.

## 7. Movimiento ambiental

Principio: **bastante visible, no invasivo.** Todo son capas SVG/CSS sobre la imagen fija, bajo los hotspots (`pointer-events: none`).

- **Carretes de la cinta:** se recorta solo la cara de cada carrete (sin el borde con grosor, que debe quedar quieto), se lleva a círculo, gira y se vuelve a aplastar con la perspectiva original, con el centro de giro en el eje. Giran lento siempre y rápido al pulsar Play. Una primera versión que giraba también el borde se veía superpuesta y se corrigió.
- **Humo:** tres hilos finos con desenfoque ligero que ondulan y se desvanecen desde el cigarrillo.
- **Luz:** la franja de sol de la ventana "respira" (7 s), una sombra de nube suave cruza el cuarto (~26 s) y el brillo de la lámpara parpadea.
- **Polvo** flotando en los rayos de sol.
- **Bonsái:** el follaje se recorta y se mece ±1,6° desde la maceta.
- **Probado y descartado:** autos que pasan tras el vidrio esmerilado (se veían como manchas).
- **Accesibilidad y rendimiento:** `prefers-reduced-motion` detiene todo. En móvil se omiten la sombra de nube y el humo de escritorio (el móvil usa su propio humo más fino) y se reduce el polvo.

## 8. La feature creativa: la lupa

**Qué es.** Un modo opcional en el que el visitante "recoge" la lupa de la mesa y puede mirar de cerca los objetos del despacho. Al apuntar a un objeto aparece una **ficha de papel** con tinta ámbar ("Exhibit A…G ") con 1-3 líneas de datos. Tono sobrio, sin humor.

**Pista visible.** La lupa de la mesa lleva etiqueta "Magnifier" y la franja inferior fija dice "Pick up the magnifier on the desk to inspect the objects". No hay botón aparte en la barra. Se activa con clic en la lupa o con la tecla `S`; se sale con `Esc`. Con la lupa activa, el cursor se convierte en una lente y navegar (clics, menú, scroll) sigue funcionando. Funciona sin la lupa: nada profesional depende de ella.

**La regla que evita solapamientos con los paneles.** Las fichas nunca repiten el contenido de un panel:

1. **Objetos con panel: pruebas.** Un dato verificable que el panel no trae.
   - Archivero (Exhibit A): 4 casos, 673 commits, 2 repos públicos y 2 privados.
   - Tablero (B): 1.785 contribuciones en 12 meses, constantes desde mayo, 300+ al mes entre junio y septiembre.
   - Placa (C): AWS Zero to Shipped, 1 de 5, 205 commits en Rumbo a Casa.
   - Máquina de escribir (D): contribuciones por mes, 17 en marzo y 408 en julio.
   - Teléfono (E): el formulario usa API Gateway + Lambda + SES.
2. **Props sin panel: lo personal, solo si el objeto lo explica por sí mismo.** Regla: cada prop debe ser un objeto de la época que se entienda sin leer la ficha. Por eso solo hay dos y **requieren arte nuevo** (no están en la imagen actual):
   - **Pila de libros sobre el escritorio:** lecturas de Camus y Dostoevsky (títulos concretos a definir por Matías).
   - **Afiche enmarcado o rollo de película en la pared:** cine de mafia (películas y actores a definir por Matías, p. ej. el estilo de Al Pacino). El afiche usa un diseño genérico de los años 70 o una silueta; **no se muestra la cara ni el nombre de ningún actor real en la imagen**, solo en el texto de la ficha.
   - Los demás objetos (bonsái, cámara, carpeta, cenicero, calendario) son decoración: sin ficha y sin hotspot. Mods, juegos, servidores propios y entrenamiento no tienen un objeto de época que los represente, así que viven en el bloque "Outside the code" de About.

**Datos.** Texto fijo escrito por Matías y números tomados de GitHub al 27 oct 2026 (contribuciones por mes: mar 17, abr 9, may 106, jun 382, jul 408, ago 404, sep 308, oct 151 parcial; ~1.785 en 12 meses), generados por un script antes del build. Sin llamadas en vivo. En el mock llevan la marca "sample data" que debe desaparecer.

**Contador de escaneos (opcional).** Cada ficha puede mostrar "visto N veces por visitantes", guardado en DynamoDB (ver sección 9). Si el backend falla, el contador se oculta y la lupa funciona igual. Es el primer recorte si falta tiempo.

**Móvil: ilustración vertical.** En pantallas de hasta 760 px el sitio usa `spike/assets/despacho-vertical.webp` (9:16, 1536×2736), generada en Higgsfield con `flux_3_image` y la ilustración horizontal como referencia. Ya incluye los props nuevos (libros y afiche de cine genérico). Sobre ella se montan los mismos hotspots, etiquetas (más grandes, con la de Contact hacia abajo para no chocar con Projects), puntos pulsantes y capas de movimiento (carretes, humo, polvo, luz, bonsái). Menú fijo arriba con un botón 🔍 para recoger y soltar la lupa; con la lupa activa, un toque abre la ficha como hoja inferior y un segundo toque abre el panel del objeto. Los libros y el afiche son hotspots solo con lupa (Exhibit F y G). Se descartaron antes una lista de botones bajo una escena pequeña y un deslizamiento lateral de la escena horizontal. Pendiente: probar en teléfono real, tabletas y pantallas horizontales.

La versión de escritorio ya tiene los mismos libros y afiche (hotspots Books y Poster, Exhibit F y G, solo con lupa).

**Accesibilidad.** Las fichas se anuncian en una región `aria-live`. `prefers-reduced-motion` quita animaciones. Libros y afiche son decorativos para lectores de pantalla; sus fichas deben poder leerse de otra forma (p. ej. como parte de la lista de exhibits).

**Qué revela de Matías.** Que expone su trabajo con datos reales en vez de adjetivos, y que quien se acerca descubre dos gustos suyos (lecturas y cine de mafia) en objetos que se explican solos.

## 9. Backend en AWS (pequeño y real)

Todo definido en **AWS SAM** (`backend/template.yaml`), región a elegir (p. ej. us-east-1 o sa-east-1).

| Servicio | Uso |
|---|---|
| Amplify Hosting | Sitio estático desplegado desde GitHub (CI/CD por push); S3 y CloudFront gestionados por Amplify |
| API Gateway (HTTP API) | `POST /contact`, `POST /scan`, `GET /scans`; CORS solo para el dominio de Amplify; throttling bajo (p. ej. 10 rps, ráfaga 20) |
| Lambda (Node, arm64) | `contact` (valida y envía por SES) y `scan` (incrementa contadores) |
| DynamoDB (on-demand) | Un ítem por ficha más `_total`; incremento atómico |
| SES | Entrega del formulario a Matías con `Reply-To` del visitante (sandbox: enviar solo a sí mismo) |
| IAM | Roles de mínimo privilegio por función |
| CloudWatch / Budgets | Logs y una alarma de presupuesto |

Reglas: `scan` valida el objetivo contra una lista permitida; una ficha solo cuenta si estuvo abierta ≥ 700 ms y una vez por carga de página; límites de longitud y honeypot en el formulario; ninguna clave en el cliente. **Degradación:** si el backend falla, el sitio y la lupa funcionan igual (sin contador) y el formulario muestra un `mailto:` de respaldo.

## 10. Entrega y comunicación

- **Repositorio público** con README: concepto, capturas, arquitectura, servicios AWS, cómo correr y desplegar, declaración de uso de IA para la ilustración y licencia.
- **Texto en Builder Center** con secciones que calzan con la rúbrica: la feature creativa (la lupa), capturas del sitio (escritorio y móvil), capturas de la consola AWS (Amplify, API Gateway, Lambda, DynamoDB, SES), tabla de servicios, aprendizajes y desafíos concretos. Sin marcadores sin reemplazar.
- Verificación final: el sitio carga desde cero, enlaces funcionan, formulario y contador responden, Lighthouse razonable en móvil.

## 11. Decisiones que tomé yo (Matías puede cambiarlas)

- **Stack:** Vite + TypeScript sin framework de UI; escena y paneles en DOM/SVG plano. Vitest para funciones puras (datos y mapa de conexiones) y una prueba de humo de la lupa.
- **Una sola página**, con estado de panel en el hash (`#skills`, etc.) para enlaces directos.
- **Datos de GitHub** como JSON estático generado antes del build.
- **Backend** con SAM y Node.js.
- **Recortes si falta tiempo:** primero el contador de escaneos, luego el movimiento en móvil, luego el humo.
- **Imagen:** servir WebP actual; considerar una variante más liviana para móvil.

## 12. Descartado (y por qué)

- **Scouter con "nivel de poder" y estética DBZ:** no calzaba con el despacho y arriesgaba propiedad intelectual. Se reemplazó por fichas de evidencia.
- **Ciudad cyberpunk, dron, detective-minijuego y relato autorreferente:** convertían el sitio en juego.
- **Landing + despacho como segunda vista:** duplicaba el contenido.
- **Journey/Trayectoria como sección:** los logros ya están en Projects, la placa y About.
- **Botón "Activar" en la barra superior:** la pista es la lupa de la mesa y la franja inferior.
- **Autos tras el vidrio:** se veían como suciedad.

## 13. Pendientes que solo Matías puede responder

1. **Idioma del sitio y del texto de entrega.** Los jueces son de AWS y probablemente leen inglés. ¿Inglés principal, español o selector? (El mock está en inglés.)
2. **Cargo exacto** en la legaltech y el titular exacto ("Ingeniería Civil en Informática" u otro).
3. **Relaciones herramienta–caso** del mapa de Skills, y qué herramientas faltan (p. ej. React Native en FitTrack).
4. **Props nuevos:** títulos concretos de libros, películas y actores del afiche, y generar el arte (libros y afiche/rollo) en Gemini con prompt de Claude para pegarlo sobre la ilustración sin regenerar el cuarto.
4b. **Móvil:** validar en un teléfono real, en tabletas y en pantallas horizontales.
5. **Repos privados:** confirmar que pueden mostrarse solo por nombre, descripción y premio.
6. **Capturas** de cada proyecto (las tarjetas necesitan una imagen; si no hay, tarjetas estilizadas).
7. **Enlaces reales:** GitHub (BlasterLc), LinkedIn, correo, repos y demo de Rumbo a Casa, pestaña Winners de Zero to Shipped.
8. **Dominio propio** (blastercl.dev u otro) o solo la URL de Amplify. Verificar de paso que no exista un portafolio anterior publicado, para cumplir "original y no publicado antes".
9. **Cuenta AWS y Builder Center:** confirmar cuenta activa con Amplify y estado de estudiante verificado. Sin eso la entrega no califica.
10. **Certificado de Zero to Shipped:** aún no se entrega; cuando llegue, se añade como tercera entrada del panel Achievements.
11. **Contador de escaneos:** ¿se incluye o se recorta?
12. **Regeneración de la imagen (más adelante, sin romper hotspots):** los libros se ven medio caídos; hay props sin función (bonsái, cámara, carpeta, cenicero, calendario) que no convencen y habría que reemplazarlos por objetos con sentido. Se regenera editando con las mismas referencias y manteniendo las posiciones.
13. ~~Panel de la placa~~ Resuelto (29 oct): la placa pasó a "Awards" y su panel a "Achievements" con contenido propio.

## 14. Plan de alto nivel (calendario sugerido)

- **Días 1–2 (29–30 oct):** esqueleto Vite + TS, escena y hotspots a partir del mock, repo en GitHub y primer despliegue en Amplify (para desbloquear el hosting temprano). Revisar alineación de hotspots y la etiqueta "Winner" sobre el bonsái.
- **Días 3–4:** paneles completos con contenido real, mapa de conexiones, responsivo y backend SAM (contacto y, si entra, contador).
- **Días 5–6:** lupa completa (fichas y props), movimiento ambiental, versión móvil y accesibilidad.
- **Día 7:** pulido, rendimiento, pruebas y revisión de contenido.
- **Día 8:** capturas (sitio y consola AWS), README y texto de entrega.
- **Día 9 (colchón):** verificación final y envío antes del 6 nov.
