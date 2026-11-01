# DESIGN-3D.md: segunda pasada, 3D primero ("La cuadra")

Reemplaza como propuesta a DESIGN.md (fachada) y a "Sala de préstamo". DESIGN.md no se tocó.
Idioma: español. El sitio va en inglés. Los supuestos están marcados como **Suposición** y listados en la sección 4.

## Fase 0: qué cambia respecto a la primera pasada

- Matías rechazó fachada y biblioteca porque "mantienen la misma estética": ilustración plana, sombra dura, bandas de color, objetos pegados a un plano. Lo que pide es profundidad, luz, materiales y cámara.
- Por tanto el criterio de estas propuestas es espacial: qué es el espacio, dónde está la cámara, cómo se mueve el visitante, qué hace la luz, qué materiales hay.
- La identidad no puede salir de un solo proyecto. Rumbo a Casa ya tiene la feature creativa; la base representa a Matías y a sus proyectos: Rumbo a Casa, FitTrack, Minuto Cero, JequeBot.
- Siguen vigentes: tono medio y apagado (ni brillante ni oscuro), nada retro, nada de terminal, ni relato de superación, ni minijuego. Sitio en inglés, estático en Amplify, una semana, vista 2D accesible, reduced motion y móvil a 390 px.

## Fase 1: tres conceptos espaciales

Los tres son distintos entre sí y de fachada y biblioteca (que eran un muro frontal y un mueble frontal). Aquí la cámara se mueve por un volumen.

| | A. La cuadra | B. La plaza vacía | C. El banco de despiece |
|---|---|---|---|
| Territorio | Lugar y cultura | Forma y gusto (pintura metafísica, literatura) | Proceso (cómo trabaja) |
| El espacio | Una calle de barrio de Santiago, a escala de maqueta. Casas, un minimarket, un gimnasio, una casa con parlantes, postes con cables. | Una plaza desierta con arcadas, a una hora fija de la tarde. Los proyectos son volúmenes sobre pedestales. | Una mesa de trabajo infinita, con luz de estudio. Cada proyecto es un objeto desarmado en capas. |
| Cámara | A nivel de peatón, lente larga (FOV 34), tipo tilt-shift. Avanza por la calle al hacer scroll. | Órbita lenta alrededor de los volúmenes, desde 4 m de altura. | Cenital inclinada que gira sobre la mesa. |
| Movimiento del visitante | Scroll = caminar por la cuadra. Cada estación (casa, tienda, gimnasio, casa de sonido) es una sección. | Scroll = girar. Un clic acerca un volumen. | Arrastrar para girar; ensamblar y desarmar. |
| Luz | Sol bajo de la tarde desde un lado: sombras largas de edificios, postes y cables; calidez en las fachadas al sol, relleno frío en la sombra; ventanas encendidas. | Sol bajo fijo, sombras muy largas (de Chirico). | Luz de estudio suave, sin sombras largas. |
| Materiales | Revoque descascarado, zinc ondulado, madera, hormigón, asfalto, reja, tela de toldo. | Piedra, estuco, un solo metal. | Arcilla mate, metal cepillado, acrílico. |
| Ancla | Su trabajo es software para lugares de barrio de la vida diaria: un hogar, un minimarket, un gimnasio, la música de la casa. Santiago, sus postes y su cableado. | Sus lecturas (Camus, Dostoievski, Hesse). | Su hábito de entender el porqué y de verificar todo. |
| Momento firma | Caminar por la calle mientras el sol baja y las ventanas se encienden por estación. | Los volúmenes proyectan sombras que se alinean en una hora concreta. | Un objeto que se ensambla ante la cámara. |
| Frame para compartir | La calle en perspectiva, la casita con luz cálida en primer plano y el minimarket detrás, con sombras de cables sobre el asfalto. | La plaza con una sola sombra larguísima. | El objeto a medio desarmar flotando sobre la mesa. |
| O / Fit / Fe / P | 4 / 5 / 4 / 3 | 3 / 2 / 5 / 3 | 3 / 4 / 2 / 4 |
| Total (P invertido: 5 menos P) | 14 | 12 | 9 |

Criterios: O = originalidad, Fit = ajuste al sujeto, Fe = factibilidad en una semana junto con la escena isométrica de la feature, P = portabilidad (menor es mejor). Prueba de intercambio de A: otra persona cuyos proyectos no sean de barrio rompe el concepto (P 3). C sirve a casi cualquier desarrollador (P 4).

### Elección: A, La cuadra

