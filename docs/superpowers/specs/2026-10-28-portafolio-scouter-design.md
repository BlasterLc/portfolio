# Portafolio de Matías + Scouter: documento de diseño

Fecha: 28 oct 2026 · Estado: borrador para aprobación · Entrega: **6 nov 2026, 23:59 PT**
Nota: el documento se revisó leyéndolo como constructor (sin subagente). De esa revisión salieron los pendientes 8 y 9 y la restricción sobre propiedad intelectual del Scouter.

## 1. Intención y por qué

Matías participa (individual) en el **AWS Student Builder Challenge: Build Your Tech Superpower**. Debe entregar un portafolio público alojado en AWS Amplify Hosting, con tres secciones obligatorias (About Me, Skills, Projects/Achievements), **una** feature creativa interactiva con pista visible, un repositorio público en GitHub y un proyecto escrito en Builder Center (descripción de la feature, capturas del sitio y de AWS, servicios usados, aprendizajes y desafíos).

La rúbrica que guía todas las decisiones:

| Criterio | Peso | Cómo lo atendemos |
|---|---|---|
| Creatividad y memorabilidad | 30% | El Scouter (sección 5) y la ilustración de Santiago cyberpunk |
| Implementación AWS funcionando | 25% | Amplify + backend pequeño real (API Gateway, Lambda, DynamoDB, SES) con IaC y documentación |
| Calidad de comunicación | 25% | README y texto de entrega con secciones que calzan 1:1 con la rúbrica, capturas reales de la consola |
| Completitud y usabilidad | 20% | Base convencional, navegación clara, responsivo (escritorio y móvil) |

Decisión de fondo, tomada tras varias iteraciones: **el sitio base es convencional y fácil de navegar; la creatividad vive en una sola feature encima**, tal como piden las reglas. Los prototipos anteriores (detective, despacho, ciudad con dron) se descartaron por convertir todo el sitio en un juego o en un relato autorreferente.

## 2. Objetivos, no-objetivos y anti-objetivos

**Objetivos**
- Portafolio claro, bonito y rápido, con identidad visual propia (Santiago cyberpunk al atardecer, estilo anime).
- Scouter funcional, descubrible y que no estorbe la navegación.
- Backend AWS pequeño pero real, definido como código, con costos controlados.
- Entrega completa y verificada antes del plazo, con el sitio estable durante todo el periodo de evaluación (hasta el 23 nov 2026).

**No-objetivos**
- Juegos, narrativa ("el caso", "todo cambió") ni arcos de crecimiento personal.
- Chat con IA, presencia multiusuario en tiempo real ni datos de GitHub en vivo (descartados).
- CMS, blog, autenticación, internacionalización compleja.

**Anti-objetivos (fracaso aunque "funcione")**
- Que se vea como un decorado con contenido escondido; que haya que "jugar" para encontrar un proyecto.
- Oscuridad excesiva o texto poco legible; la ilustración nunca compite con el contenido.
- Que el Scouter oculte o bloquee la navegación, o que sin él falte contenido.
- Copiar código o assets de terceros (el portafolio debe ser original y no publicado antes; el de la inspiración era AGPL-3.0).
- Mencionar IBM como meta, mostrar código o detalles de repos privados, o exponer trabajo de la práctica profesional sin permiso.

## 3. Restricciones

