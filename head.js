/* head.js - everything the header does.
   It draws in when the page moves, gets out of the way when you scroll down and comes
   straight back when you scroll up, slides a lit pill behind whichever link you point at,
   opens the drop-down menus, and runs the slide-in panel on a phone. */

const headNode = document.querySelector('.site-head');
const navNode = document.querySelector('.nav');
const burgerNode = document.querySelector('.burger');
const calmly = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const onPhone = () => window.matchMedia('(max-width: 860px)').matches;

/* ------------------------------------------------------------------ draw in, duck out */
function wireHeadScroll() {
  if (!headNode) return;
  let last = window.scrollY;
  let waiting = false;

  const look = () => {
    const now = window.scrollY;
    headNode.classList.toggle('stuck', now > 10);

    /* only duck out well down the page, and never while the phone panel is open */
    const deep = now > 320;
    const goingDown = now > last + 6;
    const goingUp = now < last - 6;
    if (navNode && navNode.classList.contains('open')) headNode.classList.remove('away');
    else if (deep && goingDown) headNode.classList.add('away');
    else if (goingUp || !deep) headNode.classList.remove('away');

    last = now;
    waiting = false;
  };

  window.addEventListener('scroll', () => {
    if (waiting) return;
    waiting = true;
    requestAnimationFrame(look);
  }, { passive: true });
  look();
}

/* ------------------------------------------------------------------ the lit pill */
function wireNavInk() {
  if (!navNode || onPhone()) return;
  const links = Array.from(navNode.querySelectorAll(':scope > a:not(.btn), :scope > .drop > a'));
  if (!links.length) return;

  const ink = document.createElement('span');
  ink.className = 'nav-ink';
  navNode.prepend(ink);

  const sit = link => {
    const box = link.getBoundingClientRect();
    const base = navNode.getBoundingClientRect();
    ink.style.width = box.width + 'px';
    ink.style.transform = 'translate(' + (box.left - base.left) + 'px, -50%)';
    navNode.classList.add('lit');
  };
  const rest = () => {
    const here = links.find(link => link.classList.contains('here'));
    if (here) sit(here); else navNode.classList.remove('lit');
  };

  links.forEach(link => {
    link.addEventListener('mouseenter', () => sit(link));
    link.addEventListener('focus', () => sit(link));
  });
  navNode.addEventListener('mouseleave', rest);
  window.addEventListener('resize', rest);
  rest();
}

/* ------------------------------------------------------------------ drop-down menus */
function wireDrops() {
  const drops = Array.from(document.querySelectorAll('.drop'));
  if (!drops.length) return;

  drops.forEach(drop => {
    const head = drop.querySelector(':scope > a');
    if (!head) return;
    /* on a phone the heading opens the list instead of going to the page */
    head.addEventListener('click', event => {
      if (!onPhone()) return;
      event.preventDefault();
      drops.forEach(other => { if (other !== drop) other.classList.remove('open'); });
      drop.classList.toggle('open');
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') drops.forEach(drop => drop.classList.remove('open'));
  });
}

/* ------------------------------------------------------------------ the phone panel */
function wirePanel() {
  if (!burgerNode || !navNode) return;

  const set = open => {
    navNode.classList.toggle('open', open);
    burgerNode.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('locked', open);
    if (!open) document.querySelectorAll('.drop.open').forEach(drop => drop.classList.remove('open'));
  };

  burgerNode.addEventListener('click', () => set(!navNode.classList.contains('open')));
  navNode.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link && !link.closest('.drop > a')) set(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navNode.classList.contains('open')) set(false);
  });
  window.addEventListener('resize', () => { if (!onPhone()) set(false); });
}

/* ------------------------------------------------------------------ the rail of dots down the right edge */
function wireRail() {
  const bands = Array.from(document.querySelectorAll('section[data-rail]'));
  if (bands.length < 3) return;

  const rail = document.createElement('nav');
  rail.className = 'rail';
  rail.setAttribute('aria-label', 'Sections on this page');
  rail.innerHTML = bands.map((band, index) =>
    '<button type="button" data-to="' + index + '" aria-label="' + band.dataset.rail + '">' +
    '<span class="tag">' + band.dataset.rail + '</span><span class="pip"></span></button>').join('');
  document.body.appendChild(rail);

  const buttons = Array.from(rail.querySelectorAll('button'));
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      bands[Number(button.dataset.to)].scrollIntoView({ behavior: calmly ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* mark whichever band is holding the middle of the screen, and flip the dots to
     white over the dark bands so they stay visible */
  let waiting = false;
  const look = () => {
    const middle = window.innerHeight / 2;
    let at = 0;
    bands.forEach((band, index) => {
      const box = band.getBoundingClientRect();
      if (box.top <= middle && box.bottom > middle) at = index;
    });
    buttons.forEach((button, index) => button.classList.toggle('on', index === at));
    const band = bands[at];
    rail.classList.toggle('on-dark', band.classList.contains('dark') || band.classList.contains('deep'));
    waiting = false;
  };
  window.addEventListener('scroll', () => {
    if (waiting) return;
    waiting = true;
    requestAnimationFrame(look);
  }, { passive: true });
  look();
}

wireHeadScroll();
wireNavInk();
wireDrops();
wirePanel();
wireRail();
