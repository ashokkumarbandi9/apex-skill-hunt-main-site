(() => {
  const header = document.getElementById('header');
  const progress = document.querySelector('.scroll-progress span');
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateScroll = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('scrolled', y > 18);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
    }
    const parallaxVisual = document.getElementById('heroVisual');
    if (parallaxVisual && !reduceMotion && window.innerWidth > 760) {
      parallaxVisual.style.setProperty('--scroll-depth', `${Math.min(y * 0.055, 34)}px`);
    }
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
    }));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const revealItems = document.querySelectorAll('.reveal, .pop');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * 65}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('revealed'));
  }

  // Duplicate the classroom rail once so its horizontal motion loops seamlessly.
  document.querySelectorAll('.marquee-track').forEach(track => {
    if (track.dataset.loopReady) return;
    Array.from(track.children).forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach(img => img.alt = '');
      track.appendChild(clone);
    });
    track.dataset.loopReady = 'true';
  });

  // Gentle perspective tilt: disabled for touch devices and reduced-motion users.
  const heroVisual = document.getElementById('heroVisual');
  const heroFrame = document.querySelector('.hero-image-frame');
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const addTilt = (element, max = 5) => {
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * max;
        const ry = (x - 0.5) * max;
        element.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
      element.addEventListener('pointerleave', () => { element.style.transform = ''; });
    };
    if (heroVisual && heroFrame) {
      heroVisual.addEventListener('pointermove', event => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        heroFrame.style.transform = `rotateY(${-8 + x * 9}deg) rotateX(${3 - y * 7}deg) translateZ(8px)`;
      });
      heroVisual.addEventListener('pointerleave', () => { heroFrame.style.transform = ''; });
    }
    tiltCards.forEach(card => addTilt(card, 3.2));
  }

  // Contact form handler remains compatible with the existing Web3Forms setup.
  const form = document.getElementById('contactForm');
  const success = document.getElementById('success');
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button) { button.disabled = true; button.textContent = 'Sending...'; }
      if (success) success.textContent = '';
      try {
        const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
        const result = await response.json();
        if (response.ok && result.success) {
          if (success) success.textContent = 'Thank you! Your enquiry has been sent successfully. We will contact you soon.';
          form.reset();
        } else if (success) {
          success.textContent = "Sorry, we couldn't send your enquiry. Please try again or email info@apexskillhunt.in.";
        }
      } catch (error) {
        if (success) success.textContent = 'Connection error. Please try again or email info@apexskillhunt.in.';
      } finally {
        if (button) { button.disabled = false; button.textContent = 'Send Enquiry →'; }
      }
    });
  }
})();
