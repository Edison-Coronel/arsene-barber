// Barbero.js — hereda de Usuario
import Usuario from './Usuario.js';

export default class Barbero extends Usuario {
  constructor({ nombre, email, contrasena = null, especialidad, whatsapp, fotoUrl, esEstrella = false }) {
    super({ nombre, email, contrasena });
    this.especialidad = especialidad;
    this.whatsapp = whatsapp; // formato internacional sin '+', ej: '573001234567'
    this.fotoUrl = fotoUrl;
    this.esEstrella = esEstrella;
    this.agenda = [];
  }

  tieneDisponibilidad(fechaISO) {
    return !this.agenda.includes(fechaISO);
  }

  asignarCita(cita) {
    this.agenda.push(cita.fechaISO);
  }

  get linkWhatsapp() {
    const mensaje = encodeURIComponent(
      `Hola ${this.nombre}, quiero agendar una cita en Arsene Barber.`
    );
    return `https://wa.me/${this.whatsapp}?text=${mensaje}`;
  }
}

// Barbero estrella de la casa, usado por el botón flotante de WhatsApp y la sección de equipo
export const CRISTIAN_SUAREZ = new Barbero({
  nombre: 'Cristian Suárez',
  email: 'cristian.suarez@arsenebarber.com',
  especialidad: 'Barbero estrella — cortes VIP y diseño de barba',
  whatsapp: '573001234567', // TODO: reemplazar por el número real de contacto
  fotoUrl: 'assets/img/team/cristian-suarez.jpeg',
  esEstrella: true,
});
