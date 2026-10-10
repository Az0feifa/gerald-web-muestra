'use strict';
// Progressive enhancement: the full conceptual scope is readable without JS.
document.documentElement.classList.add('js');
const services = {
  hogar: {label:'HOGAR', title:'Para los espacios que usted vive.', description:'Una consulta sobre pisos, superficies accesibles, cocina y baños. Las prioridades y los materiales definirían el alcance de la visita.', limit:'Por confirmar: productos, frecuencia y condiciones del espacio.', alt:'Sala con sofá y superficies de madera, como ejemplo de un hogar.'},
  oficina: {label:'OFICINA', title:'Un lugar para concentrarse.', description:'Una consulta sobre superficies de trabajo despejadas, pisos y áreas compartidas. Equipos, documentos y objetos personales quedarían fuera del alcance conceptual.', limit:'Por confirmar: horarios, acceso y zonas que no deben intervenirse.', alt:'Oficina luminosa con mesas de trabajo y plantas, como ejemplo de un espacio laboral.'},
  detalle: {label:'A FONDO', title:'Más atención donde hace falta.', description:'Una consulta para atender una zona específica, como cocina o baños. El material, su estado y las necesidades definirían qué es posible realizar.', limit:'No se presupone limpieza especializada, desinfección certificada ni trabajo en altura.', alt:'Cocina con isla y gabinetes blancos, como ejemplo de superficies por consultar.'}
};
const serviceButtons = document.querySelectorAll('[data-service]');
const serviceDetail = document.querySelector('#service-detail');
const serviceImage = document.querySelector('#service-image');
serviceButtons.forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.service;
  const service = services[key];
  serviceButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  serviceDetail.querySelector('.eyebrow').textContent = `ALCANCE CONCEPTUAL / ${service.label}`;
  serviceDetail.querySelector('h3').textContent = service.title;
  serviceDetail.querySelector('h3 + p').textContent = service.description;
  serviceDetail.querySelector('.service-limit').textContent = service.limit;
  const imageKey = key === 'hogar' ? 'sala' : key;
  serviceImage.srcset = `./assets/${imageKey}-640.webp 640w, ./assets/${imageKey}-1280.webp 1280w`;
  serviceImage.src = `./assets/${imageKey}-1280.webp`;
  serviceImage.alt = service.alt;
  document.querySelector('#image-context').textContent = `${service.label} / ESPACIO ILUSTRATIVO`;
  serviceImage.classList.remove('changed');
  requestAnimationFrame(() => serviceImage.classList.add('changed'));
}));

const preparer = document.querySelector('#preparer');
const sizeChoice = document.querySelector('#tamano');
const reviewStatus = document.querySelector('#review-status');
const summary = document.querySelector('#summary');
preparer.hidden = false;
function updateSummary() {
  document.querySelector('#summary-space').textContent = preparer.querySelector('[name="espacio"]:checked').value;
  const needs = Array.from(preparer.querySelectorAll('[name="prioridad"]:checked'), input => input.value);
  document.querySelector('#summary-needs').textContent = needs.length ? needs.join(' · ') : 'Elija las zonas que le interesan.';
  document.querySelector('#summary-size').textContent = sizeChoice.value;
  reviewStatus.textContent = 'El resumen cambia con sus elecciones.';
}
preparer.addEventListener('change', updateSummary);
document.querySelector('#review').addEventListener('click', () => {
  reviewStatus.textContent = 'Resumen revisado. Puede ajustar sus elecciones.';
  summary.focus();
});
document.querySelector('#reset').addEventListener('click', () => {
  preparer.querySelector('[name="espacio"][value="Hogar"]').checked = true;
  preparer.querySelectorAll('[name="prioridad"]').forEach(input => { input.checked = false; });
  sizeChoice.value = 'Por definir';
  updateSummary();
  reviewStatus.textContent = 'Elecciones reiniciadas. Puede preparar otro ejemplo.';
});
