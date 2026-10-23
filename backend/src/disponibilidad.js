// disponibilidad.js — calcula las horas libres de un barbero para un día
const HORARIO = { dias: [1, 2, 3, 4, 5, 6], abre: 600, cierra: 1110, paso: 30, bloqueos: [[720, 780]] }; // lun-sáb 10:00-18:30, almuerzo 12:00-13:00
const aMin = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };

function horasLibres(fecha, duracion, citas, ahora = new Date()) {
  const [y, m, d] = fecha.split('-').map(Number);
  const dia = new Date(y, m - 1, d);
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  if (!HORARIO.dias.includes(dia.getDay()) || dia < hoy) return [];
  const ocupado = [...HORARIO.bloqueos, ...citas.map((c) => [aMin(c.hora), aMin(c.hora) + c.duracion])];
  const minAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const libres = [];
  for (let t = HORARIO.abre; t + duracion <= HORARIO.cierra; t += HORARIO.paso) {
    if (dia.getTime() === hoy.getTime() && t <= minAhora) continue;
    if (ocupado.every(([a, b]) => t + duracion <= a || t >= b)) {
      libres.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
    }
  }
  return libres;
}
module.exports = { horasLibres };
