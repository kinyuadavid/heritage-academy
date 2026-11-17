/* interactive.js - the touches on every page: the reading progress bar, a photo viewer
   you can swipe, the ripple under a button, the hero that leans with the pointer,
   the live marker on the daily timetable, the gallery filters, the news search,
   the bar that follows you up the phone screen, and the back-to-top button. */

const gentle = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ progress bar */
function wireProgress() {
  const bar = document.createElement('div');
  bar.className = 'progress';
  bar.innerHTML = '<span></span>';
  document.body.appendChild(bar);
  const fill = bar.firstElementChild;
  const paint = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', paint, { passive: true });
  window.addEventListener('resize', paint);
  paint();
}

/* ------------------------------------------------------------------ photo viewer */
function wireViewer() {
  /* the whole figure is the target, not just the image: the caption sits over the
     bottom of every photograph, and a click there has to open it too */
  const holders = Array.from(document.querySelectorAll('.shot, .photo-frame'));
  const photos = holders.map(holder => holder.querySelector('img')).filter(Boolean);
  if (!photos.length) return;

  const box = document.createElement('div');
  box.className = 'viewer';
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML = `
    <button class="viewer-shut" type="button" aria-label="Close">&times;</button>
    <button class="viewer-step" data-step="-1" type="button" aria-label="Previous photo">&#8249;</button>
    <figure><img alt=""><figcaption></figcaption></figure>
    <button class="viewer-step" data-step="1" type="button" aria-label="Next photo">&#8250;</button>`;
  document.body.appendChild(box);
  const image = box.querySelector('img');
  const caption = box.querySelector('figcaption');
  let at = 0;

  const show = index => {
    at = (index + photos.length) % photos.length;
    const photo = photos[at];
    image.src = photo.currentSrc || photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.alt + '  ·  ' + (at + 1) + ' of ' + photos.length;
    if (!gentle) { image.classList.remove('swap-in'); void image.offsetWidth; image.classList.add('swap-in'); }
  };
  const open = index => {
    show(index);
    box.classList.add('on');
    box.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
  };
  const shut = () => {
    box.classList.remove('on');
    box.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
  };

  holders.forEach((holder, index) => {
    if (!holder.querySelector('img')) return;
    holder.classList.add('zoomable');
    holder.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      open(index);
    });
  });
  box.addEventListener('click', event => {
    const step = event.target.closest('[data-step]');
    if (step) { show(at + Number(step.dataset.step)); return; }
    if (!event.target.closest('figure') || event.target.closest('.viewer-shut')) shut();
  });
  document.addEventListener('keydown', event => {
    if (!box.classList.contains('on')) return;
    if (event.key === 'Escape') shut();
    if (event.key === 'ArrowRight') show(at + 1);
    if (event.key === 'ArrowLeft') show(at - 1);
  });

  /* swipe left and right on a phone */
  let from = 0;
  box.addEventListener('touchstart', event => { from = event.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', event => {
    const moved = event.changedTouches[0].clientX - from;
    if (Math.abs(moved) > 55) show(at + (moved < 0 ? 1 : -1));
  }, { passive: true });
}

/* ------------------------------------------------------------------ the ripple under a button */
function wireRipple() {
  if (gentle) return;
  document.addEventListener('pointerdown', event => {
    const button = event.target.closest('.btn');
    if (!button) return;
    const box = button.getBoundingClientRect();
    const size = Math.max(box.width, box.height);
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.width = dot.style.height = size + 'px';
    dot.style.left = (event.clientX - box.left - size / 2) + 'px';
    dot.style.top = (event.clientY - box.top - size / 2) + 'px';
    button.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  });
}

/* ------------------------------------------------------------------ the hero */
function wireHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const photo = hero.querySelector('.hero-photo');
  const note = hero.querySelector('.hero-note');

  /* the chevron that scrolls you to the first band */
  const cue = document.createElement('button');
  cue.className = 'scroll-cue';
  cue.type = 'button';
  cue.setAttribute('aria-label', 'Scroll down');
  cue.innerHTML = 'Scroll<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>';
  hero.appendChild(cue);
  cue.addEventListener('click', () => {
    const next = hero.nextElementSibling && hero.nextElementSibling.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: gentle ? 'auto' : 'smooth', block: 'start' });
  });

  if (gentle) return;

  /* the photograph lifts a little as the page scrolls past */
  if (photo) {
    photo.classList.add('hero-shift');
    let waiting = false;
    const lift = () => {
      const seen = Math.min(window.scrollY / hero.offsetHeight, 1);
      photo.style.setProperty('--sy', (seen * 60) + 'px');
      cue.classList.toggle('gone', window.scrollY > 140);
      waiting = false;
    };
    window.addEventListener('scroll', () => {
      if (waiting) return;
      waiting = true;
      requestAnimationFrame(lift);
    }, { passive: true });
    lift();
  }

  /* and leans a touch towards the pointer */
  if (window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', event => {
      const x = (event.clientX / window.innerWidth - .5) * 2;
      const y = (event.clientY / hero.offsetHeight - .5) * 2;
      if (photo) {
        photo.style.setProperty('--mx', (-x * 16) + 'px');
        photo.style.setProperty('--my', (-y * 12) + 'px');
      }
      if (note) {
        note.style.setProperty('--nx', (x * 9) + 'px');
        note.style.setProperty('--ny', (y * 7) + 'px');
      }
    });
    hero.addEventListener('pointerleave', () => {
      if (photo) { photo.style.setProperty('--mx', '0px'); photo.style.setProperty('--my', '0px'); }
      if (note) { note.style.setProperty('--nx', '0px'); note.style.setProperty('--ny', '0px'); }
    });
  }
}