- Plazo: 6 nov 2026, 23:59 PT. Hoy quedan ~9 días.
- Hosting obligatorio: **AWS Amplify Hosting** (usa S3 y CloudFront por debajo). La URL entregada es la de Amplify (`*.amplifyapp.com`), no un proxy desde otro proveedor. Un dominio propio es opcional y debe seguir apuntando a Amplify.
- Cuenta de AWS de estudiante, nivel gratuito. SES inicia en *sandbox* (solo envía a direcciones verificadas), y una cuenta nueva puede tener concurrencia Lambda limitada.
- Créditos de Higgsfield: quedan 4. El arte nuevo se genera principalmente en Gemini (Google AI Pro de Matías), que él ejecuta con prompts que escribe Claude.
- Un solo envío por persona; el sitio debe cargar durante la ventana de evaluación (hasta el 23 nov).
- La ilustración está generada con IA: declararlo en el README y en el texto de entrega.
- El Scouter se inspira en una idea de la cultura anime, pero **no usa material de la serie**: ícono, retícula, tipografía y sonidos son originales (el pitido se genera con Web Audio). Evitar logos, personajes o capturas.
- La imagen del hero es 16:9; en móvil vertical se recorta con un punto focal fijo en la Gran Torre y la cordillera (decisión del builder).

## 4. Sitio base

### 4.1 Estructura (una sola página con anclas + menú fijo)
1. **Hero:** ilustración de Santiago cyberpunk (archivo `spike/assets/santiago.webp`, 2000×1116; original 2752×1536 en el scratchpad) como fondo con un degradado que garantiza contraste. Nombre, una línea de rol, dos botones (Ver proyectos / Contacto) y la pista del Scouter.
2. **Sobre mí:** presentación breve en primera persona, datos de formación (Ingeniería Civil en Informática, USS, egreso 2027) y "fuera del código" (gustos que alimentan el Scouter).
3. **Skills:** agrupadas por área (lenguajes, backend, datos, cloud y herramientas). Cada skill indica en qué proyectos se usó.
4. **Proyectos y logros:** tarjetas con descripción, stack, resultado y enlaces (solo repos públicos tienen enlace). Logros: 1º lugar Impacto Social (Rally de Innovación 2026, sede USS) con Helix; ganador entre 5 del hackathon AWS Zero to Shipped con Rumbo a Casa.
5. **Trayectoria:** gráfico de contribuciones por mes (datos reales de GitHub, JSON estático generado por un script antes de cada build) e hitos.
6. **Contacto:** formulario real (sección 6) y enlaces a GitHub y LinkedIn.
- Menú fijo con anclas, botón de volver arriba, `prefers-reduced-motion` respetado, foco visible, contraste AA en paneles y texto.
- Sin dependencia del Scouter: todo el contenido está visible y se lee sin activarlo.

### 4.2 Dirección visual
Paleta de la ilustración: cian eléctrico, magenta, ámbar y índigo profundo; fondo de paneles oscuro translúcido con texto claro de alto contraste. Tipografía legible (sans humanista para texto, fuente de display para títulos). El tono es luminoso al atardecer, no noche cerrada.

### 4.3 Contenido (de los repos y del perfil; confirmar antes de publicar)
Datos al 27 oct 2026. Contribuciones por mes (GitHub): mar 17, abr 9, may 106, jun 382, jul 408, ago 404, sep 308, oct 151 (parcial); ~1.785 en 12 meses.

| Proyecto | Stack | Commits | Público | Resumen |
|---|---|---|---|---|
| Rumbo a Casa | TypeScript, AWS | 205 | sí | Hackathon AWS Zero to Shipped, ganador entre 5 |
| DealJudge | Python, Strands, Amazon Bedrock | 43 | sí | Agente que juzga si un descuento es real |
| FitTrack | React Native, FastAPI, Supabase | 244 | sí | Seguimiento de gimnasio y nutrición, estimación de calorías por IA |
| Helix | TypeScript, FastAPI (en migración) | 70 | no | ERP para minimarkets chilenos, 1º Impacto Social |
| JequeBot | Python, Discord | 154 | no | Bot de música para Discord |
| Alexa-PC | Python, FastAPI, AWS Lambda | 57 | no | Control del PC por voz con Alexa |
| Asistente | TypeScript, React Native | 116 | no | Convierte intenciones en un horario realista |

La práctica profesional en legal tech se menciona como una línea genérica, sin nombre de cliente ni detalles de código.

