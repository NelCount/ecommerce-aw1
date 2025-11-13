// js/data/experiencias.js
// Catálogo de experiencias 
const EXPERIENCIAS = [
  {
    id: "exp_walking_tour",
    categoria: "ciudad",                     
    badgeClass: "badge--city",                
    titulo: "Walking Tour: Casco Histórico",
    descripcion: "Recorré los principales puntos históricos con guía local y tips para descubrir rincones ocultos.",
    ubicacion: "Centro",
    duracion: "2 h",
    rating: 4.3,
    precioPorPersona: 12500,
    img: "../images/ciudad-01.avif",
    minPersonas: 1,
    maxPersonas: 10
  },
  {
    id: "exp_aventura_trekking",
    categoria: "aventura",
    badgeClass: "badge--adventure",
    titulo: "Trekking en Sierras Chicas",
    descripcion: "Senderos con miradores y cascadas. Incluye guía y seguro.",
    ubicacion: "Sierras Chicas",
    duracion: "3 h",
    rating: 4.6,
    precioPorPersona: 18000,
    img: "../images/aventura-01.avif",
    minPersonas: 1,
    maxPersonas: 8
  },
  {
    id: "exp_sabores_enoturismo",
    categoria: "sabores",
    badgeClass: "badge--sabores",
    titulo: "Tour Enoturístico",
    descripcion: "Visita a bodega con degustación. Traslado opcional.",
    ubicacion: "Colonia Caroya",
    duracion: "3 h",
    rating: 4.8,
    precioPorPersona: 22000,
    img: "../images/sabores-01.avif",
    minPersonas: 1,
    maxPersonas: 12
  }
];
