# Apex Skill Hunt — Cinematic Website Upgrade

This package keeps the existing multi-page static site and adds a real Three.js WebGL hero sculpture plus GSAP ScrollTrigger scroll choreography.

## What changed
- High-contrast charcoal, crisp white and champagne-gold styling retained.
- Three.js torus-knot sculpture, orbital rings, and lightweight particle field in the homepage hero.
- Scroll-controlled 3D rotation and pointer-responsive motion on desktop.
- GSAP ScrollTrigger reveals/staggered service cards and hero scroll depth.
- Reduced-motion preference and CSS fallback if WebGL/CDN is unavailable.
- Existing assets, pages, navigation, exam portal link, and Web3Forms contact integration retained.

## Run locally
Open `index.html` in a modern browser with internet access. For best results, serve the folder using a local static server (for example VS Code Live Server), because `cinematic.js` imports Three.js as an ES module from a CDN.

## Deploy
Commit/push the contents of `apex-skill-hunt-main-site/` to the existing GitHub repository connected to Cloudflare Pages. No build command is required for this static site. Do not upload the outer ZIP itself as the website root.

## External libraries
- GSAP 3.13 + ScrollTrigger from jsDelivr CDN
- Three.js 0.180 from jsDelivr CDN

These libraries are loaded remotely, so the deployed site needs an internet connection. The base website remains readable if they fail to load.


## Theme system
- Header toggle switches between Obsidian Gold dark mode and Arctic Silver light mode on all three pages.
- First visit follows the visitor's operating-system appearance preference.
- A manual choice is saved in localStorage (`apex-theme`) and restored on subsequent visits.
- The toggle has an accessible label, pressed state, title, and keyboard support.
- Theme changes animate smoothly; reduced-motion preferences are respected.


## Homepage layout update
- Classroom image gallery now appears directly after the Programs/What We Do section.
- Hero uses the trainer-visible teaching photo with adjusted crop/position to show more of the instructor and classroom.

Latest homepage polish: theme switch is a discreet icon at the far right of the header; the hero uses the animated 3D visual without a face/photo; the supplied Apex Skill Hunt Coding Lab artwork is placed in the classroom image tiles.


Latest hero update: the supplied Apex Skill Hunt Coding Lab image now fills the previously empty right-side hero visual area and is reused in the classroom gallery.


Hero slideshow: three supplied Apex Skill Hunt photos rotate in the hero visual every 3 seconds with a smooth fade transition. The photos and `hero-slideshow.js` are included in the assets/site root.
