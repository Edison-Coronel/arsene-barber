// Cliente.js — hereda de Usuario
import Usuario from './Usuario.js';

export default class Cliente extends Usuario {
  constructor({ nombre, email, contrasena = null, telefono }) {
    super({ nombre, email, contrasena });
    this.telefono = telefono;
    this.historialCitas = [];
  }

  registrarCita(cita) {
    this.historialCitas.push(cita);
  }

  get totalVisitas() {
    return this.historialCitas.length;
  }

  get esClienteFrecuente() {
    return this.totalVisitas >= 3;
  }
}
