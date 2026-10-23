document.addEventListener('DOMContentLoaded', () => {
  const siteText = (value) => value.replaceAll('BERGUIL GARAGE', 'KORA GARAGE').replaceAll('Berguil Garage', 'Kora Garage').replaceAll('Berguil', 'Kora').replaceAll('Cocody Angré 8e tranche', 'Bonamoussadi, Douala').replaceAll('Abidjan', 'Douala').replaceAll('Cocody', 'Douala').replaceAll('Angré, Deux-Plateaux et la Riviera', 'Bonamoussadi, Akwa et Bali').replaceAll('+225 07 07 07 07 07', '+237 6 90 00 00 00').replaceAll('2250707070707', '237690000000');
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);
  textNodes.forEach(node => { node.nodeValue = siteText(node.nodeValue); });
  document.title = siteText(document.title);
  document.querySelector('meta[name="description"]')?.setAttribute('content', siteText(document.querySelector('meta[name="description"]').content));
  document.querySelectorAll('.brand-mark').forEach(mark => { mark.innerHTML = '<span class="logo-k">K</span>'; });
  document.querySelectorAll('a[href]').forEach(link => { link.href = link.href.replaceAll('2250707070707', '237690000000'); });

  const heroSlider = document.querySelector('[data-hero-slider]');
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll('.hero-slide')];
    const dots = [...heroSlider.querySelectorAll('[data-hero-dot]')];
    const previous = heroSlider.querySelector('[data-hero-prev]');
    const next = heroSlider.querySelector('[data-hero-next]');
    let currentSlide = 0;
    let timer;
    const showSlide = index => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
      dots.forEach((dot, i) => { dot.classList.toggle('is-active', i === currentSlide); dot.setAttribute('aria-current', i === currentSlide ? 'true' : 'false'); });
    };
    const start = () => { clearInterval(timer); timer = setInterval(() => showSlide(currentSlide + 1), 5200); };
    previous?.addEventListener('click', () => { showSlide(currentSlide - 1); start(); });
    next?.addEventListener('click', () => { showSlide(currentSlide + 1); start(); });
    dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.heroDot)); start(); }));
    heroSlider.addEventListener('mouseenter', () => clearInterval(timer));
    heroSlider.addEventListener('mouseleave', start);
    showSlide(0);
    start();
  }

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  const current = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.dataset.page === current) link.classList.add('active');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let started = false;
    const counter = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      let value = 0;
      const step = Math.max(1, Math.ceil(target / 36));
      const timer = setInterval(() => {
        value = Math.min(target, value + step);
        el.textContent = value + suffix;
        if (value >= target) clearInterval(timer);
      }, 32);
      counter.disconnect();
    }, { threshold: .7 });
    counter.observe(el);
  });

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => button.closest('.faq-item').classList.toggle('open'));
  });

  const form = document.querySelector('#contact-form');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    form.reset();
    document.querySelector('.form-success')?.classList.add('show');
  });

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
});