- Es la única que pone al visitante en un lugar real que se explora (lo que Matías valora en Pamuda's World y The Unburned Library), con una cámara que recorre un espacio de verdad.
- Los cuatro proyectos pesan igual: una casa, un minimarket, un gimnasio y una casa de sonido. La casita de Rumbo a Casa es un edificio más, el primero que se ve, y su pista visible la vuelve entrada a la feature sin ser el concepto.
- Es factible con geometría procedural (cajas, prismas, cilindros) y texturas generadas por canvas: sin modelos externos ni licencias de assets. El spike lo demuestra en un solo archivo.
- **Suposición:** la asociación proyecto-edificio (FitTrack = gimnasio, Minuto Cero = minimarket, JequeBot = casa de sonido, Rumbo a Casa = casita) es mía; se confirma con él.

### Concept Card

```
Idea:        Una cuadra de barrio de Santiago a escala de maqueta, recorrida a pie. Cada
             edificio es un proyecto; los postes y cables son las skills.
Metaphor:    Un barrio real. Reglas tomadas de ahí: una calle lineal, sol bajo desde un lado,
             fachadas con materiales gastados, cables aéreos, ventanas que se encienden.
Signature:   Caminar la calle con el sol bajando: la cámara avanza por scroll, las sombras se
             alargan y cada ventana se enciende al llegar a su estación.
Emotion:     Quietud de tarde en un barrio donde vive gente. Familiar, sin ruido.
Motion verb: "Caminar y detenerse": avance continuo con frenada suave (ease-out) en cada
             estación; nunca un salto.
Screenshot:  La calle en perspectiva con la casita iluminada en primer plano.
```

Sobrevive al footer, al caso y al 404:
- Footer: el final de la calle, con la última casa y el buzón.
- Caso: la cámara entra a la fachada del edificio y la ficha ocupa la ventana.
- 404: una cuadra sin edificios, con un lote vacío y un poste.

## Fase 2: dirección de arte (3D)

### Principio de render

Esto no es una ilustración con sombra. Cada superficie tiene albedo, rugosidad y textura propios; hay una luz direccional con sombras reales, una luz hemisférica de relleno, niebla atmosférica y mapeo de tono. Lo verificable en el spike: sombras de postes y cables sobre el asfalto, revoque con vetas de lluvia, zinc con reflejo metálico suave.

### Paleta por roles (pensada para iluminación 3D)

La paleta de materiales son albedos: el color que se ve depende de la luz. Todo en tono medio, apagado.

| Rol | Nombre | Hex | Notas |
|---|---|---|---|
| haze (ground de página y niebla) | Calima | `#B7A9A0` | Cielo, niebla y fondo de la UI; la escena se funde con él. Cielo superior `#A9A0A4`. |
| ink | Pasaje | `#2A2526` | Texto y bordes de UI. |
| muted | Alero | `#3F3638` | Texto secundario; ≈ 4.9:1 sobre calima (estimado, verificar). |
| luz (superficie de UI) | Luz de ventana | `#D9C9AE` | Paneles, nav, botón. Ink sobre luz > 9:1. |
| lamp (acento, emisivo) | Farol | `#CFA467` | Ventanas encendidas, lámpara de la casita, marcador del pin. Solo se usa luminoso. |
| albedo casita | Ocre rosado | `#B89678` | |
| albedo minimarket | Verde grisáceo | `#6F8A82` | |
| albedo gimnasio | Palo de rosa oscuro | `#A07A6E` | |
| albedo casa de sonido | Pizarra | `#6E7490` | |
| zinc | Zinc | `#A5AAA8`, metalness .55, roughness .48 | Techos. |
| asfalto / vereda | | `#55514F` / `#9C968E` | |

- **Suposición:** los hues de los edificios sirven para distinguir los cuatro proyectos de un vistazo; si Matías los rechaza, se cambian sin tocar la dirección de luz.
- Evitado a propósito: fondo casi blanco, colores saturados, noche cerrada, neón y degradados de color.
- Estados de las rutas de la escena isométrica: abierta = ventana con luz farol, cerrada = persiana baja (lamas), sin datos = marco con rayado. Siempre con etiqueta de texto.

### Luz (el 70 % de la dirección de arte)

- Sol: direccional cálida `#FFD3A1`, elevación baja (~20 a 25°), desde un costado de la calle, sombras suaves PCF a 2048. El lado de la calle al sol es cálido y el otro queda en sombra con relleno frío.
- Relleno: hemisférica `#CBBEB8` / `#7A706D` más una direccional fría tenue sin sombras, para que el lado en sombra siga siendo tono medio y no negro.
- Niebla lineal del color de la calima (16 a 70 m): da profundidad y esconde el límite del mundo. Crestas de la cordillera a 80 y 105 m como siluetas de niebla.
- Mapeo de tono ACES, exposición ~1.0. **Suposición:** el exposure se afina en pantallas reales; el riesgo es "muy brillante" al subir la exposición.
- Driver único `sun` (progreso del scroll): ángulo y altura del sol, intensidad de las ventanas encendidas. Nunca baja de tono medio.
- Iluminación de reposo: una lámpara puntual cálida junto a la puerta de la casita (sin sombras, para costo bajo).

### Materiales

- Revoque: textura de canvas con grano, vetas de lluvia y suciedad en la base. Rugosidad alta.
- Zinc ondulado: franjas de brillo, metalness medio, ligeras manchas de óxido.
- Asfalto y vereda con ruido y junta de losa.
- Maderas de poste, cables como tubos finos con catenaria, follaje de plátano oriental en caras planas (low-poly deliberado, no fotorrealismo).
- Carteles (MINIMARKET, GIMNASIO, SONIDO) como texturas de canvas: texto real en la escena.
- Para la versión final: texturas pre-horneadas en AVIF pequeño en lugar de generarlas en el arranque.

### Tipografía

Archivo (Google Fonts, variable, ejes `wdth` y `wght`), una sola familia, como en la propuesta anterior.
- Nombre y títulos: `wdth 125`, `wght 800`, tracking -0.03 a -0.04em.
- UI y texto: `wdth 100`, `wght 400/500`, 16 a 18 px, medida 60ch.
- Carteles dentro de la escena: la misma familia, para que el mundo y la UI hablen igual.
- **Suposición:** el eje `wdth` está disponible en la fuente alojada; si no, se baja y se aloja localmente. En el spike no se carga la fuente (cae a Helvetica o Arial), para mantener el archivo autocontenido.

### Cámara y movimiento

- Reposo: la cámara deriva en un círculo muy lento (periodos de 40 a 90 s) y mueve el objetivo con el puntero (paralaje).
- Lente: FOV 34 en escritorio, 52 en móvil vertical. Hay una banda de desenfoque arriba y abajo (CSS, falso tilt-shift) y viñeta suave.
- Scroll (fase 3): la cámara avanza por una curva por las estaciones (casa, minimarket, gimnasio, casa de sonido, final de calle) con frenada suave. En móvil el scroll es el mismo; el paralaje por puntero se cambia por giroscopio opcional o se elimina.
- Entrada a la casita: la cámara vuela hasta la fachada (1.5 s, smoothstep) y aparece la ficha de Rumbo a Casa con "Back to reading" visible. En el spike hay una versión mínima.
- Un solo reloj (ticker de GSAP) en la versión final; el spike usa `setAnimationLoop` solo por simplicidad.
- Rendimiento objetivo: ≤ 150 draw calls, sombras de 2048 solo en escritorio y 1024 en móvil, pixel ratio ≤ 2 (1.5 en móvil).
- Reduced motion: cámara quieta, sin paralaje ni deriva, la entrada a la casita es un corte; todo el contenido visible.

### Composición por sección

| Sección | Qué ve el visitante | Layout |
|---|---|---|
| Hero | La calle en perspectiva desde la entrada de la cuadra; la casita iluminada a la izquierda. Nombre arriba a la izquierda, pista "There's a house in Projects" arriba a la derecha. | Escena de pantalla completa; UI mínima en las esquinas, sobre paneles luz. |
| About | Parada en la esquina: un poste con un aviso de papel (panel luz con la bio factual: estudios, práctica en Lexinnova, método). | Panel de texto en 8 columnas anclado a la escena. |
| Skills | Los cables: cada poste agrupa un tipo de skill (lenguajes, backend, frontend, testing, infra); al acercarse se resalta y se enlaza al edificio donde se usó. | Pegajoso: escena a la izquierda, lista a la derecha. |
| Projects and achievements | Cuatro edificios; la placa de logros está en el muro de la casa de sonido. Cada edificio es entrada a su ficha. | La propia calle; la leyenda de estados (luz / persiana / rayado) aparece como cartel. |
| Contact | El final de la calle: la última casa, con buzón. | Pantalla completa; enlaces como botones luz. |

### Vista 2D accesible (obligatoria)

- Es la página HTML normal, no una vista secundaria: encabezados, landmarks, enlaces reales y todo el contenido de las cuatro secciones. El 3D es progresivo.
- Interruptor visible "Switch to 2D view" (y "Switch to 3D view") en la cabecera. Persistido en `localStorage` con try/catch.
- Sin WebGL, con reduced motion o con `prefers-reduced-data`: se carga el 2D por defecto. El canvas es `aria-hidden`.
- Visualmente el 2D conserva el mundo: fondo calima, paneles luz, y una vista de calle estática pre-renderizada (captura de la escena en AVIF) como cabecera, con las mismas cuatro tarjetas de proyecto.
- La casita en 2D: tarjeta de Rumbo a Casa con su dibujo de línea y el botón "Open the house".

### Cómo entra la casita y el portal a las rutas

1. Pista visible en la cabecera: "There's a house in Projects" con un icono de casa. Es un botón de verdad y también un enlace a `#projects`.
2. En la escena, la casita es el primer edificio (izquierda, primer plano), con luz cálida y el pin "Rumbo a Casa" anclado a ella. Hover sobre la casita cambia el cursor; clic o Enter abre la entrada.
3. La cámara se acerca a la fachada; aparece la ficha de Rumbo a Casa (qué hace, stack, enlaces) y el botón "Open the house" que lleva a la escena isométrica con las cuatro rutas (DS49, DS1, DS19, DS52).
4. En la escena isométrica la leyenda repite el vocabulario de ventanas (luz, persiana, rayado). "Back to reading" siempre visible, Escape también vuelve.
5. **Suposición:** la mecánica de rutas ya decidida (números que mueve el visitante, estados abiertas/cerradas/sin datos) no cambia; solo cambia cómo se llega a ella.

### Prueba de genericidad

| Primer impulso (genérico) | Qué cambié |
|---|---|
| Islas flotantes o una ciudad cyberpunk de noche. | Una cuadra real de Santiago de día, con postes, cables y plátanos. |
| Hero con un objeto 3D flotando y degradado de fondo. | El espacio es el hero; no hay objeto flotante ni degradado. |
| Cámara orbitando sin motivo. | Cámara a nivel de peatón que camina, con sombras que justifican el sentido de la luz. |
| Paleta neón u oscura. | Tono medio con niebla y calima; el color vive en albedos y en la luz. |
| Un proyecto como protagonista. | Cuatro edificios equivalentes; la casita destaca solo por la pista de la feature. |
| Skills como barras o chips. | Cables en postes que se enlazan a los edificios. |

Lo que sigue pareciéndose a una plantilla: el diorama low-poly es una convención conocida. Se compensa con la luz de tarde, la textura de los materiales, el cableado y la perspectiva baja. **Riesgo abierto:** si parece un juego móvil, hay que subir la calidad de materiales y reducir la caricatura del follaje.

## Prototipo (spike)

Archivo: `spike/3d/index.html`. Autocontenido, sin build. Three.js 0.160.0 desde jsdelivr con import map. Qué contiene: la calle con cuatro edificios, luces directa y ambiental con sombras, materiales con rugosidad y textura, postes y cables, árboles, cordillera en la niebla, cámara con deriva lenta y paralaje, pista "There's a house in Projects", pin anclado a la casita, entrada a la casita con "Back to reading" y nota de prototipo. `prefers-reduced-motion` deja la cámara quieta.
Abrir: `cd spike/3d && python3 -m http.server 8765`, luego http://localhost:8765/. Necesita red para cargar three desde jsdelivr.

Estado de verificación (franco):
- Verificado: se abrió con Chromium headless (el que ya estaba en la caché de Playwright, ejecutado directamente, sin instalar nada) con WebGL por software (SwiftShader). Renderiza la escena sin error visible, en escritorio (1440×900) y móvil (390×800). Revisé las capturas y ajusté luz, árboles y legibilidad de la UI.
- No verificado: el vuelo hacia la casita (clic, Escape, Back), el hover por raycaster, la deriva y el paralaje en movimiento, `prefers-reduced-motion`, la fluidez en una GPU real y el rendimiento en un teléfono. Esos caminos están escritos, pero no los ejecuté.
- Limitaciones conocidas: en móvil vertical la casita queda fuera de cuadro (solo se ve el minimarket al borde); el botón de la pista funciona igual. Las ventanas del gimnasio, en sombra, quedan casi negras. Los textos de los carteles usan la fuente del sistema.

## 4. Suposiciones, a confirmar con Matías

1. El mapeo proyecto-edificio y los hues de cada edificio.
2. Que "barrio de Santiago" represente el conjunto de sus proyectos (hogar, tienda, gimnasio, música) y no solo a Rumbo a Casa.
3. Que le agrade la perspectiva de peatón y el estilo low-poly con textura; el riesgo principal es que le recuerde a un juego móvil.
4. Archivo con eje `wdth` disponible; universidad y práctica (USS, Lexinnova) tomados de la memoria del proyecto.
5. La exposición y el brillo de la escena, que se ajustan con él en pantalla.
6. Que el 3D sea progresivo y el 2D la base accesible, con interruptor visible.
7. Stack propuesto: Astro estático con Three.js solo en la isla de la escena, GSAP como único reloj y Lenis para el scroll.