## 5. La feature creativa: el Scouter

**Qué es.** Un modo opcional inspirado en el rastreador de Dragon Ball: una lente verde superpuesta que "mide" cualquier elemento de la página y muestra un nivel de poder. La métrica es **honesta y derivable de datos reales**, y el recurso humorístico revela los gustos de Matías (anime, gaming, modding).

**Pista visible.** Botón fijo, siempre visible, con ícono de scouter y pulso de neón: "Activar scouter". Además, un texto en el hero: "Prueba el scouter". Funciona en escritorio y móvil.

**Activación y salida.** Clic en el botón o tecla `S`. La lente cubre la pantalla con viñeta verde, esquinas de HUD y líneas de escaneo muy sutiles; el cursor se convierte en retícula. Salida con el mismo botón o `Esc`. Navegar con el scouter activo sigue siendo posible (clics, scroll, menú).

**Qué se puede escanear.** Cualquier elemento con `data-scan`: el nombre del hero, cada skill, cada tarjeta de proyecto, cada hito, los gustos de "fuera del código" y un objetivo oculto (la cordillera de la ilustración).

**Comportamiento al apuntar.** La retícula se bloquea sobre el objetivo tras ~400 ms, suena un pitido (opcional, desactivado por defecto) y aparece una lectura con:
- Nombre del objetivo.
- **Nivel de poder** (número animado) y su explicación.
- Dos o tres sub-estadísticas con barras (commits, proyectos, antigüedad).
- Contador "escaneado N veces por visitantes" (viene de DynamoDB; si falla, se oculta).

**Fórmulas (decisión de diseño, deben ser verificables):**
- Proyecto: nivel = número de commits del proyecto.
- Skill: nivel = suma de commits de los proyectos donde se usa.
- Hero (nombre): nivel = contribuciones de los últimos 12 meses (~1.785).
- Gustos: texto con humor y dato real, sin número inventado.

**Huevo de pascua.** Escanear la cordillera hace que el scouter "sobrecargue" (efecto de grietas y glitch) y se reinicie, como el gag clásico de la serie. Es el único elemento que no sigue la regla de métrica real, y se presenta como chiste.

**Móvil.** Al activar, tocar un elemento lo escanea y la lectura aparece como hoja inferior; no se depende de pasar el cursor.

**Accesibilidad.** El Scouter es opcional. Sin él, todo el contenido es legible. Las lecturas se anuncian en una región `aria-live`; `prefers-reduced-motion` desactiva parpadeos, sonido y la animación de sobrecarga.

**Qué revela de Matías.** Que mide y expone su trabajo con datos reales en vez de adjetivos, y su gusto por el anime y el gaming (incluido el modding de Dragon Ball: Sparking! Zero) integrado en la propia interfaz.

## 6. Backend en AWS (pequeño y real)

Todo definido en **AWS SAM** (`backend/template.yaml`), región a elegir por el builder (idealmente cercana, p. ej. us-east-1 o sa-east-1).

| Servicio | Uso |
|---|---|
| Amplify Hosting | Sitio estático desplegado desde GitHub (CI/CD por push); S3 y CloudFront gestionados por Amplify |
| API Gateway (HTTP API) | `POST /contact`, `POST /scan`, `GET /scans`; CORS solo para el dominio de Amplify; throttling bajo (p. ej. 10 rps, ráfaga 20) |
| Lambda (Node, arm64) | `contact` (valida y envía por SES) y `scan` (incrementa contadores) |
| DynamoDB (on-demand) | Un ítem por objetivo escaneado más `_total`; incremento atómico |
| SES | Entrega del formulario de contacto a Matías con `Reply-To` del visitante (sandbox: enviar solo a sí mismo) |
| IAM | Roles de mínimo privilegio por función |
| CloudWatch / Budgets | Logs y una alarma de presupuesto |

