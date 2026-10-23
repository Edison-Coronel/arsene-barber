// store.js — guarda las citas en un archivo JSON (cambiable luego por MySQL sin tocar el resto)
const fs = require('fs');
const path = require('path');
const ARCHIVO = path.join(__dirname, '..', 'data', 'citas.json');
const leer = () => { try { return JSON.parse(fs.readFileSync(ARCHIVO, 'utf8')); } catch { return []; } };
const guardar = (citas) => fs.writeFileSync(ARCHIVO, JSON.stringify(citas, null, 2));
module.exports = { leer, guardar };
