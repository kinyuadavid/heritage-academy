/* SCHOOL DETAILS: the one place for the name, contacts, fees and term dates.
   Every page reads from here, so changing a number here changes it everywhere.

   The _headers file keeps search engines away while the site sits on a private link. */

window.SCHOOL = {
  name: "Heritage Academy",
  motto: "Learn · Grow · Excel",
  founded: 2009,
  principal: "Abdirahman Sheikh",

  town: "Wajir",
  county: "Wajir County",
  address: "Off Wajir–Griftu Road, Makoror, Wajir Town",
  postal: "P.O. Box 142–70200, Wajir",

  phone: "0180 025 789",         // shown on the page
  phoneIntl: "254180025789",     // used in tel: links
  whatsapp: "254180025789",      // WhatsApp. Put a real mobile here before anyone taps it.
  email: "admissions@heritageacademy.ac.ke",

  /* Counted up on the home page. */
  figures: [
    { value: 612, suffix: "", label: "Learners", note: "Playgroup to Grade 9" },
    { value: 48, suffix: "", label: "Teachers", note: "All TSC registered" },
    { value: 13, suffix: ":1", label: "Learners per teacher", note: "Small classes, by design" },
    { value: 96, suffix: "%", label: "Got their first-choice school", note: "Grade 9 leavers, 2025" }
  ],

  /* The four stages of the school. The tabs on the home and academics pages read this. */
  levels: [
    {
      id: "early",
      name: "Playgroup & Pre-primary",
      grades: "Playgroup, PP1, PP2 \u00b7 ages 3 to 5",
      line: "Learning through play, in English, Kiswahili and Somali.",
      points: [
        "Two teachers in every room, never more than 18 children",
        "A nap room, a fenced play yard and a hot mid-morning snack",
        "Potty training, shoe laces and sitting still: the real curriculum",
        "A photo of your child's day sent home every Friday"
      ],
      leadsTo: "Grade 1, reading, counting and ready to sit in a class"
    },
    {
      id: "lower",
      name: "Lower Primary",
      grades: "Grade 1 to Grade 3 \u00b7 ages 6 to 8",
      line: "Reading, numbers and the confidence to ask a question.",
      points: [
        "Literacy, Kiswahili, Mathematics, Environmental Activities",
        "Creative Arts, Movement and Religious Education",
        "Reading checked one child at a time, every three weeks",
        "Homework capped at twenty minutes a night"
      ],
      leadsTo: "Grade 4, reading fluently in two languages"
    },
    {
      id: "upper",
      name: "Upper Primary",
      grades: "Grade 4 to Grade 6 \u00b7 ages 9 to 11",
      line: "Where the subjects separate and the work gets real.",
      points: [
        "Mathematics, English, Kiswahili, Science & Technology",
        "Social Studies, Agriculture, Home Science, Religious Education",
        "Boarding opens at Grade 4 for families who want it",
        "KPSEA sat at the end of Grade 6"
      ],
      leadsTo: "Junior School, with a report that shows exactly where they stand"
    },
    {
      id: "junior",
      name: "Junior School",
      grades: "Grade 7 to Grade 9 \u00b7 ages 12 to 15",
      line: "The three years that decide the senior school they enter.",
      points: [
        "Mathematics, English, Kiswahili, Integrated Science",
        "Pre-technical Studies, Agriculture, Business, Computer Science",
        "Three laboratories and a computer room, used every day",
        "KJSEA sat at the end of Grade 9, with pathway guidance for parents"
      ],
      leadsTo: "A senior school place: 96% of our 2025 leavers got their first choice"
    }
  ],

  /* The day, used by the horizontal timeline. */
  day: [
    { time: "06:00", title: "Boarders rise", line: "Grade 4 and above. Beds made, uniform checked, water bottles filled." },
    { time: "07:00", title: "The buses arrive", line: "Two routes: through Wajir town, and along the Griftu road." },
    { time: "07:40", title: "Assembly", line: "Notices, the anthem, and the week's learner of the week." },
    { time: "08:00", title: "Lessons", line: "Four before the long break. Thirty-five minutes each in primary." },
    { time: "10:20", title: "Break", line: "Milk and mandazi under the acacia, and the play yard for the little ones." },
    { time: "12:45", title: "Lunch", line: "Rice, beans, greens and fruit, cooked on site." },
    { time: "14:00", title: "Afternoon lessons", line: "Practicals in the labs, ICT in the computer room, reading in the library." },
    { time: "15:30", title: "Playgroup goes home", line: "Collected at the gate by a parent or the matron on duty." },
    { time: "16:10", title: "Games and clubs", line: "Football, volleyball, scouts, music, swimming on Fridays." },
    { time: "17:30", title: "Day learners leave", line: "The buses go back out, and the boarders head for supper." },
    { time: "19:00", title: "Evening prep", line: "An hour for Grade 4 to 6, ninety minutes for Junior School." },
    { time: "21:00", title: "Lights out", line: "Matron does the rounds. Phones stay in the house office." }
  ],

  /* What parents say. The slider on the home page reads these. */
  voices: [
    { quote: "I moved both my boys here from Nairobi. I worried they would fall behind. The first report came three weeks later, written by a teacher who clearly knew my son.", who: "Halima A.", role: "Parent, Grade 6 and Grade 9" },
    { quote: "My daughter started in Playgroup not speaking a word of English. She is in Grade 2 now and reads to me in the evening. I did not expect that so soon.", who: "Yussuf M.", role: "Parent, Grade 2" },
    { quote: "The bursar agreed a payment plan with me in writing when the drought hit our herd. Nobody sent my children home. I will not forget that.", who: "Fatuma D.", role: "Parent, Grade 4 and Grade 7" }
  ],

  /* The share of Grade 9 leavers placed in their first-choice senior school. */
  results: [
    { year: "2023", mean: 88, label: "first choice" },
    { year: "2024", mean: 92, label: "first choice" },
    { year: "2025", mean: 96, label: "first choice" }
  ],

  /* Fees per term, in shillings. The calculator on the admissions page uses these. */
  fees: {
    early: { tuition: 12500, boarding: 0, meals: 4500, label: "Playgroup, PP1 and PP2" },
    day: { tuition: 21500, boarding: 0, meals: 5500, label: "Day learner, Grade 1 to 9" },
    boarding: { tuition: 21500, boarding: 17500, meals: 0, label: "Boarder, Grade 4 and above" },
    once: [
      { name: "Admission (once only)", amount: 4000 },
      { name: "Uniform and games kit", amount: 8600 },
      { name: "Bedding pack (boarders)", amount: 6800 }
    ],
    note: "Fees may be paid in three instalments a term. Talk to the bursar before the term opens."
  },

  /* Term dates. The countdown on the home page uses the first one that is still ahead. */
  terms: [
    { name: "Term 1, 2027", opens: "2027-01-04", closes: "2027-04-02" },
    { name: "Term 2, 2027", opens: "2027-04-26", closes: "2027-08-06" },
    { name: "Term 3, 2027", opens: "2027-08-30", closes: "2027-10-22" }
  ],

  /* Open days, shown on the home page and the admissions page. */
  openDays: [
    { date: "2026-11-28", title: "Open Day", line: "Walk the campus, meet the teachers, see a lesson." },
    { date: "2026-12-12", title: "Admissions Clinic", line: "Bring your child's report. Places for 2027 confirmed on the spot." }
  ]
};
