/* admissions.js - the fee calculator, the term dropdown, the open days,
   and the application form.

   Nothing is sent anywhere: the form shows the parent a reference number and keeps
   the application in this browser only. When a school takes the site over, point
   sendApplication() at their own address or form service. */

const admSchool = window.SCHOOL;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function shillings(amount) {
  return 'KSh ' + amount.toLocaleString('en-KE');
}

function readable(iso) {
  const d = new Date(iso);
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

/* ------------------------------------------------------------------ calculator */
function termly(kind) {
  const f = admSchool.fees[kind];
  return f.tuition + f.boarding + f.meals;
}

function drawCalc() {
  const out = document.querySelector('[data-calc]');
  if (!out) return;
  const kind = document.getElementById('calcType').value;
  const children = Number(document.getElementById('calcChildren').value);
  const joining = document.getElementById('calcJoining').value === 'yes';
  const fees = admSchool.fees[kind];

  const lines = [];
  let total = 0;
  for (let i = 1; i <= children; i += 1) {
    const discount = i > 1 ? Math.round(fees.tuition * 0.1) : 0;
    const amount = termly(kind) - discount;
    total += amount;
    lines.push({
      label: children > 1 ? `Child ${i}${discount ? ' (10% off tuition)' : ''}` : fees.label,
      amount
    });
  }
  if (joining) {
    admSchool.fees.once.forEach(item => {
      if (item.name.includes('boarders') && kind !== 'boarding') return;
      const amount = item.amount * children;
      total += amount;
      lines.push({ label: item.name + (children > 1 ? ` × ${children}` : ''), amount });
    });
  }

  out.innerHTML = lines.map(l => `
    <div class="calc-line"><span>${l.label}</span><b>${shillings(l.amount)}</b></div>`).join('') + `
    <div class="calc-total"><span>${joining ? 'First term, all in' : 'Per term'}</span><b>${shillings(total)}</b></div>
    <p class="form-note">${admSchool.fees.note}</p>`;
}

function wireCalc() {
  ['calcType', 'calcChildren', 'calcJoining'].forEach(id => {
    const node = document.getElementById(id);
    if (node) node.addEventListener('change', drawCalc);
  });
  drawCalc();
}

/* ------------------------------------------------------------------ the form */
function fillTerms() {
  const select = document.querySelector('[data-terms]');
  if (!select) return;
  const today = new Date();
  const ahead = admSchool.terms.filter(t => new Date(t.opens) > today);
  select.innerHTML = (ahead.length ? ahead : admSchool.terms)
    .map(t => `<option>${t.name} (${readable(t.opens)})</option>`).join('');
}

function drawOpenDays() {
  const list = document.querySelector('[data-opendays]');
  if (!list) return;
  list.innerHTML = admSchool.openDays.map(day => {
    const d = new Date(day.date);
    return `<li>
      <div class="date"><b>${d.getDate()}</b><span>${MONTHS[d.getMonth()]}</span></div>
      <div><h3>${day.title}</h3><p>${day.line}</p></div>
    </li>`;
  }).join('');
}

/* A reference the parent can quote on the phone: HA-<year><a running number>. */
function makeReference() {
  const used = Number(localStorage.getItem('ha-ref-count') || '0') + 1;
  localStorage.setItem('ha-ref-count', String(used));
  return 'HA-' + new Date().getFullYear() + '-' + String(1040 + used);
}

function sendApplication(form, answer) {
  const child = form.childName.value.trim();
  const parent = form.parentName.value.trim();
  const phone = form.parentPhone.value.trim();
  if (!child || !parent || phone.replace(/\D/g, '').length < 9) {
    answer.className = 'answer show';
    answer.innerHTML = '<h3>Almost there</h3><p>We need the child’s name, your name and a phone number we can call.</p>';
    return;
  }
  const reference = makeReference();
  localStorage.setItem('ha-last-application', JSON.stringify({
    reference, child, parent, phone,
    grade: form.grade.value, boarding: form.boarding.value, term: form.startTerm.value,
    note: form.note.value.trim(), sent: new Date().toISOString()
  }));
  answer.className = 'answer show';
  answer.innerHTML = `
    <h3>Thank you, ${parent.split(' ')[0]}.</h3>
    <p>Your reference is <span class="ref">${reference}</span></p>
    <p>The admissions office will call ${phone} within two working days to arrange a visit and the placement test. Quote the reference when you call us.</p>`;
  form.reset();
  fillTerms();
  answer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function wireForm() {
  const form = document.getElementById('applyForm');
  const answer = document.getElementById('applyAnswer');
  if (!form || !answer) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    sendApplication(form, answer);
  });
}

wireCalc();
fillTerms();
drawOpenDays();
wireForm();
