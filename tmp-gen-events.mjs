// GENERATOR: do not edit, regenerate with npm run gen:events
const fs = require('fs');
const dir = 'C:/Users/ASUS TUF A15/Desktop/DevOPS/Websites/Gajanan Maharaj Sansthan/gajanan-maharaj-sansthan-astro-02/content/blog/events';
const fm = (slug, kw, date) => ({
  title: slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) + ' | Devotee Event Guide',
  slug, date,
  desc: 'Devotee planning guide for ' + slug.replace(/-/g,' ') + ' at Shri Gajanan Maharaj Sansthan, Shegaon. Covers darshan timing, accommodation booking, crowd patterns, and practical tips.',
  kw, date
});
const FM = (o) => '---\ntitle: "'+o.title+'"\ndescription: "'+o.desc+'"\ndate: "'+o.date+'"\nslug: "'+o.slug+'"\nimage: "/images/shegaon-temple.svg"\nkeywords:\n' + o.kw.map(k=>'  - "'+k+'"').join('\n') + '\nauthor: "Sansthan"\ntags:\n  - "events"\n  - "festival"\n  - "darshan"\n  - "sansthan-seo"\ncategory: "events"\nlocationIds:\n  - "shegaon-bhakt-niwas"\nrelatedSlugs:\n  - "special-darshan-dates-calendar"\n  - "winter-festival-packing-for-devotees"\n  - "festival-darshan-timing-awareness-guide"\n  - "major-utsav-crowd-planning-checklist"\n  - "gajanan-maharaj-sansthan-complete-guide"\n  - "bhakta-niwas-complete-booking-guide"\n  - "shegaon-travel-guide"\n  - "shegaon-accommodation-guide"\n  - "shegaon-festival-season-guide"\n  - "diwali-darshan-planning-tips"\n---\n';
module.exports={fm:FM};
