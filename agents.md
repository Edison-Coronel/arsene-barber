# AGENTS.md — Arsène Barber
### Reglas del proyecto bajo Spec-Driven Development (SDD)

Este documento es la **constitución técnica** del proyecto. Cualquier agente
(humano o IA) que modifique este repositorio debe leerlo primero y respetar
sus contratos. Ningún cambio de código debe contradecir lo aquí escrito sin
antes actualizar este archivo.

---

## 1. Misión y marca

- **Marca:** Arsène Barber.
- **Tagline:** "Más que un corte, una declaración de estilo."
- **Identidad visual:** Minimalismo de lujo, estética cinematográfica.
- **Paleta oficial (no negociable):**
  | Token          | Valor      | Uso                                   |
  |----------------|------------|----------------------------------------|
  | `--black`      | `#1a1a1a`  | Fondos principales, navbar, footer     |
  | `--gold`       | `#c9a24b`  | Acentos, tipografía destacada, CTAs    |
  | `--gray`       | `#8c8681`  | Texto secundario, bordes               |
  | `--bone`       | `#f3efe6`  | Texto sobre fondo oscuro               |
- **Barbero estrella:** Cristian Suárez.

Cualquier PR que introduzca colores fuera de esta paleta debe ser rechazado
en revisión, salvo variaciones de opacidad/tono del mismo token.

---

## 2. Arquitectura de carpetas

```
/
├── index.html
├── agents.md
├── css/
│   └── styles.css
├── js/
│   ├── models/         # Entidades del dominio (POO pura, sin DOM)
│   │   ├── Usuario.js
│   │   ├── Cliente.js
│   │   ├── Barbero.js
│   │   ├── Servicio.js
│   │   └── Cita.js
│   ├── controllers/     # Orquestan modelos + DOM (reservado para crecimiento)
│   ├── services/        # Lógica de negocio/infra futura (API, storage, etc.)
│   └── main.js           # Orquestador de arranque de la app
└── assets/
    └── img/
        ├── logo.png
        ├── hero-bg.jpg
        ├── services/*.jpg
        └── team/*.jpg
```

**Regla de dependencia:** `models` nunca importa de `controllers` ni de
`main.js`. El flujo de dependencias es siempre
`main.js → controllers → services → models`.

> Nota de convención: en la v1 del proyecto, `Servicio.js` vive en
> `js/models/` porque representa una entidad de dominio pura (no tiene
> lógica de infraestructura). La carpeta `js/services/` queda reservada
> para lógica de negocio orientada a procesos (ej. `AgendaService.js`,
> `NotificacionService.js`) cuando el proyecto crezca más allá de esta
> landing page.

---

## 3. Convenciones de código

- **Módulos:** ES6 estrictos (`import`/`export`). Prohibido usar `require`.
- **Nombres de clase:** `PascalCase` en español (dominio del negocio es
  hispanohablante): `Usuario`, `Cliente`, `Barbero`, `Servicio`, `Cita`.
- **Nombres de archivo:** igual al nombre de la clase exportada por defecto.
- **Encapsulamiento:** campos sensibles usan `#privado` (sintaxis nativa de
  clases privadas de JS). Ejemplo obligatorio: `Usuario#contrasena`.
- **Herencia:** `Cliente` y `Barbero` **extienden** de `Usuario`. No se
  duplica lógica de identidad (nombre, email, contraseña) en las subclases.
- **Sin `var`.** Usar `const` por defecto, `let` solo si hay reasignación.
- **Rutas de assets:** siempre relativas a la raíz del proyecto (sin `../`),
  tal como se documentan en la sección 4.

---

## 4. Contrato de assets (rutas exactas)

| Elemento                    | Ruta obligatoria                              |
|------------------------------|-----------------------------------------------|
| Logo (navbar y footer)       | `assets/img/logo.png`                          |
| Fondo del Hero                | `assets/img/hero-bg.jpg`                        |
| Imagen de cada servicio       | `assets/img/services/<slug-del-servicio>.jpg`   |
| Foto de barbero                | `assets/img/team/<slug-del-barbero>.jpg`        |

El slug de cada servicio se define en `js/models/Servicio.js` dentro de
`CATALOGO_SERVICIOS` y debe coincidir 1:1 con el nombre del archivo de
imagen. No se permiten nombres de archivo distintos al slug.

---

## 5. UI avanzada — contratos de comportamiento

- **Datepicker:** debe usar exclusivamente la paleta oro/negro definida en
  `css/styles.css` (selectores `.datepicker-date-display`,
  `.datepicker-calendar-container`, `.datepicker-table td.is-selected`).
  No se permite el tema azul por defecto de Materialize en producción.
- **Botón flotante de WhatsApp:** clases `btn-floating btn-large green
  pulse`, siempre enlazado al número del barbero estrella
  (`Barbero.linkWhatsapp`, expuesto por `CRISTIAN_SUAREZ`). El link se
  genera dinámicamente en `main.js`, nunca se hardcodea el número en el
  HTML.
- **Cards de servicio:** se renderizan dinámicamente desde
  `CATALOGO_SERVICIOS`. Está prohibido hardcodear tarjetas de servicio en
  `index.html`; el HTML solo define el contenedor (`#services-grid`).

---

## 6. Definición de "hecho" (Definition of Done)

Un cambio se considera terminado cuando:

1. No introduce colores fuera de la paleta oficial (sección 1).
2. Respeta el flujo de dependencias de módulos (sección 2).
3. Todas las clases de dominio nuevas siguen el contrato de POO (sección 3).
4. Las rutas de imágenes nuevas siguen el contrato de assets (sección 4).
5. La página se ve correctamente en móvil (`s12`), tablet (`m6`/`m4`) y
   escritorio (`l3`/`l4`), sin scroll horizontal.
6. El formulario de agendamiento crea instancias reales de `Cliente` y
   `Cita` (no solo muestra un toast falso).

---

## 7. Fuera de alcance (v1)

- Backend / persistencia real (no hay API todavía; `Usuario#contrasena`
  vive solo en memoria, nunca se debe enviar a un backend real sin hashing).
- Autenticación de clientes.
- Internacionalización (el sitio es 100% español, mercado Bogotá).
