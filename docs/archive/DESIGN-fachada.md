# DESIGN.md: portafolio de Matías ("El block")

Estado: fases 0 (brief), 1 (concepto) y 2 (dirección de arte). No hay código, scaffold ni build todavía.
Idioma de este documento: español. Idioma del sitio y de la copia de ejemplo: inglés.
Cada supuesto está marcado como **Suposición** y se reúne en la sección 3.

---

## Fase 0: Brief

| Campo | Decisión |
|---|---|
| Sujeto | Matías, estudiante de Ing. Civil en Informática en Santiago de Chile, egresa en 2027. Escéptico: verifica todo, incluido el código que genera una IA. |
| Audiencia | Jurado del AWS Student Builder Challenge (Gate 1: IA + humanos; Gate 2: panel AWS) y, después, reclutadores y equipos que lean el repo. |
| Trabajo del sitio | Pasar la rúbrica (creatividad 30, AWS 25, comunicación 25, completitud y usabilidad 20) y que el trabajo sea el protagonista. |
| Entrega | 6 nov 2026, 23:59 PT. Hosting en AWS Amplify, sitio estático. Una semana de trabajo. |
| Idioma | Inglés. |
| Secciones obligatorias | About, Skills, Projects and achievements, Contact. Más una pista visible de la feature creativa en la cabecera. |
| Feature creativa (decidida) | Casita dibujada en la ficha de Rumbo a Casa. Escena isométrica con una familia ficticia y cuatro rutas (DS49, DS1, DS19, DS52) que se abren, cierran o quedan sin datos según los números que mueve el visitante. Botón permanente "Back to reading". Vista 2D accesible. |
| Gustos aceptados como fuente de mundo | Zinc de techos, fachadas pintadas, hormigón, vivienda social, Santiago. Lugares reales que se exploran (Pamuda's World, Mac OS 9). |
| Rechazado | Retro 2000, terminal, estética oscura, relato autorreferente o de superación, minijuegos, layouts de plantilla IA, colores saturados, fondos casi blancos. Paletas ya descartadas: bermellón sobre gris; bandas de zinc, celeste y mostaza; hormigón con salvia y ladrillo (#BDB8AE, #7E8F7A, #B27C55, #34312D). |
| Restricciones técnicas | Una escena interior con Three.js u OGL más una vista 2D accesible. Reduced motion y teclado obligatorios. Móvil diseñado a 390 px. |

Lectura del feedback estético: tres paletas fallaron en hue y también en **lenguaje de render** (bandas planas de color en layouts editoriales). Por eso esta dirección cambia la forma de dibujar, no solo los hex: superficies con textura de pintura, objetos reales pegados a un muro y sombras proyectadas con un ángulo de sol fijo.

---

## Fase 1: Concepto

### Tres territorios

| | A. El block (lugar y cultura) | B. Tres estados (sistema formal / proceso) | C. La maqueta (material de la profesión) |
|---|---|---|---|
| Idea | El portafolio es un block de departamentos de vivienda social chilena visto en elevación. Cada proyecto es una ventana; los avisos, placas y el citófono son los componentes de UI. | Ninguna afirmación del sitio va sin estado: cumple / no cumple / sin datos. Cada claim enlaza a su evidencia (repo, commit, demo) o admite que no la tiene. | Todo el sitio es una maqueta de cartón gris cortada por curvas de nivel del valle de Santiago; las secciones son capas apiladas. |
| Ancla | El "block" de vivienda social, el tema de Rumbo a Casa (subsidios habitacionales) y los minimarkets de barrio de Minuto Cero. | Su hábito de verificar todo y el motor de reglas de Rumbo a Casa, que devuelve tres salidas y cita el decreto. | El título "Ingeniería Civil" y la escena isométrica de la feature. |
| Layout | Elevación de fachada; contenido en objetos adosados al muro (aviso, placas, citófono). | Márgenes con marcadores de evidencia; columnas de texto con anotaciones. | Capas desplazadas con sombra de cartón. |
| Verbo de movimiento | Subir y bajar como persiana metálica. | Marcar, tachar, sellar. | Apilar y despegar capas. |
| Tipografía | Grotesk de ancho variable, rotulación de números de block. | Grotesk neutro con tabulares. | Mono técnico o grotesk fino. |
| Fuente de paleta | Pintura de fachada desteñida por el sol, rejas, luz de ventana. | Tres colores semánticos. | Cartón gris, balsa. |
| Momento firma | Tocar una ventana sube su persiana y la abertura crece hasta ser la página del caso (FLIP con clip-path). | Activar "Show evidence" y que todo el sitio revele su fuente a la vez. | Despegar capas al hacer scroll. |
| Frame para compartir | La fachada con tres ventanas encendidas, una con persiana a medio subir, sombra de alero cruzando el muro y el nombre pintado en el parapeto. | Un párrafo con marcadores de evidencia abiertos. | Las capas de cartón en isométrica. |
| Puntajes O / Fit / Fe / P | 5 / 4 / 3 / 2 | 4 / 5 / 5 / 4 | 3 / 3 / 3 / 4 |
| Total (P invertido: 5 menos P) | 15 | 15 | 10 |

O = originalidad, Fit = ajuste al sujeto, Fe = factibilidad en código, P = portabilidad (menor es mejor). Prueba de intercambio: B funciona con cualquier ingeniero escéptico (P 4); A solo funciona con alguien cuyo mejor proyecto trata de vivienda social chilena (P 2); C sirve a cualquier estudiante de arquitectura o civil.

### Elección: A, El block

A y B empatan en el total (15). Elijo A por tres razones: (1) tiene la mayor originalidad (5 contra 4), (2) es la única que pasa la prueba del "cartel": B es una lógica y no una imagen, y la queja principal del usuario es visual, y (3) hace que la feature creativa no sea un modal aparte: la casita vive dentro del mismo mundo que el resto del sitio, que es lo que distingue a los mejores proyectos del informe.

Decisión de juicio, no de tabla: B queda absorbida como detalle secundario (ver "Idea robada" más abajo). Si el prototipo de la fachada se ve como ilustración de stock, el plan B es la dirección alternativa 2 (sección 4).

**Idea robada de B (solo para el detalle):** las ventanas tienen tres estados reales, que son también la leyenda de la escena de la feature.
- Luz encendida = hay demo o repo públicos.
- Persiana baja = privado o bajo acuerdo (por ejemplo, trabajo freelance o de la práctica).
- Marco vacío con rayado = sin datos todavía, dicho abiertamente.

### Concept Card

```
Idea:        Un block de departamentos chileno visto de frente: cada proyecto es una ventana,
             y quien visita sube la persiana para entrar.
Metaphor:    Vivienda social de Santiago. Reglas tomadas de ahí: módulo repetido, escalera
             común, objetos pegados al muro (avisos, placas, citófono), ropa colgada, sol del
             norte a la tarde, pintura desteñida.
Signature:   La persiana-abertura. Tocar una ventana sube la persiana y la abertura crece hasta
             llenar el viewport y ser la página del caso (shared element con clip-path).
             El mismo gesto abre la casita de Rumbo a Casa.
Emotion:     Calma de tarde de domingo en una villa: algo habitado, sin ruido, con orden.
Motion verb: "Subir como persiana": avance en pasos cortos de lamas, un leve traqueteo de
             2 px al llegar arriba, nunca un fade solo.
Screenshot:  La fachada con el nombre pintado en el parapeto, tres ventanas encendidas, una
             persiana a medio subir y la sombra de un alero cruzando el muro.
```

### Por qué sobrevive al footer, al caso y al 404

- Footer: el portón de entrada con citófono (los botones son los canales de contacto).
- Caso: la ventana se abre y su marco es el marco de la página; el volver baja la persiana.
- 404: "Apartment 404", marco vacío con rayado ("no data").

### Deriva en cuatro decisiones (prueba del skill)

Layout (elevación y objetos adosados), movimiento (persiana), paleta (pintura desteñida y luz de ventana), copy ("Notice", "Plaque", "Intercom"), componentes (aviso, placa, citófono).

---

## Fase 2: Dirección de arte

### Paleta por roles

Principio: tono medio y apagado. Ningún color pasa de saturación baja. Nace de una fachada pintada que lleva años al sol, no de un tablero de moda. **Suposición:** el rosado lavado es el color del muro principal; ninguna de las paletas rechazadas lo usó.

| Rol | Nombre | Hex | Uso | Contraste (estimado, verificar con axe en Fase 3) |
|---|---|---|---|---|
| ground | Muro (rosado lavado) | `#A6959A` | Fondo de todas las páginas. | Ink sobre ground ≈ 5.8:1 |
| ink | Reja | `#231F24` | Texto principal, líneas gruesas, foco. | AA y AAA grande |
| muted | Alero | `#352B31` | Texto secundario sobre ground. | ≈ 4.8:1 sobre ground (apenas pasa) |
| luz | Ventana encendida | `#D6C3A0` | Paneles de lectura, ventanas "abiertas", cuerpo de la ficha. | Ink ≈ 9.5:1, muted ≈ 7.9:1 sobre luz |
| line | Junta | `rgba(35,31,36,.24)` | Hairlines, lamas, bordes de panel. | Decorativo |
| accent | Puerta (verde botella lavado) | `#35554C` | Una sola vez por pantalla: botón principal, puerta del portón. | Luz sobre accent ≈ 4.8:1 |
| curtain | Persiana | `#6E5F66` | Lamas de la persiana y fondo de la transición. | Solo gráfico |

Reglas:
- El hue del muro no se mueve durante el scroll. El driver de luz (abajo) cambia la longitud de las sombras y la intensidad de las ventanas, no el fondo, para que el contraste del texto sea constante en todos los estados.
- Los estados de ventana nunca dependen solo del color: forma (luz / persiana con lamas / rayado diagonal) más etiqueta de texto.
- Si `luz` se lee como crema de plantilla en las pruebas de pantalla, desplazarlo hacia un rosado-ámbar (`#D8BFA3`) antes de tocar el resto.
- Evitado a propósito: zinc gris-azul, celeste, mostaza, bermellón, hormigón beige, salvia, ladrillo.

### Tipografía

Una sola familia con eje de ancho: **Archivo** (Google Fonts, variable, `wght` 100..900 y `wdth` 62..125). **Suposición:** el eje `wdth` está disponible en la fuente alojada; si no lo está en el CSS de Google, se baja la fuente y se aloja localmente. Se evita la tipografía de IA habitual (Inter, Fraunces, Instrument Serif).

| Rol | Configuración |
|---|---|
| Display / nombre / nombres de proyecto | Archivo `wdth 125`, `wght 800`, tracking -0.04em, leading 0.88. Es la rotulación pintada del block. |
| Etiquetas de fachada (piso, depto, estado) | Archivo `wdth 75`, `wght 600`, mayúsculas, tracking +0.05em, 12 a 14 px. |
| Texto | Archivo `wdth 100`, `wght 400/500`, 17 px, leading 1.55, medida 60ch. |
| Cifras | `font-variant-numeric: tabular-nums` en números de depto, años y decretos (DS49, DS1, DS19, DS52). |

Escala fluida:

```css
--t-mega: clamp(4.5rem, 1rem + 17vw, 17rem);   /* nombre en el parapeto */
--t-xl:   clamp(2.5rem, 1.3rem + 4.6vw, 6rem);  /* títulos de sección y de caso */
--t-l:    clamp(1.5rem, 1.2rem + 1.6vw, 2.75rem);
--t-m:    clamp(1.1875rem, 1.1rem + 0.5vw, 1.5rem);
--t-body: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
--t-s:    0.875rem; --t-xs: 0.75rem;
```

Reglas de composición tipográfica:
- Sin mono (la terminal está rechazada) y sin serif editorial.
- No hay una "etiqueta pequeña sobre cada título": las etiquetas existen solo donde el muro las tendría (número de piso, número de depto).
- Mayúsculas tracked solo en `wdth 75`, donde el diseño de las capitales las admite.

### Grilla y ritmo

- Desktop: 12 columnas, gutter fluido 16 a 28 px, margen exterior = gutter. Móvil: 4 columnas.
- Módulo de ventana = 2 columnas de ancho. Un block tiene 3 crujías (bays) de 4 columnas. Las ventanas se asientan en las columnas 2-3, 6-7 y 10-11; el texto cuelga de las líneas de crujía 1, 5 y 9.
- Regla de alineación: todo borde de panel, placa o aviso coincide con el borde de un marco de ventana. Nada flota entre módulos.
- Ritmo de secciones (cuatro "estados de ánimo" asignados, no constantes):
  - Hero: pantalla completa.
  - About: aireado, 28u.
  - Skills: denso y pegajoso, 16u con sticky.
  - Projects: normal, 16u.
  - Contact: pantalla completa.
- Esquinas: nombre arriba a la izquierda, nav arriba a la derecha, la pista "There's a house in Projects" arriba al centro-derecha, volver / hora local abajo. La nav sale del paso al bajar y vuelve al subir.

### Regla de forma

- Todo es rectángulo sobre el módulo. Radio 0 en muros, paneles, placas y ventanas.
- Excepciones únicas: botones del citófono (círculos) y el sol de la sombra (si aparece, una elipse).
- Lamas de persiana: 6 px de alto con 1 px de junta.
- Sombras: duras, proyectadas con un solo ángulo de sol (norte, tarde), sin blur. Nada de sombra suave de tarjeta SaaS.

### Render y textura (el cambio frente a las tres paletas rechazadas)

- Superficies pintadas con grano fino: textura de ruido preprocesada (PNG/AVIF de baja resolución en tile), nunca filtro SVG en vivo, por rendimiento.
- Bordes con desvío leve de 1 a 2 px (mano), manchas de eflorescencia en la parte baja de los muros, rejas de línea gruesa.
- Detalles de cultura material: ropa tendida, tanque de gas, antena, ductos, número de block pintado, buzones. Todo dibujado en SVG propio, sin librería de ilustración.
- Prohibido: degradados de color como fondo, vidrio esmerilado, brillos.

### Lenguaje de movimiento

Un solo reloj (ticker de GSAP). Un solo ease del motor, con perfil "persiana": `power3.inOut`, con un asentamiento de 2 px al final.

| Qué | Duración | Detalle |
|---|---|---|
| Micro (hover, foco, press) | 180 ms | Press: la lama baja 2 px. |
| Reveals de texto | 420 ms | Máscara por lamas, stagger 40 ms. |
| Persiana de ventana | 760 ms | Pasos de lama, traqueteo 2 px. |
| Transición de página | 900 ms | La abertura de la ventana crece hasta el viewport. |

- Movimiento principal: lo grande se mueve más lento que lo pequeño; todo en `transform`, `opacity`, `clip-path`.
- Un tratamiento por rol:
  - Enlaces y nav: el texto interior rueda hacia arriba dentro de una línea recortada (`translateY`), como una lama.
  - Ventanas de proyecto: al hacer hover la persiana sube 12 % y muestra la luz de adentro (no hay solo cambio de color).
  - Botón principal: la persiana de relleno sube (accent), `luz` pasa a ink.
  - Enlaces de utilidad (legales, redes): solo cambia el color.
  - Enlaces dentro de párrafos: subrayado en reposo.
- Foco: anillo de 2 px en ink con 2 px de separación en ground, visible sobre ground, luz y accent.
- Reduced motion: sin scrub, sin traqueteo, persianas aparecen ya subidas, transición en corte limpio; todo el contenido visible.
- Táctil: nada depende del hover; la ventana se abre con tap, no con hover.

### Driver único e idle

Un módulo, `sun`: una variable (progreso de scroll de 0 a 1) más un tic de reloj.
- `sun` rige el ángulo y largo de la sombra de aleros y balcones, y la intensidad de la luz en las ventanas encendidas (la intensidad nunca baja de AA para el texto adentro).
- Idle (sin tocar nada): la ropa tendida se balancea ±1.5°, una ventana parpadea como TV, y el humo del tanque sube lento. Todo en el ticker, en pausa fuera de pantalla y apagado con reduced motion.

### Composición: wireframes por sección

Una familia de layout distinta por sección. Los wireframes son de escritorio (1440 px); las notas de móvil van debajo.

**Header (fijo, esquinas)**
```
+----------------------------------------------------------------------+
| M. Matías                       Projects Skills About Contact        |
|                      (casita) There's a house in Projects  ->        |
+----------------------------------------------------------------------+
```
La pista lleva una casita de 3 trazos que se asoma por el borde del texto; en móvil es un chip a un toque, debajo del menú.

**1. Hero: "Poster" (cartel pintado)**
```
+----------------------------------------------------------------------+
| [cielo/ground: franja angosta con antena y ropa tendida]             |
|=======================  PARAPETO  ===================================|
|  M A T Í A S                        (Archivo 125/800, 17vw)          |
|======================================================================|
|  Software engineering student     |   [ ] [#] [ ]                    |
|  in Santiago, Chile. Class of 2027|   [#] [=] [ ]   <- 3 bays        |
|  (1 frase, ancho 4 col)           |   [ ] [ ] [#]      ventanas      |
|  (alero + sombra cruza el muro)   |   #=luz  ==persiana  []=rayado   |
+----------------------------------------------------------------------+
```
Móvil: nombre en dos líneas, dos crujías visibles, ventanas 2×N; el parapeto ocupa el ancho completo.

**2. About: "Statement" (el aviso en la puerta del hall)**
```
+----------------------------------------------------------------------+
|                           +----------------------------------+       |
|  [puerta verde, accent]   |  NOTICE                          |       |
|                           |  Matías is a fourth-year         |       |
|                           |  computer engineering student... |       |
|                           |  (t-l, 8 columnas, fondo luz)    |       |
|                           |  He tests what he builds, and    |       |
|                           |  what an AI builds for him.      |       |
|                           +----------------------------------+       |
|  [buzón]   Lexinnova (legal tech) · USS · graduating 2027            |
+----------------------------------------------------------------------+
```
Hechos, no relato de crecimiento: dónde estudia, dónde practica, cómo trabaja. Los gustos (Camus, AoE2, self-hosting) caben en una línea al pie como dato, no como biografía.

**3. Skills: "Sticky narrative" (corte de las instalaciones)**
```
+----------------------------------------------------------------------+
| [sticky] CORTE DEL BLOCK        |  Structure                          |
|   azotea (tanque):  Infra       |   Python, TypeScript, JS/Node       |
|   fachada:         Frontend     |   used in: Minuto Cero, Rumbo a Casa|
|   ductos:          Backend      |------------------------------------|
|   cañerías:        Data         |  Services                           |
|   inspección:      Testing      |   FastAPI, Supabase                 |
|   (la parte activa se pinta)    |   used in: ...                      |
+----------------------------------------------------------------------+
```
Cada tecnología enlaza al proyecto donde se usó (evidencia). Móvil: el corte pasa a una tira superior y los capítulos se apilan debajo.

**4. Projects and achievements: "Gallery wall" (fachada de ventanas) + placas**
```
+----------------------------------------------------------------------+
|  PROJECTS                                                            |
|  +----+  +----+  +----+     [Rumbo a Casa]  <- la casita en el        |
|  | 1  |  | 2  |  | 3  |      alféizar, con la persiana a medio subir |
|  +----+  +----+  +----+                                              |
|  +----+  +----+  +----+     leyenda: luz = public · persiana = private|
|  | 4  |  | 5  |  | 6  |                         · rayado = no data    |
|  +----+  +----+  +----+                                              |
|  ACHIEVEMENTS: [placa] [placa]  (1st place Rally Innovación USS 2026,|
|                                  AWS Zero to Shipped winner)         |
+----------------------------------------------------------------------+
```
Móvil: ventanas 2 columnas; las placas pasan a una fila con scroll horizontal y snap.

**5. Contact: "Footer como final" (portón y citófono)**
```
+----------------------------------------------------------------------+
|  Ring the bell.                          [ (o) Matías - email ]      |
|                                          [ (o) GitHub        ]       |
|  [portón verde, accent, ajar]            [ (o) LinkedIn      ]       |
|                                          [ (o) Repo          ]       |
|  © 2026 · built on AWS Amplify · repo                                 |
+----------------------------------------------------------------------+
```
Los círculos son los únicos no-rectángulos. El formulario (opcional) se abre en un panel `luz`.

**6. Caso (ficha del proyecto)**
```
+----------------------------------------------------------------------+
| <- Back                                       1 / 6    Next ->       |
| [la ventana abierta es el marco de la página]                        |
|  Rumbo a Casa                      what it does        stack         |
|  (Archivo 125/800, t-xl)           (8 col, luz)        (4 col)       |
|  [casita dibujada] -> Open the house                                 |
+----------------------------------------------------------------------+
```

**7. 404**
```
+----------------------------------------------------------------------+
|              +----------------+                                      |
|              |////////////////|   Apartment 404.                     |
|              |//  no data  ///|   Nobody lives here.   -> Back home  |
|              +----------------+                                      |
+----------------------------------------------------------------------+
```

### Feature creativa: coordinación artística (sin rediseñar la mecánica)

- La casita de la ficha se dibuja con el mismo trazo de reja (línea gruesa en ink), sin relleno de color.
- La escena isométrica usa la misma paleta; sus cuatro rutas usan el vocabulario de ventanas: abierta = luz encendida, cerrada = persiana baja, sin datos = rayado. La leyenda del 2D accesible repite esas tres formas con texto.
- Entrar y salir de la escena usan la misma persiana de la firma. "Back to reading" queda fijo en la esquina, siempre visible.

### Prueba de genericidad

Pregunta: ¿un modelo genérico, con un prompt parecido, aterrizaría aquí?

| Primer impulso (genérico) | Qué cambié |
|---|---|
| Hero con nombre centrado y una ciudad nocturna en neón. | Fachada de día con el nombre pintado en el parapeto. |
| Pisos como bandas de color apiladas, que es lo que ya se rechazó. | Contenido en objetos pegados al muro (aviso, placas, citófono) y un corte de instalaciones. |
| Skills como chips o barras de porcentaje. | Corte del block con instalaciones y enlaces a proyectos reales. |
| Paleta hormigón + salvia + ladrillo, o zinc + celeste. | Rosado lavado, reja, luz de ventana y verde puerta; ninguno estuvo en las paletas rechazadas. |
| Tipografía serif editorial o Inter. | Archivo de ancho variable como rotulación pintada. |
| Persiana como animación decorativa. | La persiana es el único gesto de interacción y la transición. |
| "Passionate developer" y relato personal. | Aviso con hechos: estudios, práctica, método. |

Resultado: lo que sigue siendo parecido a una plantilla es la cuadrícula de proyectos. Se compensa con el estado de cada ventana (público, privado, sin datos), el detalle de la casita y la placa de logros. **Riesgo abierto:** la calidad de la ilustración; se valida con un prototipo de la fachada antes de construir el resto.

### Móvil (390 px)

- Fachada de 2 crujías; nombre en dos líneas; menú de un toque que abre un overlay con enlaces grandes y las mismas lamas.
- La firma se adapta, no se quita: la ventana se abre con tap y la persiana sube igual.
- Objetivos táctiles ≥ 44 px en acciones principales.

---

## 3. Suposiciones, a confirmar con Matías

1. Lenguaje de render y paleta rosada lavada como muro principal (no está en las paletas rechazadas, pero es el riesgo estético más alto).
2. Universidad (USS) y práctica en Lexinnova, tomados de la memoria del proyecto; confirmar antes de publicar.
3. Estados de las ventanas (público / privado / sin datos) por proyecto: son supuestos; se definen con él proyecto por proyecto. Ningún proyecto puede mostrar "luz" sin un enlace real.
4. Apellido y enlaces (GitHub, LinkedIn, correo): marcados como `placeholder: true` en el archivo de contenido.
5. Logros: se muestran solo los verificables (1er lugar Impacto Social, Rally Innovación 2026, sede USS; ganador de AWS Zero to Shipped entre cinco). Sin métricas inventadas.
6. Stack propuesto: Astro estático (sitio de contenido donde el movimiento es el producto, despliegue simple en Amplify), GSAP, Lenis, y Three.js cargado solo en la isla de la feature. Cambia si el proyecto ya tiene framework.
7. No hay loader (la fachada es el primer frame); no hay WebGL en la home. El teatro se concentra en la persiana y la escena.
8. Inglés sin guiones largos ni palabras de relleno; los textos de ejemplo de este documento son borradores.

---

## 4. Direcciones alternativas (muy distintas entre sí y de lo rechazado)

### Alternativa 1: "Probeta" (laboratorio de ensayo de materiales)

- Territorio: material de la profesión. Un informe de ensayo de hormigón: cada proyecto es una probeta sometida a carga hasta su límite.
- Ancla: título de Ing. Civil y su hábito de someter todo a verificación.
- Layout: informe de ensayo a dos columnas; a la izquierda el dato, a la derecha la curva carga-deformación de cada proyecto, dibujada solo con cifras reales (tests, cobertura, tiempo de respuesta).
- Paleta: petróleo apagado `#5F7F80` de fondo, tinta `#14201F`, papel de informe `#C9D2CC`, naranja de seguridad lavado `#C2763F` como único acento.
- Tipografía: Archivo estrecho para datos y un grotesk neutro de lectura; cifras tabulares.
- Firma: arrastrar una curva para "cargar" un proyecto y ver hasta dónde llega la evidencia; donde no hay datos, la curva se corta con una marca "no data".
- Movimiento: pasos de medición, sin rebotes; el idle es un trazador que lee lento.
- Riesgo: parece un dashboard técnico y se aleja de "lugar que se explora"; la casita encaja peor.

### Alternativa 2: "Sala de préstamo" (biblioteca de barrio)

- Territorio: cultura y gustos (Camus, Dostoievski, Hesse) usados como lugar y no como relato: una biblioteca pública.
- Ancla: sus lecturas y su manera de documentar; los proyectos son libros en un estante, las secciones son estantes.
- Layout: estanterías en elevación; el lomo de cada proyecto tiene tela de encuadernación y un número de clasificación; el carnet de préstamo es la ficha.
- Paleta: pared `#7C8B7F` de fondo apagado, madera `#7A5C45`, lomos en telas medias (índigo `#5C6684`, oliva `#6F7D6A`, cuero `#A07F5B`, ciruela `#8B6F86`), papel `#CFC3AE`.
- Tipografía: grotesk de texto más una serif de lectura solo en el cuerpo de las fichas.
- Firma: sacar un libro del estante, que se abre en la página del caso; el espacio vacío queda como marca de que está "en préstamo" (privado).
- Movimiento: deslizar y apoyar, con peso; el idle es polvo en un rayo de luz.
- Riesgo: sensible a "estética de libro de IA"; exige buena textura de tela y madera.

### Recomendación

Recomiendo la dirección principal, **"El block"**. Es la única que une el portafolio con la feature en un solo mundo, usa los materiales que Matías ya aceptó y resuelve la queja visual cambiando el lenguaje de render, no solo los hex. Condición: un prototipo de la fachada antes de construir el resto. Si el prototipo se ve como ilustración de stock o la paleta rosada no convence, la mejor alternativa es la **2 (Sala de préstamo)**, que tiene materiales tangibles y paleta de tono medio natural.
