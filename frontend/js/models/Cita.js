// Cita.js — asocia Cliente + Barbero + Servicio (composición, no herencia)
import Cliente from './Cliente.js';
import Barbero from './Barbero.js';
import Servicio from './Servicio.js';

let correlativo = 0;

export default class Cita {
  constructor({ cliente, barbero, servicio, fecha }) {
    if (!(cliente instanceof Cliente)) {
      throw new TypeError('Cita.cliente debe ser una instancia de Cliente.');
    }
    if (!(barbero instanceof Barbero)) {
      throw new TypeError('Cita.barbero debe ser una instancia de Barbero.');
    }
    if (!(servicio instanceof Servicio)) {
      throw new TypeError('Cita.servicio debe ser una instancia de Servicio.');
    }
    if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) {
      throw new TypeError('Cita.fecha debe ser una fecha válida.');
    }

    this.id = `CITA-${Date.now()}-${++correlativo}`;
    this.cliente = cliente;
    this.barbero = barbero;
    this.servicio = servicio;
    this.fecha = fecha;
    this.estado = 'pendiente'; // pendiente | confirmada | cancelada
  }

  get fechaISO() {
    return this.fecha.toISOString().slice(0, 10);
  }

  confirmar() {
    if (!this.barbero.tieneDisponibilidad(this.fechaISO)) {
      throw new Error(`${this.barbero.nombre} ya tiene una cita ese día.`);
    }
    this.estado = 'confirmada';
    this.cliente.registrarCita(this);
    this.barbero.asignarCita(this);
    return this;
  }

  cancelar() {
    this.estado = 'cancelada';
    return this;
  }

  get resumen() {
    const fechaLegible = this.fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    return `${this.servicio.nombre} con ${this.barbero.nombre} — ${fechaLegible}`;
  }
}
