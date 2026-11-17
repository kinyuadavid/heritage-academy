/* common.js - the few things every page needs: the school's own details written
   into the page, the slide-in effect, and the year in the footer.
   The header and its menus live in js/head.js. */

const detailsSchool = window.SCHOOL;

/* Fill in anything marked data-school="phone" (and the rest) from js/data/school.js,
   so a number is typed in one place only. */
function writeDetails() {
  document.querySelectorAll('[data-school]').forEach(node => {
    const key = node.dataset.school;
    const value = detailsSchool[key];
    if (typeof value !== 'string') return;
    if (node.tagName === 'A' && node.dataset.schoolHref) {
      node.href = node.dataset.schoolHref.replace('{value}', value);
    }
    if (!node.dataset.schoolHrefOnly) node.textContent = value;
  });
  document.querySelectorAll('[data-tel]').forEach(a => { a.href = 'tel:+' + detailsSchool.phoneIntl; });
  document.querySelectorAll('[data-whatsapp]').forEach(a => {
    const text = encodeURIComponent(a.dataset.whatsapp || 'Hello Heritage Academy, I would like to ask about admission.');
    a.href = 'https://wa.me/' + detailsSchool.whatsapp + '?text=' + text;
  });
  document.querySelectorAll('[data-mail]').forEach(a => { a.href = 'mailto:' + detailsSchool.email; });
}

/* Anything with class "reveal" slides in when it reaches the screen.
   Pages build parts of themselves after this file runs, so scan() is called again
   once the whole page has loaded, and anything new is picked up then. */
const revealWatcher = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('seen');
        self.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' })
  : null;

/* Every band's own label, heading and opening line arrive as the band comes into
   view, one just after the other. Without this some sections slid in and others
   simply sat there already finished, which read as though they were stuck. */
function markHeadings() {
  document.querySelectorAll('.band .wrap').forEach(wrap => {
    const parts = ['.eyebrow', 'h2', '.lede']
      .map(pick => wrap.querySelector(':scope > ' + pick))
      .filter(part => part && !part.classList.contains('reveal') && !part.closest('.reveal'));
    parts.forEach((part, index) => {
      part.classList.add('reveal');
      part.style.transitionDelay = (index * 90) + 'ms';
    });
  });
}

function scanReveal() {
  const items = document.querySelectorAll('.reveal:not(.watched)');
  items.forEach(item => {
    item.classList.add('watched');
    if (revealWatcher) revealWatcher.observe(item);
    else item.classList.add('seen');
  });
  /* If anything is still hidden after a few seconds (an odd browser, a printed page),
     show it rather than leaving a blank band. */
  setTimeout(() => document.querySelectorAll('.reveal').forEach(item => item.classList.add('seen')), 3000);
}
window.scanReveal = scanReveal;

/* The year in the footer. */
function writeYear() {
  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });
}

writeDetails();
markHeadings();
scanReveal();
writeYear();

/* the pages draw their own pieces in the scripts after this one, so look again
   once they have all run */
document.addEventListener('DOMContentLoaded', () => {
  writeDetails();
  markHeadings();
  scanReveal();
  writeYear();
});
