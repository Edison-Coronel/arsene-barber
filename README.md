# Arsene Barber

Sistema de citas para barbería: el cliente elige servicios, día y hora libre; el barbero ve su agenda.

## Estructura
- `frontend/` página web (HTML, CSS, JS) y `barbero.html` (agenda del barbero)
- `backend/` servidor en Node.js: horas libres, citas y archivos de calendario (.ics)
- `docs/` informe, mapa de navegación

## Cómo correrlo
1. Instala Node.js (versión 18 o superior).
2. En la carpeta `backend`: `node server.js`
3. Abre http://localhost:3000 (agenda del barbero en /barbero.html).

El PIN del barbero es `1234` por defecto. Cámbialo: `ADMIN_PIN=tuclave node server.js` (en Windows: `set ADMIN_PIN=tuclave` y luego `node server.js`).
Horario y almuerzo se ajustan en `backend/src/disponibilidad.js`; duraciones en `backend/data/servicios.json`.
