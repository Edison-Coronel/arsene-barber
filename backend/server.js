// server.js — API + sirve el frontend. Solo usa módulos que ya trae Node (sin npm install).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { horasLibres } = require('./src/disponibilidad');
const store = require('./src/store');

const FRONT = path.join(__dirname, '..', 'frontend');
const PIN = process.env.ADMIN_PIN || '1234'; // cámbialo: ADMIN_PIN=tuclave node server.js
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const datos = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', f), 'utf8'));
const enviar = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
const duracionDe = (ids) => ids.reduce((t, id) => t + (datos('servicios.json').find((s) => s.id === id)?.duracion || 0), 0);
const delDia = (fecha, barbero) => store.leer().filter((c) => c.fecha === fecha && c.barbero === barbero && c.estado !== 'cancelada');
const leerCuerpo = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { try { ok(JSON.parse(b)); } catch { ok({}); } }); });
const utc = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const p = u.pathname;
  const q = u.searchParams;

  if (p === '/api/servicios') return enviar(res, 200, datos('servicios.json'));
  if (p === '/api/barberos') return enviar(res, 200, datos('barberos.json'));

  if (p === '/api/disponibilidad') {
    const ids = (q.get('servicios') || '').split(',').filter(Boolean);
    const dur = duracionDe(ids);
    if (!dur || !/^\d{4}-\d{2}-\d{2}$/.test(q.get('fecha') || '')) return enviar(res, 400, { error: 'Elige servicios y un día válido.' });
    return enviar(res, 200, { duracion: dur, horas: horasLibres(q.get('fecha'), dur, delDia(q.get('fecha'), q.get('barbero'))) });
  }

  if (p === '/api/citas' && req.method === 'POST') {
    const b = await leerCuerpo(req);
    const ids = Array.isArray(b.servicios) ? b.servicios : [];
    const dur = duracionDe(ids);
    const valido = b.nombre && b.telefono && /^\S+@\S+\.\S+$/.test(b.email || '') && b.barbero && dur && b.fecha && b.hora;
    if (!valido) return enviar(res, 400, { error: 'Completa todos los campos con datos válidos.' });
    if (!horasLibres(b.fecha, dur, delDia(b.fecha, b.barbero)).includes(b.hora)) {
      return enviar(res, 409, { error: 'Esa hora ya no está disponible. Elige otra.' });
    }
    const cita = { id: `C${Date.now()}`, nombre: String(b.nombre).trim().slice(0, 80), email: String(b.email).trim().slice(0, 120), telefono: String(b.telefono).trim().slice(0, 20), barbero: b.barbero, servicios: ids, fecha: b.fecha, hora: b.hora, duracion: dur, estado: 'confirmada' };
    store.guardar([...store.leer(), cita]);
    return enviar(res, 201, cita);
  }

  if (p === '/api/admin/citas') {
    if (req.headers['x-pin'] !== PIN) return enviar(res, 401, { error: 'PIN incorrecto.' });
    return enviar(res, 200, store.leer().filter((c) => c.fecha === q.get('fecha')).sort((a, b) => a.hora.localeCompare(b.hora)));
  }

  const ics = p.match(/^\/api\/citas\/(C\d+)\.ics$/);
  if (ics) {
    const c = store.leer().find((x) => x.id === ics[1]);
    if (!c) return enviar(res, 404, { error: 'Cita no encontrada.' });
    const ini = new Date(`${c.fecha}T${c.hora}:00-05:00`); // hora de Bogotá
    const fin = new Date(ini.getTime() + c.duracion * 60000);
    const cuerpo = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Arsene Barber//ES', 'BEGIN:VEVENT', `UID:${c.id}@arsenebarber`, `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(ini)}`, `DTEND:${utc(fin)}`, 'SUMMARY:Cita en Arsene Barber', 'LOCATION:Av. Calle 147 #7c-75\\, Bogotá', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    res.writeHead(200, { 'Content-Type': 'text/calendar', 'Content-Disposition': 'attachment; filename="cita-arsene.ics"' });
    return res.end(cuerpo);
  }

  const archivo = path.join(FRONT, p === '/' ? 'index.html' : decodeURIComponent(p));
  if (!archivo.startsWith(FRONT) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) { res.writeHead(404); return res.end('No encontrado'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(archivo)] || 'application/octet-stream' });
  fs.createReadStream(archivo).pipe(res);
}).listen(process.env.PORT || 3000, () => console.log('Arsene Barber en http://localhost:3000'));