Reglas del backend: `scan` valida el objetivo contra una lista permitida; un objetivo solo cuenta si la retícula lo mantuvo ≥ 700 ms y una vez por carga de página; límites de longitud y honeypot en el formulario; ninguna clave en el cliente. **Degradación:** si el backend falla, el sitio y el Scouter funcionan igual (sin contador) y el formulario muestra un enlace `mailto:` de respaldo.

## 7. Entrega y comunicación

- **Repositorio público** con README: concepto, capturas, arquitectura, servicios AWS, cómo correr y desplegar, declaración de uso de IA para la ilustración y licencia.
- **Texto en Builder Center** con secciones que calzan con la rúbrica: la feature creativa, capturas del sitio (escritorio y móvil), capturas de la consola AWS (Amplify, API Gateway, Lambda, DynamoDB, SES), tabla de servicios, aprendizajes y desafíos concretos. Sin marcadores sin reemplazar.
- Verificación final: el sitio carga desde cero, enlaces funcionan, formulario y contador responden, Lighthouse razonable en móvil.

## 8. Decisiones que tomé yo (Matías puede cambiarlas)

- **Stack:** Vite + TypeScript sin framework de UI, DOM plano (el Scouter es una capa sobre el DOM y no necesita React). Pruebas con Vitest para las funciones puras (fórmulas de nivel) y una prueba de humo del Scouter.
- **Una sola página con anclas**, no multipágina.
- **Datos de GitHub** como JSON estático generado por un script antes del build; no hay llamadas en vivo.
- **Backend** con SAM y Node.js; región a decidir por el builder.
- **Huevo de pascua** de la cordillera y contador de escaneos como complementos; si el tiempo falla, se recorta primero el sonido, luego el huevo de pascua.
- **Imagen del hero** tal como se generó, sin reescalado; recomendable subirla a 2K para pantallas grandes.

## 9. Pendientes que solo Matías puede responder

1. **Idioma del sitio y del texto de entrega.** Los jueces son de AWS y probablemente leen inglés. ¿Inglés principal con selector a español, español con selector a inglés, o solo uno?
2. **Apellido o nombre completo** y titular exacto (p. ej. "Estudiante de Ingeniería Civil en Informática").
3. **Texto de "Sobre mí"** (sin relato de superación): qué quiere decir y qué tipo de oportunidad busca.
4. **Repos privados:** ¿pueden mencionarse solo por nombre y descripción, o se hacen públicos (Helix, JequeBot…)?
5. **Confirmar** las relaciones skill–proyecto, las fechas de los hitos y qué certificaciones ya tiene antes de publicarlas.
6. **Contactos públicos:** correo, LinkedIn y GitHub (BlasterLc) que quiere mostrar.
7. **Dominio propio** (blastercl.dev u otro) o solo la URL de Amplify.
8. **Capturas o imágenes de los proyectos.** Las tarjetas necesitan una imagen por proyecto. ¿Hay capturas que se puedan mostrar (sobre todo de los privados), o se aceptan tarjetas estilizadas sin captura?
9. **Estado de la cuenta AWS y de Builder Center.** ¿La cuenta está activa con Amplify disponible y el estado de estudiante verificado? Sin eso la entrega no califica, y conviene confirmarlo hoy mismo.

## 10. Plan de alto nivel (calendario sugerido)

- **Días 1–2:** esqueleto Vite + TS, contenido base, hero con la ilustración, repo en GitHub y primer despliegue en Amplify (para desbloquear el hosting temprano).
- **Días 3–4:** secciones completas, responsivo, datos de GitHub, backend SAM (contacto y contador).
- **Días 5–6:** Scouter completo, huevo de pascua, accesibilidad y modo móvil.
- **Día 7:** pulido, rendimiento, pruebas y revisión de contenido.
- **Día 8:** capturas (sitio y consola AWS), README y texto de entrega.
- **Día 9 (colchón):** verificación final y envío antes del 6 nov.
