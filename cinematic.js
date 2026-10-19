/*
 * Apex Skill Hunt cinematic interactions
 * Three.js WebGL hero object + GSAP/ScrollTrigger scroll choreography.
 * External libraries load from CDN; reduced-motion and WebGL fallback supported.
 */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('apex3d');
  const hero = document.querySelector('.hero');
  const visual = document.getElementById('heroVisual');

  // GSAP scroll choreography: section entrances, service card stagger, subtle hero drift.
  const bootGSAP = () => {
    if (!window.gsap || reduceMotion) return;
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Existing .reveal observer remains as a no-library fallback.
    document.querySelectorAll('.section-head, .journey-step, .partner-block, .benefit-card, .team-card').forEach((el) => {
      if (el.dataset.gsapReady) return;
      el.dataset.gsapReady = 'true';
      gsap.fromTo(el, {y: 34, opacity: 0}, {
        y: 0, opacity: 1, duration: .85, ease: 'power3.out',
        scrollTrigger: {trigger: el, start: 'top 88%', once: true}
      });
    });
    const cards = gsap.utils.toArray('.modern-service');
    if (cards.length) {
      gsap.fromTo(cards, {y: 46, opacity: 0, rotateX: 5}, {
        y: 0, opacity: 1, rotateX: 0, duration: .8, stagger: .1, ease: 'power3.out',
        scrollTrigger: {trigger: '.modern-service-grid', start: 'top 82%', once: true}
      });
    }
    if (hero && visual && window.ScrollTrigger) {
      gsap.to(visual, {
        y: 70, ease: 'none',
        scrollTrigger: {trigger: hero, start: 'top top', end: 'bottom top', scrub: .7}
      });
    }
  };

  const bootThree = async () => {
    if (!canvas || reduceMotion) return;
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
      const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true, powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setSize(canvas.clientWidth || 600, canvas.clientHeight || 520, false);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
      camera.position.set(0, 0, 8.4);

      const group = new THREE.Group();
      scene.add(group);

      // A polished, sculptural gold torus knot with a fine wireframe shell.
      const knotGeo = new THREE.TorusKnotGeometry(1.18, .035, 220, 12, 2, 3);
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xe8bd68, metalness: .88, roughness: .22,
        emissive: 0x4d2e06, emissiveIntensity: .36
      });
      const knot = new THREE.Mesh(knotGeo, goldMat);
      group.add(knot);

      const wire = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.2, .008, 160, 5, 2, 3),
        new THREE.MeshBasicMaterial({color:0xffe6a6, transparent:true, opacity:.65})
      );
      wire.scale.setScalar(1.035);
      group.add(wire);

      // Three orbital rings create the layered, premium product-render feel.
      const ringMat = new THREE.MeshBasicMaterial({color:0xd9b46a, transparent:true, opacity:.44});
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.85, .008, 8, 150), ringMat);
      ring1.rotation.set(.9, .4, -.35); ring1.scale.set(1.18, .64, 1); group.add(ring1);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.12, .006, 8, 150),
        new THREE.MeshBasicMaterial({color:0x9aa8c4, transparent:true, opacity:.34}));
      ring2.rotation.set(.3, 1.0, .7); ring2.scale.set(.78, 1.1, 1); group.add(ring2);

      // Dust particles are restrained and low-cost, not a heavy full-screen effect.
      const count = 460, positions = new Float32Array(count * 3);
      for (let i=0; i<count; i++) {
        const radius = 1.7 + Math.random() * 2.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i*3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = radius * Math.cos(phi);
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
        color:0xf1d69b, size:.018, transparent:true, opacity:.72, sizeAttenuation:true
      }));
      group.add(particles);

      scene.add(new THREE.AmbientLight(0xffffff, 1.5));
      const keyLight = new THREE.PointLight(0xffd487, 34, 18);
      keyLight.position.set(3, 3, 4); scene.add(keyLight);
      const rimLight = new THREE.PointLight(0x8b9bc4, 20, 15);
      rimLight.position.set(-3, -2, -2); scene.add(rimLight);

      let pointerX = 0, pointerY = 0, scrollProgress = 0;
      const onPointer = (event) => {
        if (!visual || window.matchMedia('(pointer: coarse)').matches) return;
        const rect = visual.getBoundingClientRect();
        pointerX = ((event.clientX - rect.left) / rect.width - .5) * .6;
        pointerY = ((event.clientY - rect.top) / rect.height - .5) * .5;
      };
      visual?.addEventListener('pointermove', onPointer, {passive:true});
      visual?.addEventListener('pointerleave', () => {pointerX=0;pointerY=0;}, {passive:true});

      const resize = () => {
        const width = Math.max(1, canvas.clientWidth || visual?.clientWidth || 600);
        const height = Math.max(1, canvas.clientHeight || visual?.clientHeight || 500);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const narrow = window.innerWidth < 760;
        camera.position.z = narrow ? 9.4 : 8.4;
        group.scale.setScalar(narrow ? .77 : 1);
      };
      resize();
      window.addEventListener('resize', resize, {passive:true});

      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.gsap.to({p:0}, {
          p:1, ease:'none',
          onUpdate:function(){scrollProgress=this.targets()[0].p;},
          scrollTrigger:{trigger:hero || document.body,start:'top top',end:'bottom top',scrub:1}
        });
      } else {
        window.addEventListener('scroll', () => {
          const max = Math.max(1, hero?.offsetHeight || 1);
          scrollProgress = Math.min(1, Math.max(0, window.scrollY / max));
        }, {passive:true});
      }

      let raf = 0, active = true;
      const observer = new IntersectionObserver(entries => { active = entries.some(e=>e.isIntersecting); });
      if (visual) observer.observe(visual);
      const render = (time) => {
        raf = requestAnimationFrame(render);
        if (!active && document.visibilityState !== 'visible') return;
        const t = time * .00022;
        group.rotation.y += (pointerX * .75 + scrollProgress * 1.8 + t - group.rotation.y) * .035;
        group.rotation.x += (pointerY * .6 + Math.sin(t * 2) * .07 - group.rotation.x) * .035;
        knot.rotation.x = Math.sin(t * 1.4) * .16;
        knot.rotation.z = Math.cos(t) * .12;
        wire.rotation.y = -t * 1.5;
        ring1.rotation.z += .0015;
        ring2.rotation.x -= .0011;
        particles.rotation.y = t * .22 + scrollProgress * .4;
        renderer.render(scene, camera);
      };
      render(0);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') cancelAnimationFrame(raf);
        else render(0);
      });
    } catch (error) {
      // If WebGL/CDN is unavailable, existing CSS orbits and photo remain the fallback.
      canvas.style.display = 'none';
      console.warn('3D hero fallback active:', error);
    }
  };

  // GSAP scripts are defer-loaded; wait for them without blocking the rest of the site.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { bootGSAP(); bootThree(); }, {once:true});
  } else {
    bootGSAP(); bootThree();
  }
})();
