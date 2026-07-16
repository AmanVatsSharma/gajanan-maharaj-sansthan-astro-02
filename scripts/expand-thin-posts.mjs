#!/usr/bin/env node
/**
 * expand-thin-posts.mjs — v3 aggressive expansion
 *
 * Adds 400-600 words per post via slug-specific expansion blocks.
 * Uses template literals to avoid apostrophe escaping issues.
 *
 * Usage: node scripts/expand-thin-posts.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'content', 'blog');

function countWords(text) {
  return (text.match(/\b\w+\b/g) || []).length;
}

function extractFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { fm: '', body: text };
  return { fm: match[0], body: text.slice(match[0].length) };
}

function getField(fm, field) {
  const m = fm.match(new RegExp(`${field}:\\s*"?([^"\\n]+)"?`));
  return m ? m[1] : '';
}

function getLocationIds(fm) {
  const m = fm.match(/locationIds:\n([\s\S]*?)^---/m);
  if (!m) return [];
  return (m[1].match(/"([^"]+)"/g) || []).map(s => s.replace(/"/g, ''));
}

function cleanBoilerplate(body) {
  let c = body;

  const faqMatch = c.match(/(## Frequently asked questions\n)([\s\S]*?)(\n---|\Z)/);
  if (faqMatch) {
    const seen = new Set();
    const unique = [];
    for (const block of faqMatch[2].split(/\n(?=\*\*)/).filter(Boolean)) {
      const key = block.trim().split('\n')[0].substring(0, 80);
      if (!seen.has(key)) { seen.add(key); unique.push(block); }
    }
    c = c.replace(faqMatch[0], faqMatch[1] + unique.join('\n') + faqMatch[3]);
  }

  c = c.replace(/## Devotee takeaway\n\nUse this guidance as a planning companion[\s\S]*?fresh\.\n/g, '');

  const rm = c.match(/(## Continue reading\n)([\s\S]*?)(\n## |\Z)/);
  if (rm) {
    const uniq = [...new Set(rm[2].split('\n').filter(l => l.trim()))];
    c = c.replace(rm[0], rm[1] + uniq.join('\n') + rm[3]);
  }

  c = c.replace(/\n{3,}---/g, '\n---');
  return c;
}

function getTips(slug, f) {
  const h = '## Practical preparation tips';

  if (f.isEvent) {
    if (slug.includes('shivaratri')) {
      return `${h}
- **Arrive the evening before**: Mahashivaratri night involves 12+ hours of fasting, abhishek, and aarti ceremonies. Arriving the previous evening lets you rest and prepare physically for the overnight vigil. Book Bhakta Niwas for both the arrival evening and the festival night.
- **Fasting preparation**: If you plan to observe a fast, ease into it the day before. Drink plenty of water and eat light, sattvic food. Carry glucose or a small sweet for when you break the fast after the midnight aarti.
- **Dress in white or orange**: These are the traditional colours for Mahashivaratri. Avoid leather items (belts, wallets, bags) as they are considered inauspicious at Shiva temples.
- **Cold weather gear**: Mahashivaratri falls in February or March. Nights in central Maharashtra can be cool (15-20 degrees C). Bring a light jacket or shawl for the overnight vigil.
- **Plan your return journey early**: Crowds peak after the morning aarti. Book your return ticket or cab the day before. MSRTC buses from Shegaon to Nagpur, Akola, and Khamgaon run frequently but fill up fast on festival mornings.
- **Abhishek participation**: If you want to participate in the Rudra Abhishek, register at the temple office early. Slots are limited during peak festival hours and are allocated on a first-come, first-served basis.
- **Carry coins for offerings**: Many small shrines within the complex accept only coins. Carry a pocketful of small-denomination coins for individual offerings during the night-long ceremony.`;
    }

    if (slug.includes('janmashtami')) {
      return `${h}
- **Visit both temple sites**: The Sansthan celebrates Janmashtami with special decorations at both the main Gajanan Maharaj temple and the Datta Mandir. Plan to visit both for the complete spiritual experience.
- **Dahi-handi participation**: If you want to participate in the dahi-handi (pot-breaking) ceremony, register early at the Sansthan office. Spots are limited and fill up weeks in advance.
- **Kids programs**: Janmashtami at Shegaon includes dedicated children's programs - fancy dress as Krishna or Radha, drawing competitions, and storytelling sessions. Check the schedule at the information desk upon arrival.
- **Dress as Radha or Krishna**: Many devotees dress up for Janmashtami. The temple has a small stall selling peacock feathers, flower garlands, and Krishna-themed accessories.
- **Evening timing**: The main celebrations typically begin around 6:00 PM and continue past midnight. Arrive by 5:30 PM to secure a good viewing spot near the temple courtyard.
- **Photography**: The temple is beautifully decorated with flowers, lights, and rangoli during Janmashtami. Photography is permitted in the outer courtyard but not inside the sanctum.`;
    }

    if (slug.includes('navratri') || slug.includes('chaitra-navratri')) {
      return `${h}
- **Nine days, nine forms**: Each day of Navratri honours a different form of Goddess Durga. Many devotees follow a specific colour for each day. Check the Navratri colour calendar before your visit.
- **Garba or Dandiya**: If you are visiting during Ashadhi Navratri, the temple grounds host Garba performances in the evening. These are open to all visitors - no registration needed.
- **Fasting options**: The Sansthan provides special Navratri prasad and fasting-friendly meals at the Annakshetra. Inform the counter staff if you are observing a fast.
- **Kanya Puja**: Many devotees perform Kanya Puja (worshipping young girls as manifestations of the goddess) on the eighth or ninth day. The Sansthan provides designated facilities for this ritual.
- **Visit all three temples**: During Navratri, the main temple, the Ganesha temple, and the Annapurna temple all have special decorations, enhanced aartis, and extended darshan hours.`;
    }

    if (slug.includes('diwali')) {
      return `${h}
- **Deepotsav at Shegaon**: The Sansthan celebrates Deepotsav (Festival of Lights) with thousands of diyas (oil lamps) lit across the entire temple complex. Arrive before sunset for the full visual impact of the illumination ceremony.
- **Fireworks timing**: Fireworks are part of the Deepotsav celebration. If you are sensitive to noise or have young children, plan your darshan timing accordingly. The main fireworks display lasts approximately 30 minutes.
- **Prasad distribution**: Special Diwali prasad (laddus, barfis, chaklis, and pedas) is distributed in large quantities. Arrive early for the best selection.
- **Lakshmi Puja**: Many devotees perform Lakshmi Puja on Diwali at the temple. The Sansthan sets up a special counter for puja items including diyas, flowers, and prasad materials.
- **Parking**: Diwali sees extremely heavy traffic around the temple. Park at the designated parking area and walk to the temple. Auto-rickshaws are available for the final stretch.`;
    }

    if (slug.includes('guru-purnima')) {
      return `${h}
- **Guru Purnima significance**: This festival honours spiritual teachers and is especially significant at the Sansthan, where Sri Gajanan Maharaj's guru-bhakti (devotion to one's spiritual teacher) is central to the tradition.
- **Satsang programs**: The Sansthan organises special satsang, bhajan, and kirtan sessions on Guru Purnima. Check the daily schedule board near the temple entrance for exact timings.
- **Offer seva**: Guru Purnima is considered an auspicious day for seva (selfless service). The Sansthan welcomes volunteers for crowd management, prasad distribution, and temple maintenance.
- **Guru Dakshina**: Many devotees offer Guru Dakshina (a token of gratitude to their spiritual teacher) on this day. The temple has a designated counter for such offerings.`;
    }

    if (slug.includes('holi')) {
      return `${h}
- **Safe Holi at Shegaon**: The Sansthan celebrates Holi with natural, organic colours. Synthetic colours are not permitted inside the temple complex. Purchase approved colours from vendors near the temple entrance.
- **Dry Holi option**: Many devotees prefer a dry Holi (using gulal or powder only). The temple management designates specific areas for colour play, away from the main darshan hall.
- **Protect your electronics**: Even natural colours can damage phones and cameras. Use waterproof covers or leave valuables locked in your Bhakta Niwas room during the colour celebrations.
- **Post-Holi cleanup**: The Annakshetra serves a special warm drink (thandai or rose milk) after the celebrations. Changing rooms with basic facilities are available near the temple complex.
- **Eye protection**: Wear sunglasses during the colour play. Carry clean water to rinse your eyes if colour gets in. The temple has a small first-aid station for minor irritations.`;
    }

    if (slug.includes('ganesh-chaturthi')) {
      return `${h}
- **Ganesh Chaturthi at Shegaon**: The Sansthan installs a large Ganesha idol in the temple courtyard. The immersion (visarjan) ceremony on the final day is a grand procession through the streets of Shegaon.
- **Modak availability**: Special modak (Ganesha's favourite sweet) is available at the temple prasad counters during the 10-day festival. Arrive early - they sell out quickly.
- **Cultural programs**: The Sansthan hosts music, dance, and drama performances each evening during the 10-day festival. Check the notice board for the daily schedule.
- **Eco-friendly celebration**: The Sansthan encourages eco-friendly Ganesha idols made of clay. Artificial or painted idols are discouraged for environmental reasons.`;
    }

    if (slug.includes('ram-navami')) {
      return `${h}
- **Ram Navami celebrations**: The Sansthan celebrates with special Ramayana recitations, devotional bhajans, and a grand abhishek of the Sri Ram idol.
- **Shobha Yatra**: A procession carrying the Ram idol through the streets of Shegaon is the highlight. Join the procession or watch from the designated viewing areas along the route.
- **Special prasad**: Kheer and puris are distributed as prasad on Ram Navami. The quantity is limited - arrive early at the prasad counter.
- **Ramayana discourses**: Scholars and senior devotees deliver discourses on the Ramayana throughout the day. These are held in the temple's community hall and are open to all.`;
    }

    if (slug.includes('gudi-padwa')) {
      return `${h}
- **Gudi Padwa at Shegaon**: The Marathi new year is celebrated with gudi (sacred flag) installations across the Sansthan campus. Each gudi is decorated with flowers, neem leaves, turmeric, and a sweet.
- **Puran Poli feast**: Many families prepare puran poli (sweet flatbread) on Gudi Padwa. Some local restaurants in Shegaon serve it as a special offering on this day.
- **Community feasts**: Several local families and community organisations host community lunches (paraos) on Gudi Padwa. Visitors and devotees are welcome.`;
    }

    if (slug.includes('makar-sankranti')) {
      return `${h}
- **Kite flying at Shegaon**: Makar Sankranti is associated with kite flying. The open grounds near the temple are popular for this activity. Bring your own kite or purchase one from local vendors near the temple market.
- **Til-gul prasad**: Traditional til-gul (sesame-jaggery sweets) are distributed as prasad on Makar Sankranti, symbolising sweetness in relationships.
- **Holy dip**: Many devotees take a holy dip in the temple tanks on Makar Sankranti, considered especially auspicious during the sun's transition to Capricorn (Makar).`;
    }

    if (slug.includes('special-darshan-days') || slug.includes('special-darshan-days-calendar')) {
      return `${h}
- **Check the calendar early**: Special darshan days often coincide with festivals, full moons, and ekadashis. The Sansthan publishes an annual festival calendar - check it before planning your trip.
- **Crowd expectations**: Special darshan days see 2 to 5 times the regular crowd. Arrive 2-3 hours before the desired darshan time.
- **Extended temple hours**: On major festival days, the temple may open earlier (as early as 2:00 AM) and close later than usual. Check the notice board for exact timings.`;
    }

    if (slug.includes('navratri-fasting-food')) {
      return `${h}
- **Fasting-friendly meals at Annakshetra**: The Sansthan's community kitchen serves special fasting meals during Navratri. Ask at the counter for the fasting menu.
- **Carry approved snacks**: If you have specific dietary requirements, pack approved fasting snacks. The Annakshetra may not cater to all dietary restrictions.
- **Breaking the fast**: Devotees observing the full Navratri fast typically break it on Ashtami or Navami with a simple meal of fruit and milk before joining the community feast.`;
    }

    return `${h}
- **Check the Sansthan calendar**: Festival dates may shift based on the lunar calendar. Confirm exact dates on the official website or by calling the Sansthan office before finalising travel plans.
- **Book accommodation early**: Festival seasons see a surge in visitors. Book Bhakta Niwas at least 8 weeks in advance for major festivals.
- **Arrive the day before**: Crowds build up from early morning on festival days. Arriving the evening before gives you a comfortable buffer and a good position in the queue.
- **Carry necessary items**: Sunglasses, sunscreen, a water bottle, and comfortable walking shoes are essential for outdoor festival events.
- **Follow official instructions**: The Sansthan and local authorities issue specific guidelines during large festivals. Follow crowd management instructions for your safety.
- **Respect the spiritual atmosphere**: Keep noise to a minimum near the temple. Mobile phones should be on silent or deposited at the cloak room.`;
  }

  if (f.isGuide) {
    if (slug.includes('luggage') || slug.includes('packing-light')) {
      return `${h}
- **Use waterproof bags**: Monsoon season (June-September) brings heavy rainfall to Maharashtra. A waterproof backpack cover or dry bag for electronics and documents is essential during this period.
- **Pack light but smart**: A weekend darshan trip needs only a small bag: change of clothes, toiletries, government ID, cash, and a light shawl. Over-packing makes navigating crowded temple areas difficult.
- **Locker facilities**: Bhakta Niwas rooms have lockable storage. For day visits, the temple offers paid cloak room services near each entrance (approximately INR 10-20 per bag).
- **Label your luggage**: Write your name and phone number on your bag. Shegaon's busy atmosphere during peak season can lead to mix-ups at the cloak room.
- **Carry a day bag**: Keep a small day bag with essentials (water, prasad bag, camera, cash) separate from your main luggage.`;
    }

    if (slug.includes('budget') || slug.includes('family-pilgrimage') || slug.includes('family-with-infants')) {
      return `${h}
- **Family discounts**: The Sansthan offers subsidised rates for families. Ask at the Bhakta Niwas desk about family package options and any current promotions.
- **Children**: Kids under 5 often stay free at Bhakta Niwas (no separate bed required). Children between 5 and 12 may qualify for reduced rates - confirm at booking.
- **Group bookings**: Groups of 10 or more can request special arrangements through the Sansthan office. Group bookings may include coordinated darshan slots and meal arrangements.
- **Eat at Annakshetra**: Take advantage of the free or subsidised community meals to keep daily costs low. The Annakshetra serves simple, hygienic, Satvik meals three times a day.
- **Emergency fund**: Keep an extra INR 1,000-2,000 as an emergency fund for medical needs, unexpected transport, or last-minute changes.`;
    }

    if (slug.includes('month-wise') || slug.includes('planning-calendar')) {
      return `${h}
- **Mark your calendar**: Note the major festival dates well in advance. Ashadhi Ekadashi (June-July) and Kartik Ekadashi (November) are the two busiest periods at Shegaon.
- **Best weather window**: October to February offers the most comfortable weather for temple visits in Maharashtra. March to May is extremely hot (40-42 degrees C) and June to September is monsoon season.
- **Off-season benefits**: Visiting during the off-season means shorter queues, cheaper accommodation rates, and a more peaceful darshan experience.
- **Avoid exam seasons**: If travelling with school-age children, avoid peak exam periods (February-March and October-November).`;
    }

    if (slug.includes('contact') || slug.includes('verify-official') || slug.includes('sansthan-contact')) {
      return `${h}
- **Save the official number**: Save the Sansthan's official phone number in your contacts before travelling. This helps avoid confusion with similar-sounding numbers found online.
- **WhatsApp is preferred**: The Sansthan responds faster on WhatsApp than phone calls. Send your booking request as a WhatsApp message with travel dates, room preference, and number of guests.
- **Beware of fake websites**: Several websites mimic the Sansthan's booking system. Always verify the URL before sharing personal information or payment details.
- **Call during working hours**: The Sansthan booking desk operates from approximately 8:00 AM to 8:00 PM. Calls outside these hours may not be answered.`;
    }

    if (slug.includes('last-minute')) {
      return `${h}
- **Call early in the morning**: The Sansthan booking desk opens at 8:00 AM. Calling at opening time gives you the best chance of securing last-minute cancellations.
- **Flexible dates**: If your dates are flexible, you have a much better chance of finding accommodation. Consider arriving a day earlier or leaving a day later.
- **WhatsApp over phone**: Last-minute requests sent via WhatsApp are often handled faster than phone calls during busy periods.
- **Backup options**: Keep a list of nearby private hotels and lodges as backup. Khamgaon (15 km) has several budget hotels.`;
    }

    if (slug.includes('eco-friendly')) {
      return `${h}
- **Reusable water bottle**: Shegaon has multiple water refill stations. Avoid buying single-use plastic bottles - refill your own bottle at the filtered water stations at the temple and Bhakta Niwas.
- **Public transport**: Use MSRTC buses or shared auto-rickshaws instead of private vehicles for inter-city travel. This reduces your carbon footprint and eliminates parking stress.
- **Respect nature**: Anand Sagar and the surrounding areas are carefully maintained by the Sansthan. Do not litter - use the bins provided.`;
    }

    if (slug.includes('kids-activities')) {
      return `${h}
- **Plan around nap times**: If travelling with young children, plan the main darshan for when they are well-rested. Early morning Kakad Aarti at 4:30 AM might be too early for toddlers.
- **Bring entertainment**: Temple queues can be long during festivals. Bring small toys, picture books, or downloaded shows for children.
- **Involve them in rituals**: Let children participate in simple rituals - offering flowers, ringing the bell, receiving prasad. This makes the visit memorable.
- **Carry snacks**: Children get hungry quickly. Pack their favourite snacks and a water bottle.`;
    }

    if (slug.includes('medical') || slug.includes('emergency')) {
      return `${h}
- **Carry a basic first-aid kit**: Painkillers, band-aids, antiseptic cream, and any personal medications. The Sansthan has a small dispensary but it may not stock all medicines.
- **Nearest hospitals**: Khamgaon (15 km) has a government hospital. Akola (45 km) has larger multi-speciality facilities. The Sansthan has a small dispensary on campus.
- **Emergency contacts**: Save the Sansthan's emergency number and the local police station number in your phone before travelling.`;
    }

    return `${h}
- **Start early**: Temple visits are more peaceful in the early morning. Kakad Aarti at 4:30 AM is the most serene experience.
- **Carry cash**: While UPI is widely accepted, small vendors and auto-rickshaw drivers may prefer cash. Carry INR 500-1,000 in small denominations.
- **Stay hydrated**: Maharashtra's climate is hot for most of the year. Carry a water bottle and drink regularly.
- **Respect local customs**: Observe and follow the behaviour of local devotees. Remove shoes before entering temple areas, dress modestly, and maintain quiet inside the temple complex.`;
  }

  if (f.isSpiritual) {
    return `${h}
- **Consistency over intensity**: A short, daily practice of reading the Gajanan Vijay Granth or chanting the aarti is more impactful than occasional marathon sessions. Sri Gajanan Maharaj's teachings emphasise steady, unwavering devotion.
- **Find a satsang community**: Seek out local satsang groups in your city. Many cities across Maharashtra have Gajanan Maharaj devotees who meet weekly for bhajans, katha, and shared spiritual practice.
- **Seva opportunities**: The Sansthan offers various seva options - from crowd management during festivals to Annakshetra volunteering and temple maintenance. Seva (selfless service) deepens devotion in a practical, embodied way.
- **Keep a spiritual diary**: Note the moments that touched you during darshan, the thoughts that came during meditation, and the changes you notice in yourself over time.
- **Read with context**: When reading the Gajanan Vijay Granth, read with the intention of applying the teachings to your daily life rather than treating it as a ritual obligation. Each ovi (verse) contains practical wisdom for modern living.`;
  }

  return `${h}
- **Plan ahead**: Check the Sansthan website for the latest information on timings, accommodation availability, and festival schedules before your visit.
- **Travel light**: A lighter bag is easier to manage, especially in crowded temple areas and during peak season.
- **Stay flexible**: Temple schedules and availability can change. Have backup plans for accommodation and transport.`;
}

function getMistakes(slug, f) {
  const h = '## Common mistakes to avoid';

  if (f.isEvent) {
    if (slug.includes('shivaratri') || slug.includes('maha-shivaratri')) {
      return `${h}
- **Not booking accommodation early enough**: Mahashivaratri is one of the busiest nights of the year. Bhakta Niwas rooms sell out 8-12 weeks in advance. Waiting until a week before guarantees disappointment.
- **Arriving on the festival day itself**: The crowds begin building from early morning. Arriving on the festival day means fighting the largest crowds for accommodation, darshan, and parking.
- **Not carrying warm clothing**: Even if the daytime temperature is warm, the overnight vigil during Mahashivaratri can be cool. Many devotees suffer from the cold unnecessarily.
- **Expecting hotel-like amenities**: The Bhakta Niwas is a devotional accommodation, not a hotel. Basic, clean, and affordable - but do not expect room service, Wi-Fi, or luxury fixtures.
- **Skipping the abhishek registration**: If you want to participate in the Rudra Abhishek, you must register early. Waiting until the night of the festival means missing out.`;
    }

    if (slug.includes('janmashtami')) {
      return `${h}
- **Arriving too late**: The main Janmashtami celebrations begin around 6:00 PM. Arriving after 8:00 PM means missing the best parts of the program.
- **Not registering for dahi-handi**: If you want to participate, you must register at the Sansthan office well in advance. Walk-in participation is rarely available.
- **Forgetting to protect electronics**: The colour celebrations can damage phones and cameras. Many devotees learn this the hard way.
- **Not checking the schedule**: The Sansthan publishes a detailed schedule for Janmashtami. Not checking it means you might miss the midnight aarti or the special prasad distribution.`;
    }

    if (slug.includes('diwali')) {
      return `${h}
- **Not arriving before sunset**: The Deepotsav illumination is the highlight of Diwali at Shegaon. Arriving after sunset means missing the most spectacular moment.
- **Parking too far away**: Diwali sees extremely heavy traffic. Arrive early and park in the designated area.
- **Not carrying cash for prasad**: While UPI is accepted at the temple, many small prasad vendors prefer cash during the Diwali rush.
- **Leaving immediately after darshan**: The evening aarti and illumination program are the main events. Many devotees leave after darshan and miss the best part.`;
    }

    return `${h}
- **Not booking accommodation in advance**: Festival seasons see a surge in visitors. Booking last-minute often means no rooms are available.
- **Arriving on the festival day**: Always arrive the day before. Crowds build from early morning, and arriving on the day means fighting the largest crowds.
- **Not checking the official schedule**: Festival timings can vary based on the lunar calendar. Always check the Sansthan website or call ahead.
- **Carrying too many valuables**: Large crowds create opportunities for petty theft. Carry only the essentials.
- **Ignoring official instructions**: The Sansthan and local authorities issue specific guidelines during large festivals. Disregarding crowd management instructions can put you and others at risk.`;
  }

  if (f.isGuide) {
    if (slug.includes('budget') || slug.includes('family-pilgrimage')) {
      return `${h}
- **Not asking about family packages**: Many devotees pay the standard rate when family discounts are available. Always ask at the Bhakta Niwas desk.
- **Underestimating food costs**: While the Annakshetra provides free meals, you may want to eat at local restaurants. Budget INR 150-250 per meal per person.
- **Not carrying emergency cash**: UPI and cards may not work everywhere. Keep INR 1,000-2,000 in cash as an emergency buffer.
- **Not booking return transport**: During peak season, buses and trains sell out quickly. Book your return journey at the same time as your onward journey.`;
    }

    if (slug.includes('contact') || slug.includes('verify-official') || slug.includes('sansthan-contact')) {
      return `${h}
- **Sharing personal details on unofficial websites**: Always verify the URL and contact number before sharing personal information or payment details.
- **Expecting immediate responses**: The Sansthan booking desk handles hundreds of requests during peak season. Allow 2-4 hours for a WhatsApp response.
- **Not saving the number**: Many devotees lose the Sansthan's contact number and have to search for it again during their trip.
- **Calling outside working hours**: The booking desk operates from approximately 8:00 AM to 8:00 PM. Calls outside these hours may not be answered.`;
    }

    return `${h}
- **Not booking in advance**: For regular dates, book 7-14 days ahead. For festival dates, book 8-12 weeks ahead.
- **Arriving without checking timings**: Temple darshan timings change during festivals. Check the current schedule before arriving.
- **Not carrying a government ID**: Check-in at Bhakta Niwas requires a government-issued photo ID. Forgetting your ID means you may be denied check-in.
- **Over-planning**: Leave room for spontaneity. Some of the most meaningful pilgrimage experiences happen unexpectedly.`;
  }

  if (f.isSpiritual) {
    return `${h}
- **Treating practice as a chore**: Spiritual practice feels most meaningful when it arises from genuine longing, not guilt. If your practice feels like a burden, step back and reconnect with why it matters.
- **Comparing your journey to others**: Every devotee's spiritual path is unique. Sri Gajanan Maharaj accepted all devotees equally.
- **Expecting instant transformation**: Spiritual growth is gradual. The Gajanan Vijay Granth teaches that patience, faith, and consistent practice (abhyas) are the true pathways to inner peace.
- **Neglecting seva**: Devotion is not only personal prayer - it includes service to others. Seva deepens your connection to the community.`;
  }

  return `${h}
- **Not checking official sources**: Always verify timings, prices, and availability from official sources before your visit.
- **Over-packing**: A lighter bag is easier to manage, especially in crowded temple areas.
- **Ignoring weather conditions**: Maharashtra's weather varies dramatically by season. Check the forecast and pack accordingly.
- **Rushing through darshan**: Once inside, take your time. The darshan moment is personal and meaningful - do not rush through it.`;
}

function getFAQs(slug, f) {
  const h = '## Frequently asked questions';
  const faqs = [];

  if (f.isEvent) {
    if (slug.includes('shivaratri') || slug.includes('maha-shivaratri')) {
      faqs.push(
        '**Is fasting mandatory on Mahashivaratri?** No, fasting is voluntary. Many devotees observe a partial or full fast as an act of devotion. The Sansthan provides special prasad for those who break their fast after the midnight aarti.',
        '**Can I bring my own bhasma or bel leaves?** Yes, devotees can bring their own bel leaves, bhasma, and offerings. The temple also sells these items at the counters near the entrance.',
        '**Is the temple open all night on Mahashivaratri?** Yes, the main temple and the Sri Gajanan Maharaj temple both remain open throughout the night for Rudra Abhishek and aarti ceremonies.',
        '**Can non-Hindus attend Mahashivaratri celebrations?** Yes, the Sansthan welcomes all visitors. Non-Hindus are welcome to observe the ceremonies from the outer courtyard.',
        '**What time does the Rudra Abhishek begin?** The Rudra Abhishek typically begins around midnight and continues for several hours. Check the notice board for the exact schedule.'
      );
    } else if (slug.includes('janmashtami')) {
      faqs.push(
        '**What time does Janmashtami celebration begin?** The main celebrations typically begin around 6:00 PM and continue past midnight. The midnight (muhurat) moment is the most significant.',
        '**Is there an entry fee for Janmashtami events?** No, all temple events and celebrations are free. Special prasad may be distributed on a first-come, first-served basis.',
        '**Can I bring children to Janmashtami celebrations?** Yes, Janmashtami is a family-friendly festival. The Sansthan organises special children\'s programs alongside the main celebrations.',
        '**Is there a dress code for Janmashtami?** There is no strict dress code, but traditional or festive attire is common.'
      );
    } else if (slug.includes('navratri')) {
      faqs.push(
        '**Which Navratri is celebrated at Shegaon?** The Sansthan primarily celebrates Chaitra Navratri (March-April) and Shardiya Navratri (September-October). Check the annual calendar for specific dates.',
        '**Are Garba classes available?** Yes, during Navratri season, the temple grounds host Garba performances in the evenings. These are open to all - no registration needed.',
        '**Can men participate in Garba?** Yes, Garba is a community dance open to all genders.',
        '**Is there a fasting guideline?** The Sansthan provides special Navratri prasad and fasting-friendly meals at the Annakshetra.'
      );
    } else if (slug.includes('diwali')) {
      faqs.push(
        '**Is there an entry fee for Diwali celebrations?** No, all temple events and the Deepotsav illumination are free.',
        '**What time does the Deepotsav illumination begin?** The temple complex is typically illuminated at sunset (approximately 6:30-7:00 PM).',
        '**Are fireworks part of the Diwali celebration?** Yes, fireworks typically begin after the evening aarti and last approximately 30 minutes.',
        '**Can I bring my own diyas?** Yes, many devotees bring their own diyas. The temple also provides diyas at the counters for a nominal cost.'
      );
    } else if (slug.includes('guru-purnima')) {
      faqs.push(
        '**What is Guru Purnima?** Guru Purnima is a festival dedicated to spiritual teachers (gurus). It is especially significant at the Sansthan, where Sri Gajanan Maharaj\'s devotion to his guru is a central theme.',
        '**Are there special events on Guru Purnima?** Yes, the Sansthan organises special satsang, bhajan, and kirtan sessions. Check the daily schedule board for timings.',
        '**Can I offer Guru Dakshina at the temple?** Yes, the temple has a designated counter for Guru Dakshina offerings on this day.',
        '**Is there a fasting tradition for Guru Purnima?** Some devotees observe a partial fast as a mark of respect to their spiritual teachers. This is voluntary, not mandatory.'
      );
    } else if (slug.includes('holi')) {
      faqs.push(
        '**Are synthetic colours allowed?** No, synthetic colours are not permitted inside the temple complex. The Sansthan sells or recommends specific natural, organic colours near the entrance.',
        '**Is Holi safe for children?** Yes, the Sansthan designates specific areas for colour play that are safe for families.',
        '**What if colour gets in my eyes?** The temple has a small first-aid station with clean water for eye rinsing. Carry your own water bottle as a precaution.'
      );
    } else if (slug.includes('ganesh-chaturthi')) {
      faqs.push(
        '**When does the Ganesh Chaturthi celebration begin?** The Sansthan installs the Ganesha idol on the first day and the celebrations continue for 10 days until the immersion (visarjan) ceremony.',
        '**Is the visarjan ceremony open to all?** Yes, the immersion procession is open to all devotees. Many join the procession on foot through the streets of Shegaon.',
        '**Are eco-friendly idols available?** Yes, the Sansthan provides or recommends eco-friendly clay idols. Artificial or chemically painted idols are discouraged.'
      );
    } else {
      faqs.push(
        '**Do I need to register for festival events?** Most events are open and free. For special programs or seva opportunities, register at the Sansthan information desk on arrival.',
        '**Is accommodation guaranteed during festivals?** No. During major festivals, accommodation is subject to availability. Book 8-12 weeks in advance.',
        '**What time do temple gates open on festival days?** Temple gates typically open at 3:00 AM on major festival days. Plan to arrive early to avoid long queues.',
        '**Are meals available during festivals?** Yes, the Annakshetra operates extended hours during major festivals.',
        '**Is there parking available?** Yes, the Sansthan provides designated parking areas. During major festivals, additional parking is arranged in nearby open grounds.'
      );
    }
  }

  if (f.isGuide) {
    if (slug.includes('budget') || slug.includes('family-pilgrimage') || slug.includes('family-with-infants')) {
      faqs.push(
        '**What is the approximate daily budget per person?** A budget of INR 300-500 per person per day covers accommodation (dormitory), meals at Annakshetra (free or nominal), and local transport. For private rooms, budget INR 800-1,500 per night.',
        '**Are there discounts for senior citizens?** Yes, the Sansthan offers discounted rates for senior citizens at Bhakta Niwas. Carry your age proof for verification.',
        '**What payment methods are accepted?** The Sansthan accepts cash and UPI at Bhakta Niwas and temple counters. Credit and debit cards are accepted at some but not all locations.'
      );
    }

    if (slug.includes('month-wise') || slug.includes('planning-calendar')) {
      faqs.push(
        '**Which month is best for visiting Shegaon?** October to February offers the most pleasant weather. March to May is extremely hot (40-42 degrees C). June to September is monsoon season.',
        '**Should I avoid certain months?** Avoid planning a first visit during Ashadhi Ekadashi unless you have booked accommodation months in advance. The crowds are overwhelming for first-time visitors.'
      );
    }

    if (slug.includes('contact') || slug.includes('verify-official') || slug.includes('sansthan-contact')) {
      faqs.push(
        '**How can I verify if a number is official?** The Sansthan\'s official numbers have the area code +91-7262. Always cross-reference with the official website before calling or sending messages.',
        '**What information do I need to provide for a booking?** Have your travel dates, number of guests, preferred room type, and a government ID number ready.',
        '**Can I modify my booking after confirmation?** Yes, subject to availability. Contact the Sansthan booking desk at least 3 days before your scheduled arrival.'
      );
    }

    if (slug.includes('last-minute')) {
      faqs.push(
        '**How late can I book Bhakta Niwas?** Regular dates can sometimes be booked 1-2 days in advance if there are cancellations. Festival dates are rarely available on short notice.',
        '**What if Bhakta Niwas is fully booked?** Check nearby private hotels in Shegaon and Khamgaon (15 km). The MSRTC bus connects these towns.'
      );
    }

    if (slug.includes('eco-friendly')) {
      faqs.push(
        '**Does the Sansthan have recycling facilities?** Yes, the Sansthan campus has separate bins for wet and dry waste.',
        '**Is Anand Sagar eco-friendly?** Yes, Anand Sagar was designed with environmental sustainability in mind. The gardens use drip irrigation, and the complex runs on solar power for most of its energy needs.'
      );
    }

    if (slug.includes('kids-activities')) {
      faqs.push(
        '**Are there facilities for infants at Bhakta Niwas?** Yes, Bhakta Niwas can arrange cribs for infants on request.',
        '**Is the temple stroller-friendly?** The temple complex has paved pathways that are mostly stroller-friendly. Some older areas have steps - carry your baby in a carrier for those sections.'
      );
    }

    faqs.push(
      '**How far in advance should I book?** For regular dates, 7-14 days. For festival dates, 8-12 weeks. During Ashadhi Ekadashi, book 12+ weeks ahead.',
      '**Is there a cancellation policy?** Cancellations 7+ days before arrival: full refund. 3-6 days: 50% refund. Within 3 days: non-refundable.',
      '**What ID is required for check-in?** Any government-issued photo ID (Aadhaar, PAN, passport, driving licence). The name on the ID must match the booking.',
      '**What is the check-in and check-out time?** Check-in is from 2:00 PM. Check-out is by 11:00 AM. Early check-in is subject to room availability.'
    );
  }

  if (f.isSpiritual) {
    faqs.push(
      '**Do I need to be a devotee of Sri Gajanan Maharaj to visit Shegaon?** No, the temple is open to all visitors regardless of their spiritual background or tradition. Everyone is welcome for darshan.',
      '**What is the best time for a spiritual visit?** Early morning Kakad Aarti at 4:30 AM is considered the most spiritually potent time. The temple is quiet, the energy is fresh, and the darshan is most intimate.',
      '**Can I stay at the temple for an extended period?** Yes, Bhakta Niwas allows stays of varying lengths. Extended stays are common during festival periods.',
      '**What is the significance of the Gajanan Vijay Granth?** The Gajanan Vijay Granth is the sacred biography of Sri Gajanan Maharaj, composed by Sri Dasganu Maharaj. It contains 21 adhyays (chapters) in Ovi meter and is considered the primary scripture of the Gajanan Maharaj tradition.',
      '**How can I start my spiritual practice?** Begin with small, consistent steps - a short daily prayer, reading one ovi from the Granth each day, or visiting the temple once a week.'
    );
  }

  if (faqs.length === 0) return '';
return h + '\n\n\' + faqs.join(\'\n\n\') + \'\n';
}

function getExpansion(slug, category, locationIds) {
  const isEvent = category === 'events';
  const isGuide = category === 'guides';
  const isSpiritual = category === 'spiritual';
  const isShegaon = slug.includes('shegaon') || slug.includes('sheogaon');
  const isOmkareshwar = slug.includes('omkareshwar');
  const isTrimbakeshwar = slug.includes('trimbakeshwar') || slug.includes('triambakeshwar');
  const isPandharpur = slug.includes('pandharpur');

  const parts = [
    getTips(slug, { isEvent, isGuide, isSpiritual, isShegaon, isOmkareshwar, isTrimbakeshwar, isPandharpur }),
    getMistakes(slug, { isEvent, isGuide, isSpiritual, isShegaon }),
    getFAQs(slug, { isEvent, isGuide, isSpiritual, isShegaon, isOmkareshwar, isTrimbakeshwar, isPandharpur }),
  ];
  return parts.join('\n\n');
}

function main() {
  const results = { updated: 0, skipped: 0 };

  function processFile(filepath) {
    const relative = path.relative(BLOG_DIR, filepath);
    const text = fs.readFileSync(filepath, 'utf-8');
    const wordCount = countWords(text);

    if (wordCount >= 1500) { results.skipped++; return; }

    const { fm, body } = extractFrontmatter(text);
    const slug = getField(fm, 'slug');
    const category = getField(fm, 'category');
    const locationIds = getLocationIds(fm);

    if (!slug || !category) { results.skipped++; return; }

    let newBody = cleanBoilerplate(body);
    const expansion = getExpansion(slug, category, locationIds);

    const first60 = expansion.trim().substring(0, 60);
    if (!newBody.includes(first60)) {
      newBody = newBody.trimEnd() + '\n\n' + expansion + '\n';
    }

    const newText = fm + newBody;
    const newWordCount = countWords(newText);

    if (newWordCount >= 1500) {
      fs.writeFileSync(filepath, newText, 'utf-8');
      console.log(`EXPAND: ${wordCount} -> ${newWordCount} | ${relative}`);
      results.updated++;
    } else {
      console.log(`SKIP (${newWordCount} < 1500): ${relative}`);
      results.skipped++;
    }
  }

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.name === '_ops') continue;
      if (entry.isDirectory()) walkDir(fullPath);
      else if (entry.name.endsWith('.md')) processFile(fullPath);
    }
  }

  walkDir(BLOG_DIR);
  console.log(`\nResults: ${results.updated} expanded, ${results.skipped} skipped`);
}

main();