/* ------------------------------------------------------------------ what is happening right now */
function markNow() {
  const cards = Array.from(document.querySelectorAll('.day-card'));
  if (!cards.length) return;

  const minutes = node => {
    const found = (node.querySelector('time') || {}).textContent || '';
    const bits = found.match(/(\d{1,2})[.:](\d{2})/);
    if (!bits) return null;
    return Number(bits[1]) * 60 + Number(bits[2]);
  };
  const stamps = cards.map(minutes);
  const now = new Date();
  const clock = now.getHours() * 60 + now.getMinutes();
  const weekend = now.getDay() === 0 || now.getDay() === 6;

  /* the last slot that has already started */
  let at = -1;
  stamps.forEach((stamp, index) => { if (stamp !== null && stamp <= clock) at = index; });
  if (at < 0 || weekend) return;

  const card = cards[at];
  card.classList.add('now');
  const flag = document.createElement('span');
  flag.className = 'now-flag';
  flag.textContent = 'Happening now';
  card.appendChild(flag);
  /* slide the rail along so you can see it */
  const rail = card.closest('.day-rail');
  if (rail && !gentle) {
    rail.scrollTo({ left: Math.max(card.offsetLeft - 40, 0), behavior: 'smooth' });
  }
}

/* ------------------------------------------------------------------ gallery filters */
function wireGallery() {
  const gallery = document.querySelector('.gallery[data-filter]');
  if (!gallery) return;
  const shots = Array.from(gallery.querySelectorAll('.shot'));
  if (shots.length < 4) return;

  const tags = ['All'];
  shots.forEach(shot => (shot.dataset.tag || '').split(',').forEach(tag => {
    const clean = tag.trim();
    if (clean && !tags.includes(clean)) tags.push(clean);
  }));

  const count = tag => tag === 'All' ? shots.length
    : shots.filter(shot => (shot.dataset.tag || '').split(',').map(t => t.trim()).includes(tag)).length;

  const chips = document.createElement('div');
  chips.className = 'chips';
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', 'Filter the photographs');
  chips.innerHTML = tags.map((tag, index) =>
    '<button class="chip' + (index === 0 ? ' on' : '') + '" type="button" data-tag="' + tag + '">' +
    tag + '<span class="n">' + count(tag) + '</span></button>').join('');
  gallery.parentNode.insertBefore(chips, gallery);

  chips.addEventListener('click', event => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    chips.querySelectorAll('.chip').forEach(other => other.classList.toggle('on', other === chip));
    const want = chip.dataset.tag;
    shots.forEach(shot => {
      const mine = (shot.dataset.tag || '').split(',').map(t => t.trim());
      const keep = want === 'All' || mine.includes(want);
      shot.classList.toggle('out', !keep);
      shot.style.display = keep ? '' : 'none';
    });
  });
}

