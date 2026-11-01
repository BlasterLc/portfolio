# Esquema del texto de Builder Center (molde: *Rumbo a Casa*)

Molde tomado de la página de Builder Center de *Rumbo a Casa* (PDF en Descargas, 8 páginas). Lo que estructura bien ese texto, aplicado a este proyecto. El texto final va en **inglés**. La rúbrica de este concurso: creatividad y memorabilidad 30 %, AWS funcionando 25 %, comunicación 25 %, completitud y usabilidad 20 %.

## Qué copiar del molde

| Sección en *Rumbo a Casa* | En este proyecto | Qué hace falta tener antes |
|---|---|---|
| Encabezado: autor, categoría, **URL en vivo** y **enlace al código** | URL de Amplify + repo público | repo público |
| Captura principal bajo el título | la sala con el TV encendido | captura nítida del sitio |
| **The problem** | por qué un portafolio como cuarto: una página plana no transmite quién eres; la nostalgia sí | texto propio (la "historia personal") |
| **What it does** (lista numerada, concreta) | 1 el cuarto y el TV apagado que invita a encender, 2 el arranque tipo consola (sonido sintetizado e intro), 3 el menú con About / Skills / Projects / Contact, 4 la vista simple y el modo de movimiento reducido, 5 el backend | contenido real |
| **Technical innovation** (una idea clara con razones) | todo el sonido se sintetiza en el navegador con Web Audio y el intro se prerenderiza a video de 250 KB: un cuarto 3D completo sin descargar audio ni gastar GPU de más | cifras reales de peso y rendimiento |
| **Architecture** (tabla servicio → qué hace aquí) | Amplify Hosting, API Gateway, Lambda, DynamoDB, SES, CloudTrail, IAM | los servicios desplegados |
| **Guardrails** (topes de gasto y límites) | límites por minuto y por día con contadores atómicos en DynamoDB, tamaño máximo de petición, errores limpios | implementarlos en el backend |
| **Try it without typing anything personal** | un modo de prueba o recorrido guiado para que los jueces recorran todo sin escribir nada | decidir si hace falta |
| **Community impact / Accessible by design** | accesibilidad: vista simple completa, `prefers-reduced-motion`, contraste y tamaño de los botones comprobados, nada solo por color | auditar contraste y móvil (390 px) |
| **Privacy and responsible use** | qué se guarda y por cuánto tiempo (p. ej. libro de visitas, correo), por qué no se pide nada personal | decidir qué datos guarda el backend |
| **How we built it with a coding agent** (errores reales y cómo se encontraron) | los problemas de verdad de este proyecto, ver abajo | **apuntarlos mientras pasan** |
| **Evidencias** (CloudTrail, capturas de terminal y de la consola) | `docs/evidence/` | ya hay una parte; faltan capturas de la consola |

## Problemas reales de este proyecto que ya son material para "lo que aprendimos"
- El **lag** del 3D: se midió con un panel de diagnóstico (`?debug`); la causa no era el dibujo del TV (0.5 ms) sino la GPU; se agregó escalado dinámico de resolución. *(Falta cerrar con datos del equipo de Matías.)*
- El **sonido**: el primer arranque estaba mal planteado (un zumbido grave); al **medir** los clips de referencia (espectro, curva de volumen) resultó ser un acorde denso de 200-1300 Hz. Aprendizaje: medir en vez de adivinar.
- **Licencias**: se descubrió que varios modelos 3D descargados no se podían redistribuir; el empaquetador ahora **se niega a construir** si un modelo no es CC0 o CC BY.
- El **vidrio de los props** se veía negro (materiales de transmisión) y los metales también; se corrigió ocultando el vidrio y limitando el metal.
- Un **comentario en una línea** se comió el código que seguía (error silencioso); se detectó porque la página dejó de iniciar.
- La **sesión de `aws login` caduca**: no es un despliegue roto.

## Pendiente de decisión
Qué backend mínimo y real tendrá el sitio (ver conversación): define qué servicios aparecen en la tabla de arquitectura, los guardrails y la sección de privacidad.
