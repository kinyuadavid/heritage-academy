/* news.js - the term table and the open days on the News page. */

const newsSchool = window.SCHOOL;
const NEWS_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function readableDate(iso) {
  const d = new Date(iso);
  return d.getDate() + ' ' + NEWS_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

function drawTerms() {
  const body = document.querySelector('[data-terms-table]');
  if (!body) return;
  body.innerHTML = newsSchool.terms.map(t => `
    <tr><td>${t.name}</td><td>${readableDate(t.opens)}</td><td>${readableDate(t.closes)}</td></tr>`).join('');
}

function drawOpenDays() {
  const list = document.querySelector('[data-opendays]');
  if (!list) return;
  list.innerHTML = newsSchool.openDays.map(day => {
    const d = new Date(day.date);
    return `<li>
      <div class="date"><b>${d.getDate()}</b><span>${NEWS_MONTHS[d.getMonth()]}</span></div>
      <div><h3>${day.title}</h3><p>${day.line}</p></div>
    </li>`;
  }).join('');
}

drawTerms();
drawOpenDays();
