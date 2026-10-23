// main.js — pinta servicios, pide las horas libres al backend y reserva la cita
const $ = (id) => document.getElementById(id);
const COP = (n) => `$${n.toLocaleString('es-CO')} COP`;
const esc = (t) => String(t).replace(/[&<>"']/g, (m) => `&#${m.charCodeAt(0)};`);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toast = (html) => M.toast({ html, classes: 'rounded red darken-2' });
async function api(url, opciones) {
  const r = await fetch(url, opciones);
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'Error de servidor');
  return j;
}

let fechaSel = null;
let horaSel = null;
const elegidos = () => [...document.querySelectorAll('#servicios-check input:checked')].map((i) => i.value);

function pintarServicios(servicios) {
  $('services-grid').innerHTML = servicios.map((s) => `
    <div class="col s12 m6 l4"><div class="card service-card ${s.destacado ? 'destacado' : ''}">
      <div class="card-image">${s.destacado ? '<span class="badge-destacado">Destacado</span>' : ''}
        <img src="${s.imagen}" alt="${s.nombre}"><span class="card-title">${s.nombre}</span></div>
      <div class="card-content"><span class="categoria-tag">${s.categoria} · ${s.duracion} min</span><span class="precio">${COP(s.precio)}</span>
        <ul class="incluye-list">${s.incluye.map((i) => `<li><i class="material-icons">check</i>${i}</li>`).join('')}</ul></div>
      <div class="card-action"><a href="#agendar" class="reservar-servicio" data-id="${s.id}">Reservar</a></div>
    </div></div>`).join('');
  $('servicios-check').innerHTML = servicios.map((s) =>
    `<p><label><input type="checkbox" value="${s.id}"><span>${s.nombre} · ${s.duracion} min · ${COP(s.precio)}</span></label></p>`).join('');
}

function pintarBarbero(b) {
  const wa = `https://wa.me/${b.whatsapp}?text=${encodeURIComponent(`Hola ${b.nombre}, quiero agendar una cita en Arsene Barber.`)}`;
  $('team-star').innerHTML = `<div class="col s12 m10 offset-m1"><div class="star-card">
    <div class="star-photo"><img src="${b.foto}" alt="${b.nombre}"></div>
    <div class="star-body"><span class="tag">Barbero estrella</span><h3>${b.nombre}</h3><p class="especialidad">${b.especialidad}</p>
    <a href="${wa}" target="_blank" rel="noopener" class="btn-large waves-effect">Escríbele por WhatsApp</a></div></div></div>`;
  $('whatsapp-float').href = wa;
}

async function cargarHoras() {
  horaSel = null;
  if (!elegidos().length || !fechaSel) { $('horas').innerHTML = '<p class="hint">Elige servicios y un día para ver las horas libres.</p>'; return; }
  try {
    const { horas, duracion } = await api(`/api/disponibilidad?fecha=${fechaSel}&barbero=${$('barbero-select').value}&servicios=${elegidos().join(',')}`);
    $('horas').innerHTML = horas.length
      ? `<p class="hint">Tu cita dura ${duracion} min. Almuerzo de 12:00 a 1:00 pm.</p>` + horas.map((h) => `<button type="button" class="hora-chip" data-h="${h}">${h}</button>`).join('')
      : '<p class="hint">No quedan horas libres ese día. Prueba con otro día.</p>';
  } catch (e) { $('horas').innerHTML = `<p class="hint">${esc(e.message)}</p>`; }
}

function mostrarConfirmacion(c) {
  const ini = new Date(`${c.fecha}T${c.hora}:00-05:00`);
  const fin = new Date(ini.getTime() + c.duracion * 60000);
  const f = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Cita en Arsene Barber')}&dates=${f(ini)}/${f(fin)}&location=${encodeURIComponent('Av. Calle 147 #7c-75, Bogotá')}`;
  $('confirmacion').innerHTML = `<div class="confirmada"><h5>¡Cita confirmada, ${esc(c.nombre)}!</h5>
    <p>${c.fecha} a las ${c.hora} (${c.duracion} min)</p>
    <a class="btn" target="_blank" rel="noopener" href="${google}">Agregar a Google Calendar</a>
    <a class="btn" href="/api/citas/${c.id}.ics">Agregar al iPhone / Outlook</a></div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [servicios, barberos] = await Promise.all([api('/api/servicios'), api('/api/barberos')]);
    pintarServicios(servicios);
    pintarBarbero(barberos[0]);
    $('barbero-select').innerHTML = barberos.map((b) => `<option value="${b.id}">${b.nombre}</option>`).join('');
  } catch { return toast('No se pudo conectar con el servidor.'); }

  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.FormSelect.init(document.querySelectorAll('select'));
  M.Datepicker.init($('fecha'), {
    format: 'dd/mm/yyyy', minDate: new Date(), yearRange: 1, disableDayFn: (d) => d.getDay() === 0,
    onSelect: (d) => { fechaSel = iso(d); cargarHoras(); },
    i18n: { months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'], monthsShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], weekdays: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'], weekdaysShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'], weekdaysAbbrev: ['D','L','M','M','J','V','S'], done: 'Listo', cancel: 'Cancelar' },
  });

  $('servicios-check').addEventListener('change', cargarHoras);
  $('barbero-select').addEventListener('change', cargarHoras);
  $('horas').addEventListener('click', (e) => {
    const chip = e.target.closest('.hora-chip');
    if (!chip) return;
    horaSel = chip.dataset.h;
    document.querySelectorAll('.hora-chip').forEach((c) => c.classList.toggle('activa', c === chip));
  });
  $('services-grid').addEventListener('click', (e) => {
    const a = e.target.closest('.reservar-servicio');
    if (!a) return;
    document.querySelector(`#servicios-check input[value="${a.dataset.id}"]`).checked = true;
    cargarHoras();
  });

  $('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cita = { nombre: $('nombre').value, telefono: $('telefono').value, email: $('email').value, barbero: $('barbero-select').value, servicios: elegidos(), fecha: fechaSel, hora: horaSel };
    if (!cita.servicios.length || !fechaSel || !horaSel) return toast('Elige servicios, día y hora.');
    try {
      const c = await api('/api/citas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cita) });
      e.target.reset(); M.updateTextFields(); M.FormSelect.init(document.querySelectorAll('select'));
      fechaSel = null; await cargarHoras(); mostrarConfirmacion(c);
    } catch (err) { toast(err.message); cargarHoras(); }
  });
});
