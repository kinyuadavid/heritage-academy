/* contact.js - the message form on the Contact page.

   Nothing is sent anywhere: the parent is told the office will call. When a school
   takes the site over, point this at their own address or form service. */

function wireAsk() {
  const form = document.getElementById('askForm');
  const answer = document.getElementById('askAnswer');
  if (!form || !answer) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('askName').value.trim();
    const phone = document.getElementById('askPhone').value.trim();
    const message = document.getElementById('askMessage').value.trim();
    if (!name || phone.replace(/\D/g, '').length < 9 || !message) {
      answer.className = 'answer show';
      answer.innerHTML = '<h3>Almost there</h3><p>We need your name, a phone number and a short message.</p>';
      return;
    }
    answer.className = 'answer show';
    answer.innerHTML = `<h3>Got it, ${name.split(' ')[0]}.</h3>
      <p>The office will call ${phone} within one working day. If it is urgent, ring us instead.</p>`;
    form.reset();
  });
}

wireAsk();