/* ------------------------------------------------------------------ news filters and search */
function wireNewsFinder() {
  const list = document.querySelector('.news-list');
  if (!list) return;
  const cards = Array.from(list.querySelectorAll('.news-card'));
  if (cards.length < 3) return;

  const tags = ['All'];
  cards.forEach(card => {
    const tag = (card.dataset.tag || '').trim();
    if (tag && !tags.includes(tag)) tags.push(tag);
  });

  const tools = document.createElement('div');
  tools.className = 'news-tools';
  tools.innerHTML =
    '<div class="chips" style="margin:0">' + tags.map((tag, index) =>
      '<button class="chip' + (index === 0 ? ' on' : '') + '" type="button" data-tag="' + tag + '">' + tag + '</button>').join('') +
    '</div>' +
    '<div class="finder">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>' +
    '<input type="search" placeholder="Search the notices" aria-label="Search the notices">' +
    '</div>';
  list.parentNode.insertBefore(tools, list);

  const note = document.createElement('p');
  note.className = 'news-count';
  list.parentNode.insertBefore(note, list.nextSibling);

  const box = tools.querySelector('input');
  let want = 'All';

  const sift = () => {
    const words = box.value.trim().toLowerCase();
    let kept = 0;
    cards.forEach(card => {
      const tag = (card.dataset.tag || '').trim();
      const byTag = want === 'All' || tag === want;
      const byWord = !words || card.textContent.toLowerCase().includes(words);
      const keep = byTag && byWord;
      card.classList.toggle('out', !keep);
      if (keep) kept++;
    });
    note.textContent = kept === cards.length ? '' :
      kept === 0 ? 'Nothing matches that. Try another word.' : 'Showing ' + kept + ' of ' + cards.length + ' notices';
  };

  tools.addEventListener('click', event => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    tools.querySelectorAll('.chip').forEach(other => other.classList.toggle('on', other === chip));
    want = chip.dataset.tag;
    sift();
  });
  box.addEventListener('input', sift);
  sift();
}

/* ------------------------------------------------------------------ the form, as it is filled */
function wireFormProgress() {
  const form = document.querySelector('#applyForm, #askForm');
  if (!form) return;
  const fields = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));
  if (fields.length < 3) return;

  const bar = document.createElement('div');
  bar.className = 'form-progress';
  bar.innerHTML = '<div class="track"><span></span></div><div class="said"><span>How far you have got</span><b>0 of ' + fields.length + '</b></div>';
  form.prepend(bar);
  const fill = bar.querySelector('.track span');
  const said = bar.querySelector('b');

  const filled = field => {
    const value = (field.value || '').trim();
    if (!value) return false;
    if (field.type === 'tel') return value.replace(/\D/g, '').length >= 9;
    if (field.type === 'email') return /\S+@\S+\.\S+/.test(value);
    return value.length >= 2;
  };

  fields.forEach(field => {
    const holder = field.closest('.field') || field.parentElement;
    if (holder && !holder.querySelector('.mark-ok')) {
      holder.classList.add('field');
      const tick = document.createElement('span');
      tick.className = 'mark-ok';
      tick.setAttribute('aria-hidden', 'true');
      tick.textContent = '✓';
      holder.appendChild(tick);
    }
  });

  const look = () => {
    let done = 0;
    fields.forEach(field => {
      const ok = filled(field);
      if (ok) done++;
      const holder = field.closest('.field');
      if (holder) holder.classList.toggle('ok', ok);
    });
    fill.style.width = (done / fields.length) * 100 + '%';
    said.textContent = done + ' of ' + fields.length;
  };

  form.addEventListener('input', look);
  form.addEventListener('change', look);
  look();
}

/* ------------------------------------------------------------------ phone action bar */
function wirePhoneBar() {
  if (document.querySelector('.phone-bar')) return;
  const school = window.SCHOOL;
  const bar = document.createElement('div');
  bar.className = 'phone-bar';
  bar.innerHTML = `
    <a class="btn small dark" href="tel:+${school.phoneIntl}">Call the office</a>
    <a class="btn small" href="admissions.html#apply">Apply</a>`;
  document.body.appendChild(bar);
  const foot = document.querySelector('.foot');
  const watch = () => {
    /* step aside once the footer is reached, so it never covers the links there */
    const atFoot = foot && foot.getBoundingClientRect().top < window.innerHeight - 40;
    bar.classList.toggle('up', window.scrollY > 520 && !atFoot);
  };
  window.addEventListener('scroll', watch, { passive: true });
  window.addEventListener('resize', watch);
  watch();
}

/* ------------------------------------------------------------------ back to top */
function wireTop() {
  const button = document.createElement('button');
  button.className = 'to-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Back to the top');
  button.innerHTML = '&#8593;';
  document.body.appendChild(button);
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: gentle ? 'auto' : 'smooth' }));
  const foot = document.querySelector('.foot');
  const watch = () => {
    /* it sits over the footer's own links otherwise, the Flovo credit among them */
    const atFoot = foot && foot.getBoundingClientRect().top < window.innerHeight - 60;
    button.classList.toggle('up', window.scrollY > 900 && !atFoot);
  };
  window.addEventListener('scroll', watch, { passive: true });
  window.addEventListener('resize', watch);
  watch();
}

wireProgress();
wireViewer();
wireRipple();
wireHero();
wireGallery();
wireNewsFinder();
wireFormProgress();
wirePhoneBar();
wireTop();

/* the daily timetable is drawn by home.js and life.js, which run after this file,
   so the live marker waits until the whole page is there */
document.addEventListener('DOMContentLoaded', markNow);
