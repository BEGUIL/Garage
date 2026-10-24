document.addEventListener('DOMContentLoaded', () => {
  const siteText = (value) => value.replaceAll('BERGUIL GARAGE', 'KORA GARAGE').replaceAll('Berguil Garage', 'Kora Garage').replaceAll('Berguil', 'Kora').replaceAll('Cocody Angré 8e tranche', 'Bonamoussadi, Douala').replaceAll('Abidjan', 'Douala').replaceAll('Cocody', 'Douala').replaceAll('Angré, Deux-Plateaux et la Riviera', 'Bonamoussadi, Akwa et Bali').replaceAll('+225 07 07 07 07 07', '+237 6 83 60 19 01').replaceAll('2250707070707', '237683601901');
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);
  textNodes.forEach(node => { node.nodeValue = siteText(node.nodeValue); });
  document.title = siteText(document.title);
  document.querySelector('meta[name="description"]')?.setAttribute('content', siteText(document.querySelector('meta[name="description"]').content));
  document.querySelectorAll('.brand-mark').forEach(mark => { mark.innerHTML = '<span class="logo-k">K</span>'; });
  document.querySelectorAll('a[href]').forEach(link => { link.href = link.href.replaceAll('2250707070707', '237683601901'); });

  if (!document.querySelector('.floating-contact')) {
    const quickContact = document.createElement('a');
    quickContact.className = 'floating-contact';
    quickContact.href = 'https://wa.me/237683601901';
    quickContact.target = '_blank';
    quickContact.rel = 'noopener noreferrer';
    quickContact.setAttribute('aria-label', 'Écrire sur WhatsApp');
    quickContact.innerHTML = '<span class="floating-contact-icon" aria-hidden="true">↗</span><span>WhatsApp</span>';
    document.body.append(quickContact);
  }

  const heroSlider = document.querySelector('[data-hero-slider]');
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll('.hero-slide')];
    const dots = [...heroSlider.querySelectorAll('[data-hero-dot]')];
    const previous = heroSlider.querySelector('[data-hero-prev]');
    const next = heroSlider.querySelector('[data-hero-next]');
    let currentSlide = 0;
    let timer;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    slides.forEach(slide => {
      const imageUrl = slide.dataset.heroImage;
      if (!imageUrl) return;
      const image = new Image();
      image.decoding = 'async';
      image.src = imageUrl;
    });
    const showSlide = index => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
      dots.forEach((dot, i) => { dot.classList.toggle('is-active', i === currentSlide); dot.setAttribute('aria-current', i === currentSlide ? 'true' : 'false'); });
    };
    const start = () => {
      clearInterval(timer);
      if (reducedMotion || document.hidden || slides.length < 2) return;
      timer = setInterval(() => showSlide(currentSlide + 1), 5200);
    };
    previous?.addEventListener('click', () => { showSlide(currentSlide - 1); start(); });
    next?.addEventListener('click', () => { showSlide(currentSlide + 1); start(); });
    dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.heroDot)); start(); }));
    heroSlider.addEventListener('mouseenter', () => clearInterval(timer));
    heroSlider.addEventListener('mouseleave', start);
    heroSlider.addEventListener('focusin', () => clearInterval(timer));
    heroSlider.addEventListener('focusout', event => { if (!heroSlider.contains(event.relatedTarget)) start(); });
    document.addEventListener('visibilitychange', start);
    showSlide(0);
    start();
  }

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (toggle && nav) {
    nav.id = nav.id || 'main-navigation';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      toggle.textContent = open ? '×' : '☰';
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
      document.body.classList.remove('menu-open');
    }));
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !nav.classList.contains('open')) return;
      nav.classList.remove('open');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
      document.body.classList.remove('menu-open');
      toggle.focus();
    });
    document.addEventListener('click', event => {
      if (!nav.classList.contains('open') || nav.contains(event.target) || toggle.contains(event.target)) return;
      nav.classList.remove('open');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
      document.body.classList.remove('menu-open');
    });
  }

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const current = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.dataset.page === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
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
    button.setAttribute('aria-expanded', button.closest('.faq-item')?.classList.contains('open') ? 'true' : 'false');
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', isOpen);
    });
  });

  const form = document.querySelector('#contact-form');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim() || 'Non précisé';
    const phone = data.get('phone')?.toString().trim() || 'Non précisé';
    const email = data.get('email')?.toString().trim() || 'Non précisé';
    const service = data.get('service')?.toString().trim() || 'À préciser';
    const message = data.get('message')?.toString().trim() || 'Aucun détail supplémentaire';
    const whatsappMessage = [
      'Bonjour Kora Garage 👋',
      '',
      'Je souhaite prendre rendez-vous pour mon véhicule.',
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      `Email : ${email}`,
      `Besoin : ${service}`,
      `Détails : ${message}`
    ].join('\n');
    const whatsappUrl = `https://wa.me/237683601901?text=${encodeURIComponent(whatsappMessage)}`;
    const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!whatsappWindow) window.location.href = whatsappUrl;
    form.reset();
    const success = document.querySelector('.form-success');
    if (success) {
      success.textContent = 'WhatsApp s\'ouvre avec votre message. Il ne reste plus qu\'à l\'envoyer.';
      success.classList.add('show');
    }
  });
  document.querySelector('#contact-form')?.addEventListener('input', () => document.querySelector('.form-success')?.classList.remove('show'));

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
});
