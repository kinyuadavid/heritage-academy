/* life.js - draws the day timeline on the School life page. */

const lifeSchool = window.SCHOOL;

function drawDay() {
  const rail = document.querySelector('[data-day]');
  if (!rail) return;
  rail.innerHTML = lifeSchool.day.map(slot => `
    <article class="day-card">
      <time>${slot.time}</time>
      <h3>${slot.title}</h3>
      <p>${slot.line}</p>
    </article>`).join('');
}

drawDay();
