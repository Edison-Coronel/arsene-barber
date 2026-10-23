// Usuario.js — clase base del dominio (encapsulamiento con campo privado)
export default class Usuario {
  #contrasena;

  constructor({ nombre, email, contrasena }) {
    if (!nombre || !email) {
      throw new Error('Usuario requiere al menos nombre y email.');
    }
    this.nombre = nombre;
    this.email = email;
    this.#contrasena = contrasena ?? null;
    this.fechaRegistro = new Date();
  }

  verificarContrasena(intento) {
    return intento === this.#contrasena;
  }

  cambiarContrasena(actual, nueva) {
    if (!this.verificarContrasena(actual)) {
      throw new Error('La contraseña actual no coincide.');
    }
    this.#contrasena = nueva;
    return true;
  }

  get identidad() {
    return `${this.nombre} <${this.email}>`;
  }
}
