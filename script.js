/* =============================================
   idamond — Interactions & Animations
   ============================================= */

'use strict';

// ---- Navigation scroll behaviour ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav__links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ---- Scroll reveal ----
function addRevealClasses() {
  const targets = [
    '.problem__card',
    '.problem__bio-item',
    '.tech__step',
    '.tech__innovation',
    '.tech__signal-card',
    '.ip__card',
    '.ip__claims',
    '.ip__acq-item',
    '.team__card',
    '.section__header',
    '.contact__content',
    '.contact__form-wrap',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      const delay = (i % 4);
      if (delay > 0) el.classList.add(`reveal--delay-${delay}`);
    });
  });
}

function setupIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

addRevealClasses();
setupIntersectionObserver();

// PPG Signal visualizations are now inline SVG — no JS needed.

// ---- Contact Form (Formspree) ----
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  // Inject success state HTML
  const formWrap = contactForm.closest('.contact__form-wrap');
  const successDiv = document.createElement('div');
  successDiv.className = 'contact__success';
  successDiv.innerHTML = `
    <div class="contact__success-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <h3>Message Received</h3>
    <p>Thank you for your interest in the idamond IP.<br>We will be in touch shortly.</p>
  `;
  formWrap.appendChild(successDiv);

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const data = new FormData(contactForm);
      const res  = await fetch(contactForm.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        formWrap.classList.add('submitted');
        formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const json = await res.json().catch(() => ({}));
        const msg  = json.errors ? json.errors.map(x => x.message).join(', ') : 'Something went wrong. Please try again.';
        btn.disabled = false;
        btn.textContent = 'Send Enquiry';
        alert(msg);
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Send Enquiry';
      alert('Network error — please check your connection and try again.');
    }
  });
}

// ---- Smooth active section highlighting in nav ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach(s => sectionObserver.observe(s));

// ---- CSS for active nav link (injected) ----
const style = document.createElement('style');
style.textContent = `.nav__links a.active { color: var(--color-text) !important; }`;
document.head.appendChild(style);
