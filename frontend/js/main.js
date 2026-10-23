// main.js — orquestador: pinta la UI desde el dominio e inicializa Materialize
import { CATALOGO_SERVICIOS } from './models/Servicio.js';
import { CRISTIAN_SUAREZ } from './models/Barbero.js';
import Cliente from './models/Cliente.js';
import Cita from './models/Cita.js';

function crearCardServicio(servicio) {
  const col = document.createElement('div');
  col.className = 'col s12 m6 l4';

  const incluyeHTML = servicio.incluye
    .map((item) => `<li><i class="material-icons">check</i>${item}</li>`)
    .join('');

  col.innerHTML = `
    <div class="card service-card ${servicio.destacado ? 'destacado' : ''}" data-servicio-id="${servicio.id}">
      <div class="card-image">
        ${servicio.destacado ? '<span class="badge-destacado">Destacado</span>' : ''}
        <img src="${servicio.imagen}" alt="${servicio.nombre}">
        <span class="card-title">${servicio.nombre}</span>
      </div>
      <div class="card-content">
        <span class="categoria-tag">${servicio.categoria}</span>
        <span class="precio">${servicio.precioFormateado}</span>
        <ul class="incluye-list">${incluyeHTML}</ul>
      </div>
      <div class="card-action">
        <a href="#agendar" class="reservar-servicio" data-servicio-id="${servicio.id}">Reservar</a>
      </div>
    </div>
  `;
  return col;
}

function renderServicios() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  grid.innerHTML = '';
  CATALOGO_SERVICIOS.forEach((servicio) => grid.appendChild(crearCardServicio(servicio)));
}

function renderBarberoEstrella(barbero) {
  const contenedor = document.getElementById('team-star');
  if (!contenedor) return;
  contenedor.innerHTML = `
    <div class="col s12 m10 offset-m1">
      <div class="star-card">
        <div class="star-photo">
          <img src="${barbero.fotoUrl}" alt="${barbero.nombre}">
        </div>
        <div class="star-body">
          <span class="tag">Barbero estrella</span>
          <h3>${barbero.nombre}</h3>
          <p class="especialidad">${barbero.especialidad}</p>
          <a href="${barbero.linkWhatsapp}" target="_blank" rel="noopener" class="btn-large waves-effect">
            Escríbele por WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;
}

function poblarSelectServicios() {
  const select = document.getElementById('servicio-select');
  if (!select) return;
  CATALOGO_SERVICIOS.forEach((servicio) => {
    const option = document.createElement('option');
    option.value = servicio.id;
    option.textContent = `${servicio.nombre} — ${servicio.precioFormateado}`;
    select.appendChild(option);
  });
}

function poblarSelectBarberos(barberos) {
  const select = document.getElementById('barbero-select');
  if (!select) return;
  barberos.forEach((barbero) => {
    const option = document.createElement('option');
    option.value = barbero.email;
    option.textContent = barbero.esEstrella ? `${barbero.nombre} ⭐` : barbero.nombre;
    select.appendChild(option);
  });
}

function vincularWhatsappFlotante(barbero) {
  const boton = document.getElementById('whatsapp-float');
  if (!boton) return;
  boton.href = barbero.linkWhatsapp;
}

function inicializarMaterialize() {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.FormSelect.init(document.querySelectorAll('select'));

  M.Datepicker.init(document.querySelectorAll('.datepicker'), {
    format: 'dd/mm/yyyy',
    minDate: new Date(),
    yearRange: 1,
    i18n: {
      months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      monthsShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      weekdays: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
      weekdaysShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
      weekdaysAbbrev: ['D','L','M','M','J','V','S'],
      done: 'Listo',
      cancel: 'Cancelar',
    },
  });
}

function manejarEnvioFormulario(barberos) {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const servicioId = document.getElementById('servicio-select').value;
    const barberoEmail = document.getElementById('barbero-select').value;
    const fechaTexto = document.getElementById('fecha').value;

    if (!nombre || !telefono || !email || !servicioId || !barberoEmail || !fechaTexto) {
      M.toast({ html: 'Por favor completa todos los campos.', classes: 'rounded red darken-2' });
      return;
    }

    try {
      const cliente = new Cliente({ nombre, email, telefono });
      const servicio = CATALOGO_SERVICIOS.find((s) => s.id === servicioId);
      const barbero = barberos.find((b) => b.email === barberoEmail);

      const [dia, mes, anio] = fechaTexto.split('/').map(Number);
      const fecha = new Date(anio, mes - 1, dia);

      const cita = new Cita({ cliente, barbero, servicio, fecha });
      cita.confirmar();

      M.toast({
        html: `¡Gracias ${cliente.nombre}! Cita confirmada: ${cita.resumen}`,
        classes: 'rounded',
        displayLength: 5000,
      });

      form.reset();
      M.updateTextFields();
      M.FormSelect.init(document.querySelectorAll('select'));
    } catch (error) {
      M.toast({ html: error.message, classes: 'rounded red darken-2' });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const barberos = [CRISTIAN_SUAREZ];

  renderServicios();
  renderBarberoEstrella(CRISTIAN_SUAREZ);
  poblarSelectServicios();
  poblarSelectBarberos(barberos);
  vincularWhatsappFlotante(CRISTIAN_SUAREZ);

  inicializarMaterialize();
  manejarEnvioFormulario(barberos);
});
