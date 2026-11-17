/* home.js - the moving parts of the home page: the figures that count up, the day rail,
   the results bars, the term countdown and the open days. The stage tabs are in levels.js
   and the parent voices in voices.js. */

const homeSchool = window.SCHOOL;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ------------------------------------------------------------------ figures */
function drawFigures() {
  const holder = document.querySelector('[data-figures]');
  if (!holder) return;
  holder.innerHTML = '<div class="fig-card reveal">' + homeSchool.figures.map(f => `
    <div class="fig">
      <b data-count="${f.value}" data-suffix="${f.suffix}">0${f.suffix}</b>
      <span class="lab">${f.label}</span>
      <p class="note">${f.note}</p>
    </div>`).join('') + '</div>';
  countUp();
}

/* Numbers climb to their value the first time they are seen. */
function countUp() {
  const numbers = document.querySelectorAll('[data-count]');
  const run = node => {
    const target = Number(node.dataset.count);
    const suffix = node.dataset.suffix || '';
    const started = performance.now();
    const step = now => {
      const part = Math.min((now - started) / 1200, 1);
      const eased = 1 - Math.pow(1 - part, 3);
      node.textContent = Math.round(target * eased) + suffix;
      if (part < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const watcher = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      self.unobserve(entry.target);
    });
  }, { threshold: .4 });
  numbers.forEach(n => watcher.observe(n));
}

/* ------------------------------------------------------------------ the day */
function drawDay() {
  const rail = document.querySelector('[data-day]');
  if (!rail) return;
  rail.innerHTML = homeSchool.day.map(slot => `
    <article class="day-card">
      <time>${slot.time}</time>
      <h3>${slot.title}</h3>
      <p>${slot.line}</p>
    </article>`).join('');
}

/* ------------------------------------------------------------------ results */
function drawResults() {
  const holder = document.querySelector('[data-bars]');
  if (!holder) return;
  const top = 100;
  holder.innerHTML = homeSchool.results.map((r, i) => `
    <div class="bar ${i < homeSchool.results.length - 1 ? 'pale' : ''}">
      <b>${r.mean}%</b>
      <span class="grade">${r.label}</span>
      <div class="col" data-height="${Math.round((r.mean / top) * 100)}"></div>
      <span>${r.year}</span>
    </div>`).join('');
  const grow = () => holder.querySelectorAll('.col').forEach(col => { col.style.height = col.dataset.height + '%'; });
  const watcher = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      grow();
      self.unobserve(entry.target);
    });
  }, { threshold: .3 });
  watcher.observe(holder);
}

/* ------------------------------------------------------------------ term countdown */
function drawCountdown() {
  const holder = document.querySelector('[data-countdown]');
  if (!holder) return;
  const today = new Date();
  const next = homeSchool.terms.find(t => new Date(t.opens) > today) || homeSchool.terms[0];
  const days = Math.max(0, Math.round((new Date(next.opens) - today) / 86400000));
  holder.querySelector('[data-days]').textContent = String(days);
  holder.querySelector('[data-term]').textContent = next.name + ' opens ' + readable(next.opens);
}

function readable(iso) {
  const d = new Date(iso);
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

/* ------------------------------------------------------------------ open days */
function drawOpenDays() {
  const list = document.querySelector('[data-opendays]');
  if (!list) return;
  list.innerHTML = homeSchool.openDays.map(day => {
    const d = new Date(day.date);
    return `<li>
      <div class="date"><b>${d.getDate()}</b><span>${MONTHS[d.getMonth()]}</span></div>
      <div><h3>${day.title}</h3><p>${day.line}</p></div>
    </li>`;
  }).join('');
}

/* Cards drawn by this file also need the slide-in effect. */
function wireReveal(scope) {
  const items = scope.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('seen'));
    return;
  }
  const watcher = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('seen');
      self.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  items.forEach(item => watcher.observe(item));
}

drawFigures();
drawDay();
drawResults();
drawCountdown();
drawOpenDays();
