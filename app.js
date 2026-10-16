'use strict';
// Progressive enhancement: every section is readable and every CTA works without JS.
document.documentElement.classList.add('js');

const WA_NUMBER = '50672987020';
const waLink = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const buzz = ms => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (_) { /* unsupported */ } };

/* Header background once the page scrolls */
const header = document.querySelector('#header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Scroll reveal fallback for browsers without scroll-driven animations */
if (!CSS.supports('animation-timeline: view()') && 'IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add('pending');
      revealObserver.observe(el);
    }
  });
}

/* Service cards: progress bar while swiping */
const track = document.querySelector('#cards-track');
const trackBar = document.querySelector('#track-bar');
let trackTick = false;
track.addEventListener('scroll', () => {
  if (trackTick) return;
  trackTick = true;
  requestAnimationFrame(() => {
    const max = track.scrollWidth - track.clientWidth;
    trackBar.style.setProperty('--p', max > 0 ? (track.scrollLeft / max).toFixed(3) : '0');
    trackTick = false;
  });
}, { passive: true });

/* Subtle 3D tilt on desktop pointers */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
}

/* Quote wizard */
const form = document.querySelector('#wizard-form');
const steps = Array.from(form.querySelectorAll('.step'));
const backBtn = document.querySelector('#wizard-back');
const nextBtn = document.querySelector('#wizard-next');
const sendBtn = document.querySelector('#wizard-send');
const countLabel = document.querySelector('#wizard-count');
const progressBar = document.querySelector('#wizard-bar');
const status = document.querySelector('#wizard-status');
const TOTAL = 3;
let current = 1;

function readChoices() {
  const espacio = form.querySelector('[name="espacio"]:checked')?.value || 'Hogar';
  const zonas = Array.from(form.querySelectorAll('[name="zona"]:checked'), input => input.value);
  const tamano = form.querySelector('[name="tamano"]:checked')?.value || 'Por definir';
  return { espacio, zonas, tamano };
}

function updateSummary() {
  const { espacio, zonas, tamano } = readChoices();
  const zonaText = zonas.length ? zonas.join(', ') : 'Por definir';
  document.querySelector('#sum-espacio').textContent = espacio;
  document.querySelector('#sum-zona').textContent = zonaText;
  document.querySelector('#sum-tamano').textContent = tamano;
  sendBtn.href = waLink(
    'Hola Gerald, vi la muestra web de LimpiaPro y probé el cotizador:\n' +
    `• Espacio: ${espacio}\n• Prioridades: ${zonaText}\n• Tamaño: ${tamano}\n\n` +
    'Así me llegarían los clientes. Quiero una web así para mi negocio.'
  );
}

function render(focus) {
  const done = current > TOTAL;
  steps.forEach(step => step.classList.toggle('is-active', Number(step.dataset.step) === current));
  form.classList.toggle('is-done', done);
  backBtn.hidden = current === 1;
  nextBtn.hidden = done;
  nextBtn.firstChild.textContent = current === TOTAL ? 'Ver resumen ' : 'Siguiente ';
  countLabel.textContent = done ? 'Resumen' : `Paso ${current} de ${TOTAL}`;
  progressBar.style.setProperty('--progress', String(Math.min(current, TOTAL + 1) / (TOTAL + 1)));
  if (done) updateSummary();
  status.textContent = done ? 'Resumen listo para enviar por WhatsApp.' : `Paso ${current} de ${TOTAL}.`;
  if (focus) {
    const active = steps[current - 1];
    const target = done ? active : active.querySelector('input:checked, input');
    target?.focus({ preventScroll: true });
  }
}

function go(delta) {
  const update = () => { current = Math.min(Math.max(current + delta, 1), TOTAL + 1); render(true); };
  buzz(8);
  if (document.startViewTransition && !reduceMotion) document.startViewTransition(update);
  else update();
}

nextBtn.addEventListener('click', () => go(1));
backBtn.addEventListener('click', () => go(-1));
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('change', () => { buzz(6); updateSummary(); });

/* "Cotizar" links on service cards preselect the wizard */
document.querySelectorAll('[data-preset]').forEach(link => link.addEventListener('click', () => {
  const preset = link.dataset.preset;
  const space = preset === 'Oficina' ? 'Oficina' : 'Hogar';
  form.querySelector(`[name="espacio"][value="${space}"]`).checked = true;
  form.querySelector('[name="zona"][value="Limpieza a fondo"]').checked = preset === 'A fondo';
  current = 1;
  render(false);
  updateSummary();
}));

render(false);
updateSummary();

/* WhatsApp dock: visible after the hero, hidden while the quote wizard or the pitch is on screen */
const dock = document.querySelector('#dock');
if ('IntersectionObserver' in window) {
  const visible = { hero: true, quote: false, pitch: false };
  const sync = () => dock.classList.toggle('show', !visible.hero && !visible.quote && !visible.pitch);
  const watch = (selector, key) => new IntersectionObserver(([entry]) => {
    visible[key] = entry.isIntersecting;
    sync();
  }).observe(document.querySelector(selector));
  watch('.hero-copy', 'hero');
  watch('#wizard', 'quote');
  watch('#tu-web', 'pitch');
} else {
  dock.classList.add('show');
}

/* Real load time on this device, shown in the pitch section */
window.addEventListener('load', () => setTimeout(() => {
  const nav = performance.getEntriesByType?.('navigation')[0];
  const ms = nav ? (nav.loadEventStart || nav.domContentLoadedEventEnd) : 0;
  if (!(ms > 0)) return;
  const speed = document.querySelector('#speed');
  const value = document.querySelector('#speed-value');
  const format = t => `${(t / 1000).toFixed(2).replace('.', ',')} s`;
  value.textContent = format(ms);
  speed.hidden = false;
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const counter = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    counter.disconnect();
    const start = performance.now();
    const tick = now => {
      const k = Math.min((now - start) / 900, 1);
      value.textContent = format(ms * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.6 });
  counter.observe(speed);
}, 0));
