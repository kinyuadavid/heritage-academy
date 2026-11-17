# Heritage Academy — school website

A seven-page website for a secondary school, built as a show site. Plain HTML, CSS
and JavaScript: no build step, no framework, no server. Drop the folder on Netlify
(or any static host) and it runs.

Heritage Academy is an invented school in Wajir. Every name, figure, date and photo
is made up for the demonstration.

## The pages

| File | What it is |
|---|---|
| `index.html` | Home: the gate, the figures, a day at the school, the pathways, results, the campus, open days |
| `academics.html` | How the school is arranged, the teaching week, the three pathways, the results table, support |
| `life.html` | Boarding, the daily routine, clubs and sport, the campus, food, what a boarder brings |
| `admissions.html` | The four steps, the fee tables, a fee calculator, the application form, the questions parents ask |
| `news.html` | Three stories, the term calendar, the open days |
| `contact.html` | Phone, WhatsApp, email, directions and a message form |
| `privacy.html` | What the school does with the details sent through the site |
| `404.html` | Shown when a page is not found |

## Changing the school's details

Everything a school would want to change is in **`js/data/school.js`**: the name, the
address, the phone number, the WhatsApp number, the email, the fees, the term dates,
the open days, the results, the pathways and the daily routine. Change a number there
and it changes on every page that shows it.

The colours, fonts and spacing are in **`css/tokens.css`**. Change the three colours
at the top and the whole site follows.

## The two forms

The application form and the message form **do not send anything anywhere**. The
application form gives the parent a reference number and keeps a copy in that
browser only (`localStorage`), so the demonstration feels real.

When a school takes the site over, point `sendApplication()` in `js/admissions.js`
and the handler in `js/contact.js` at their own form service or email address.

## Photos

`assets/photos/` holds the pictures, saved as `.webp` at 1600px wide with an
`-small` copy at 800px. To replace one, keep the file name and the page picks it up.

| File | Where it is used |
|---|---|
| `gate.webp` | Home hero, contact page, news |
| `campus-aerial.webp` | Home campus gallery, school life gallery |
| `classroom.webp` | Home ("why families choose us"), academics banner |
| `science-lab.webp` | Academics, home campus gallery |
| `computer-lab.webp` | Academics support section |
| `library.webp` | Academics support, home campus gallery |
| `dormitory.webp` | School life banner and boarding section |
| `dining.webp` | School life food section, news |
| `football.webp` | School life gallery, news |
| `corridor.webp` | Admissions banner, news |
| `principal.webp` | Home, the welcome from the principal |

The full set is in. Optional extras: four learner head-shots for testimonials.

Two of the photographs (`science-lab`, `dormitory`) were recoloured from green to
navy so the uniform matches across the whole site.

## Fonts

Playfair Display (headings), Raleway (small capital labels), Inter (text). All three
are open fonts under the SIL Open Font License and are served from `assets/fonts/`,
so the site needs no connection to Google.

## What moves on the page

| Where | What it does | File |
|---|---|---|
| Header | Draws in and glasses over once the page moves; slides out of the way scrolling down and comes straight back scrolling up | `js/head.js` |
| Header | A lit pill slides between the links as you point at them; an amber dot marks the page you are on | `js/head.js` |
| Header | Academics, School life and Admissions open a drop-down list; on a phone they open downwards inside the menu | `js/head.js` |
| Phone menu | A full-height panel slides in from the right, items arriving one after another; Escape or the X closes it | `js/head.js`, `css/phone.css` |
| Right edge | A rail of dots, one per section, that follows you down the page and jumps you to any of them | `js/head.js` |
| Hero | The photograph leans towards the pointer and lifts as you scroll; the copy arrives a line at a time; a chevron invites you down | `js/interactive.js` |
| A day at Heritage | The slot that is happening at this hour is marked and scrolled into view | `js/interactive.js` |
| Campus gallery | Filter chips (Campus, Classrooms, Boarding, Dining, Sport) with counts; any photograph opens full-screen, with arrow keys and swipe | `js/interactive.js` |
| News | Category chips and a search box that filters the notices as you type | `js/interactive.js` |
| Application form | A bar that fills as the form is answered, and a green tick beside each field once it is right | `js/interactive.js` |
| Everywhere | A reading-progress line at the top, a ripple under every button, hover lift on cards and photographs, back-to-top, and a Call/Apply bar on a phone | `js/interactive.js` |

Everything above is switched off for anyone whose device asks for reduced motion.

## Hosting

Drag the folder onto Netlify. `_headers` keeps search engines away while the site
lives on a private link, and `_redirects` gives short addresses such as `/apply`
and `/fees` for a flyer or a poster.
