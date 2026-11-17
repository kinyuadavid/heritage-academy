/* academics.js - draws the three pathway cards on the Academics page. */

const pathSchool = window.SCHOOL;

function drawPathways() {
  const holder = document.querySelector('[data-paths]');
  if (!holder) return;
  holder.innerHTML = pathSchool.pathways.map(p => `
    <article class="path">
      <h3>${p.name}</h3>
      <p class="line">${p.line}</p>
      <ul>${p.subjects.map(s => `<li>${s}</li>`).join('')}</ul>
      <p class="leads"><b>Leads to:</b> ${p.leadsTo}</p>
    </article>`).join('');
}

drawPathways();
