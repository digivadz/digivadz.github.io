const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const hero = document.querySelector('.hero');
const heroArt = document.querySelector('.hero-art');
const contactSection = document.querySelector('.contact');
const mobileCta = document.querySelector('[data-mobile-cta]');
const root = document.documentElement;
const mobileViewport = window.matchMedia('(max-width: 520px)');
let contactVisible = false;
let scrollTicking = false;

const syncMotion = () => {
  const scrollTop = window.scrollY;
  const scrollRange = Math.max(1, root.scrollHeight - window.innerHeight);
  root.style.setProperty('--scroll-progress', Math.min(1, scrollTop / scrollRange).toFixed(4));
  header?.classList.toggle('scrolled', scrollTop > 24);

  if (heroArt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroHeight = hero?.offsetHeight || window.innerHeight;
    const shift = Math.min(heroHeight * 0.08, scrollTop * 0.11);
    heroArt.style.setProperty('--hero-shift', `${shift.toFixed(1)}px`);
  }

  if (mobileCta) {
    const showCta = mobileViewport.matches && scrollTop > window.innerHeight * 0.72 && !contactVisible;
    mobileCta.classList.toggle('visible', showCta);
    mobileCta.setAttribute('aria-hidden', String(!showCta));
    mobileCta.tabIndex = showCta ? 0 : -1;
  }

  scrollTicking = false;
};

const requestMotionSync = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(syncMotion);
};

syncMotion();
window.addEventListener('scroll', requestMotionSync, { passive: true });
window.addEventListener('resize', requestMotionSync, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  });
});

document.querySelectorAll([
  '.intro-grid > *',
  '.impact-heading > *',
  '.scenarios-heading > *',
  '.approach-sticky > *',
  '.faq-intro > *',
  '.contact-inner > *'
].join(',')).forEach((item) => item.classList.add('observe', 'motion-copy'));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observedItems = document.querySelectorAll('.observe');

if (reducedMotion || !('IntersectionObserver' in window)) {
  observedItems.forEach((item) => item.classList.add('in-view'));
} else {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

  observedItems.forEach((item) => observer.observe(item));
}

if (contactSection && mobileCta && 'IntersectionObserver' in window) {
  const contactObserver = new IntersectionObserver((entries) => {
    contactVisible = entries.some((entry) => entry.isIntersecting);
    requestMotionSync();
  }, { threshold: 0.08 });
  contactObserver.observe(contactSection);
}

const faqItems = [...document.querySelectorAll('.faq details')];
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
