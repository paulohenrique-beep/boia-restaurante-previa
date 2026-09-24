// Dados de contato e funcionamento: edite este objeto para atualizar toda a página.
const CONTACT = {
  address: 'Rua José Avena, 1 — Horto Florestal, Salvador/BA, CEP 40295-510',
  addressShort: 'Rua José Avena, 1 · Horto Florestal, Salvador/BA',
  hours: [
    'Terça a sábado: 12h–16h e 18h30–23h',
    'Domingo: 12h–16h',
    'Segunda: fechado'
  ],
  hoursShort: 'Terça a sábado · 12h–16h e 18h30–23h',
  reservationPhone: '(71) 99694-2630',
  reservationDigits: '5571996942630',
  telephone: '(71) 3032-1482',
  telephoneDigits: '557130321482',
  email: 'contato@grupoboiarestaurantes.com',
  mapsUrl: 'https://www.google.com/maps?q=-12.9989578,-38.4881006',
  instagramUrl: 'https://www.instagram.com/boiarestaurante/'
};

// TODO: substituir por avaliações reais do Google Maps.
const REVIEWS = [
  { text: 'Espaço reservado para uma avaliação real sobre a experiência no Boia.', author: 'Cliente · Google Maps' },
  { text: 'Espaço reservado para uma avaliação real sobre os pratos da casa.', author: 'Cliente · Google Maps' },
  { text: 'Espaço reservado para uma avaliação real sobre o atendimento e o ambiente.', author: 'Cliente · Google Maps' }
];
const RATING = '';
const REVIEW_COUNT = '';

const $ = (selector) => document.querySelector(selector);
const setText = (selector, value) => { const element = $(selector); if (element) element.textContent = value; };
const setLink = (selector, href, label) => { const element = $(selector); if (!element) return; element.href = href; if (label) element.textContent = label; };

const reservationUrl = `https://wa.me/${CONTACT.reservationDigits}?text=${encodeURIComponent('Olá! Gostaria de reservar uma mesa no Boia Restaurante.')}`;
document.querySelectorAll('[data-reservation]').forEach(link => { link.href = reservationUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; });
setText('#contact-address', CONTACT.address);
setText('#contact-hours', CONTACT.hours.join(' · '));
setText('#footer-address', CONTACT.addressShort);
setText('#footer-hours', CONTACT.hoursShort);
setLink('#contact-reservations', `tel:+${CONTACT.reservationDigits}`, CONTACT.reservationPhone);
setLink('#contact-phone', `tel:+${CONTACT.telephoneDigits}`, CONTACT.telephone);
setLink('#contact-email', `mailto:${CONTACT.email}`, CONTACT.email);
setLink('#contact-whatsapp', reservationUrl);
setLink('#contact-instagram', CONTACT.instagramUrl);
setLink('#footer-instagram', CONTACT.instagramUrl);
setLink('#map-directions', CONTACT.mapsUrl);

// TODO: inserir o endereço oficial do cardápio completo quando estiver disponível.

const header = $('.site-header');
const menuButton = $('.menu-toggle');
const syncHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });
menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
$('.main-nav').addEventListener('click', event => {
  if (event.target.closest('a')) {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menuButton.focus();
  }
});

document.querySelectorAll('.image-shell img').forEach(image => {
  const fallback = () => image.parentElement.classList.add('is-missing');
  image.addEventListener('error', fallback);
  if (image.complete && image.naturalWidth === 0) fallback();
});

let reviewIndex = 0;
const reviewTrack = $('#review-track');
const visibleReviewCount = () => window.matchMedia('(max-width: 760px)').matches ? 1 : 3;
function renderReviews() {
  const count = visibleReviewCount();
  reviewTrack.replaceChildren();
  for (let offset = 0; offset < count; offset++) {
    const review = REVIEWS[(reviewIndex + offset) % REVIEWS.length];
    const article = document.createElement('article');
    article.className = 'review-card';
    const label = document.createElement('span');
    label.className = 'review-placeholder-label';
    label.textContent = 'Depoimento provisório';
    const quote = document.createElement('blockquote');
    quote.textContent = review.text;
    const cite = document.createElement('cite');
    cite.textContent = review.author;
    article.append(label, quote, cite);
    reviewTrack.append(article);
  }
  setText('#review-position', `${String(reviewIndex + 1).padStart(2, '0')} / ${String(REVIEWS.length).padStart(2, '0')}`);
}
$('#review-prev').addEventListener('click', () => { reviewIndex = (reviewIndex - 1 + REVIEWS.length) % REVIEWS.length; renderReviews(); });
$('#review-next').addEventListener('click', () => { reviewIndex = (reviewIndex + 1) % REVIEWS.length; renderReviews(); });
window.addEventListener('resize', renderReviews);
renderReviews();
if (RATING && REVIEW_COUNT) {
  const summary = $('#review-summary');
  summary.textContent = `${RATING} de 5 · ${REVIEW_COUNT} avaliações`;
  summary.hidden = false;
}

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}
