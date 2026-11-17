/* voices.js - the parent quotes on the home page. They change every eight seconds,
   stop when the pointer is over them, and can be moved with the dots or the arrow keys. */

const voiceSchool = window.SCHOOL;

function drawVoices() {
  const holder = document.querySelector('[data-voices]');
  if (!holder) return;
  const voices = voiceSchool.voices;
  let at = 0;
  let timer = null;

  const show = index => {
    at = (index + voices.length) % voices.length;
    const voice = voices[at];
    holder.innerHTML = `
      <blockquote class="voice swap-in">
        <p>“${voice.quote}”</p>
        <cite>${voice.who}<span>${voice.role}</span></cite>
      </blockquote>
      <div class="dots" role="tablist" aria-label="Parent voices">
        ${voices.map((v, i) => `<button class="dot${i === at ? ' on' : ''}" type="button"
            data-voice="${i}" role="tab" aria-selected="${i === at}"
            aria-label="Voice ${i + 1} of ${voices.length}"></button>`).join('')}
      </div>`;
  };

  const start = () => { timer = setInterval(() => show(at + 1), 8000); };
  const stop = () => { clearInterval(timer); timer = null; };

  holder.addEventListener('click', event => {
    const dot = event.target.closest('[data-voice]');
    if (!dot) return;
    stop(); show(Number(dot.dataset.voice)); start();
  });
  holder.addEventListener('mouseenter', stop);
  holder.addEventListener('mouseleave', start);
  show(0);
  start();
}

drawVoices();
