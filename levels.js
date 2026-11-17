/* levels.js - the four stages of the school as tabs: Playgroup, Lower Primary,
   Upper Primary, Junior School. Used on the home page and the academics page.
   Arrow keys move between tabs, as a keyboard user expects. */

const levelSchool = window.SCHOOL;

function tabStrip(levels, current) {
  return levels.map((level, i) => `
    <button class="tab-pill${i === current ? ' on' : ''}" type="button" role="tab"
            id="tab-${level.id}" aria-controls="panel-${level.id}"
            aria-selected="${i === current ? 'true' : 'false'}" data-level="${i}">
      ${level.name}
    </button>`).join('');
}

function panel(level) {
  return `
    <article class="level" id="panel-${level.id}" role="tabpanel" aria-labelledby="tab-${level.id}">
      <div class="level-head">
        <h3>${level.name}</h3>
        <span class="level-grades">${level.grades}</span>
      </div>
      <p class="level-line">${level.line}</p>
      <ul class="tick">${level.points.map(point => `<li>${point}</li>`).join('')}</ul>
      <p class="level-next"><b>Leads to:</b> ${level.leadsTo}</p>
    </article>`;
}

function drawLevels() {
  const strip = document.querySelector('[data-level-tabs]');
  const holder = document.querySelector('[data-level-panel]');
  if (!strip || !holder) return;
  const levels = levelSchool.levels;
  let current = 0;

  const show = index => {
    current = (index + levels.length) % levels.length;
    strip.innerHTML = tabStrip(levels, current);
    holder.innerHTML = panel(levels[current]);
    holder.firstElementChild.classList.add('swap-in');
  };

  strip.addEventListener('click', event => {
    const button = event.target.closest('[data-level]');
    if (button) show(Number(button.dataset.level));
  });
  strip.addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
    strip.querySelector('.tab-pill.on').focus();
  });
  show(0);
}

drawLevels();
