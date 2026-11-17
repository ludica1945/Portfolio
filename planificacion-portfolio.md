# Punto 01: Planificación del portafolio (Javier Aguirre)

Plan escrito antes de programar, a partir de la investigación de portafolios reales (ver `inspiracion.html`).

## Qué observé en los portafolios de referencia
- Todos tienen una presentación clara, proyectos con descripción corta y tecnologías, y un contacto visible.
- Los mejores usan un solo color de acento y mucho espacio en blanco (u oscuro), sin saturar de información.
- Cuentan una historia personal, no solo una lista de herramientas.

## Secciones y contenido

| Sección | Qué va |
|---|---|
| **Hero / Presentación** | Nombre, título "Estudiante de Tecnicatura en Programación", avatar animado (usuario Ludica45), frase corta y botón a proyectos. |
| **01 Sobre mí** | Quién soy, qué estudio, qué me interesa; "misión actual" (desarrollo de sitios web dinámicos) y datos rápidos. |
| **02 Proyectos** | 8 proyectos de lo más reciente a lo más antiguo, cada uno con nombre y fecha, descripción, tecnologías y captura/enlace. Filtro por categoría. |
| **03 Habilidades** | Desarrollo web (HTML, CSS, JavaScript, PHP), Python, MySQL, herramientas (VS Code, Figma), habilidades personales, idiomas e intereses. |
| **04 Formación** | Tecnicatura en Programación, EEST N.º 5 (2023-2027), con el logo de la escuela. |
| **05 Contacto** | Formulario (nombre, email, mensaje) con Formspree, email, teléfono y ubicación. |
| **Inspiración** (2.ª página) | 3 portafolios de referencia con URL, decisiones de diseño, qué aprendí y enlace de regreso. |

## Interactividad con JavaScript (Punto 07)
- B: navbar que cambia al hacer scroll (`window.onscroll`).
- C: validación del formulario sin `alert()`.
- D: animación de aparición al hacer scroll (`IntersectionObserver`).
- Extra: filtro de proyectos, menú móvil, fondo animado y música con botones de control.

## Decisiones de diseño
- Paleta nocturna (índigo / lila) con acento dorado, tomada del fondo animado.
- Tipografía Monocraft (pixel) para todo el sitio.
- Video de fondo silenciado y tenue; música que empieza al entrar (o con la primera interacción) y se puede silenciar.

## Pendientes de entrega (Puntos 04 y 05)
- [ ] Crear el formulario en formspree.io y reemplazar `REEMPLAZAR_CON_TU_ID` en el atributo `action` de `index.html`.
- [ ] Probar el envío y comprobar que llega el mail.
- [ ] Subir los archivos a un repositorio público `tu-usuario.github.io` con `index.html` en la raíz y activar GitHub Pages.
