/* Apex Skill Hunt hero image rotation: one image every 3 seconds, with a soft cross-fade. */
(() => {
  const image = document.getElementById('heroSlideshowImage');
  if (!image) return;
  const caption = document.getElementById('heroSlideshowCaption');
  const counter = document.getElementById('heroSlideCurrent');
  const slides = [
    { src: 'assets/apex-coding-workshop.png', alt: 'Apex Skill Hunt trainer teaching a coding workshop', caption: 'Hands-on coding workshops' },
    { src: 'assets/apex-collaborative-coding.png', alt: 'Students collaborating on programming exercises at Apex Skill Hunt', caption: 'Collaborative coding practice' },
    { src: 'assets/apex-mock-interview.png', alt: 'A mock interview session at Apex Skill Hunt', caption: 'Interview-ready confidence' }
  ];
  slides.forEach((slide) => { const preload = new Image(); preload.src = slide.src; });
  let current = 0;
  window.setInterval(() => {
    current = (current + 1) % slides.length;
    image.classList.add('is-fading');
    window.setTimeout(() => {
      image.src = slides[current].src;
      image.alt = slides[current].alt;
      if (caption) caption.textContent = slides[current].caption;
      if (counter) counter.textContent = String(current + 1).padStart(2, '0');
      requestAnimationFrame(() => image.classList.remove('is-fading'));
    }, 550);
  }, 3000);
})();
