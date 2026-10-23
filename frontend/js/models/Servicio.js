// Servicio.js — entidad de dominio + catálogo real (única fuente de verdad para las Cards)
export default class Servicio {
  constructor({ id, nombre, precio, categoria, incluye = [], imagen, destacado = false }) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.incluye = incluye;
    this.imagen = imagen ?? `assets/img/services/${id}.jpeg`;
    this.destacado = destacado;
  }

  get precioFormateado() {
    return `$${this.precio.toLocaleString('es-CO')} COP`;
  }
}

export const CATALOGO_SERVICIOS = [
  new Servicio({
    id: 'corte-arsene-vip',
    nombre: 'Corte Arsene VIP',
    precio: 50000,
    categoria: 'Cortes',
    incluye: ['Corte detallado', 'Asesoría de imagen', 'Masajes', 'Mascarilla', 'Bebida de cortesía'],
    destacado: true,
  }),
  new Servicio({
    id: 'corte-arsene-superior',
    nombre: 'Corte Arsene Superior',
    precio: 40000,
    categoria: 'Cortes',
    incluye: ['Corte detallado', 'Mascarilla con fototerapia', 'Masaje de hombros'],
  }),
  new Servicio({
    id: 'corte-arsene-premium',
    nombre: 'Corte Arsene Premium',
    precio: 32000,
    categoria: 'Cortes',
    incluye: ['Corte sencillo', 'Shampoo', 'Peinado'],
  }),
  new Servicio({
    id: 'corte-arsene',
    nombre: 'Corte Arsene',
    precio: 28000,
    categoria: 'Cortes',
    incluye: ['Corte de cabello sencillo'],
  }),
  new Servicio({
    id: 'mascarilla-facial',
    nombre: 'Mascarilla Facial',
    precio: 30000,
    categoria: 'Facial',
    incluye: ['Limpieza facial', 'Vapor de ozono', 'Fototerapia'],
  }),
  new Servicio({
    id: 'barba-arsene-vip',
    nombre: 'Barba Arsene VIP',
    precio: 22000,
    categoria: 'Barba',
    incluye: ['Arreglo detallado', 'Vapor', 'Shaver', 'Bebida de cortesía'],
    destacado: true,
  }),
  new Servicio({
    id: 'barba-arsene-premium',
    nombre: 'Barba Arsene Premium',
    precio: 18000,
    categoria: 'Barba',
    incluye: ['Arreglo de barba', 'Vapor', 'Rasurado', 'Aceites'],
  }),
  new Servicio({
    id: 'barba-arsene',
    nombre: 'Barba Arsene',
    precio: 14000,
    categoria: 'Barba',
    incluye: ['Arreglo de vello facial', 'Rasurado'],
  }),
];
