/**
 * File: scripts/gold-standard-batch-tooling.mjs
 * Module: scripts
 * Purpose: Topic table, date assignment, collision checks, and progress status
 *          for the 2026-09 gold-standard manual batch (100 posts).
 * Notes:
 * - Single source of truth mirrors docs/superpowers/specs/2026-09-05-100-gold-blogs-design.md.
 * - `init` writes the batch metadata JSON into content/blog/_ops (tracked by git).
 * - `check` must pass before any post file is written.
 * - `status` reports filesystem progress (missing files are unwritten posts).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_ROOT = path.join(process.cwd(), "content/blog");
const OPS_DIR = path.join(BLOG_ROOT, "_ops");
const METADATA_PATH = path.join(OPS_DIR, "gold-standard-batch-2026-09.json");

// [n, dir, slug, primaryKeyword] — date/category/image/locationIds/tags derive from n and dir.
const TOPICS = [
  [1, "guides", "gajanan-maharaj-sansthan-online-room-booking", "gajanan maharaj sansthan online room booking"],
  [2, "guides", "gajanan-maharaj-sansthan-room-booking-phone-number", "gajanan maharaj sansthan room booking phone number"],
  [3, "guides", "gajanan-maharaj-sansthan-room-booking-whatsapp-guide", "gajanan maharaj sansthan whatsapp room booking"],
  [4, "guides", "bhakta-niwas-room-availability-check-guide", "bhakta niwas room availability check"],
  [5, "guides", "bhakta-niwas-booking-payment-methods-guide", "bhakta niwas booking payment methods"],
  [6, "guides", "bhakta-niwas-booking-confirmation-process", "bhakta niwas booking confirmation process"],
  [7, "guides", "bhakta-niwas-booking-advance-amount-guide", "bhakta niwas advance payment rules"],
  [8, "guides", "bhakta-niwas-ac-room-booking-guide", "bhakta niwas ac room booking"],
  [9, "guides", "bhakta-niwas-family-room-booking-guide", "bhakta niwas family room booking"],
  [10, "guides", "bhakta-niwas-dormitory-booking-guide", "bhakta niwas dormitory booking"],
  [11, "guides", "bhakta-niwas-room-booking-for-weekend", "bhakta niwas weekend room booking"],
  [12, "guides", "bhakta-niwas-same-day-booking-guide", "bhakta niwas same day room booking"],
  [13, "guides", "bhakta-niwas-booking-modification-guide", "bhakta niwas booking date change"],
  [14, "guides", "bhakta-niwas-booking-rules-and-terms", "bhakta niwas booking rules"],
  [15, "guides", "bhakta-niwas-vs-hotels-comparison", "bhakta niwas vs hotel stay"],
  [16, "guides", "bhakta-niwas-vs-ota-direct-booking", "direct booking vs ota pilgrimage stay"],
  [17, "guides", "sansthan-room-booking-for-senior-citizens", "senior citizen room booking sansthan"],
  [18, "guides", "sansthan-room-booking-id-and-document-requirements", "id proof for sansthan room booking"],
  [19, "guides", "sansthan-room-booking-with-darshan-combo", "room and darshan combo booking"],
  [20, "guides", "bhakta-niwas-check-in-process-all-locations", "bhakta niwas check in process"],
  [21, "guides", "bhakta-niwas-room-booking-calendar", "sansthan room booking month wise calendar"],
  [22, "guides", "sansthan-room-booking-mistakes-to-avoid", "sansthan room booking mistakes"],
  [23, "guides", "bhakta-niwas-long-stay-room-booking-rules", "bhakta niwas long stay rules"],
  [24, "guides", "sansthan-canteen-mahaprasad-with-room-booking", "room booking with mahaprasad plan"],
  [25, "guides", "bhakta-niwas-room-booking-with-elderly-parents", "booking rooms for elderly parents pilgrimage"],
  [26, "guides", "sansthan-room-booking-safety-and-security-guide", "safe room booking for women devotees"],
  [27, "guides", "bhakta-niwas-booking-customer-support-guide", "bhakta niwas booking support help"],
  [28, "guides", "sansthan-four-location-room-booking-overview", "sansthan rooms at four locations overview"],
  [29, "locations/shegaon", "shegaon-bhakta-niwas-check-in-check-out-timings", "shegaon bhakta niwas check in check out timings"],
  [30, "locations/shegaon", "shegaon-bhakta-niwas-online-booking-vs-whatsapp", "shegaon bhakta niwas online booking vs whatsapp"],
  [31, "locations/shegaon", "shegaon-bhakta-niwas-refund-and-cancellation-guide", "shegaon bhakta niwas refund and cancellation"],
  [32, "locations/shegaon", "shegaon-bhakta-niwas-dormitory-vs-family-rooms", "shegaon bhakta niwas dormitory vs family rooms"],
  [33, "locations/shegaon", "shegaon-bhakta-niwas-room-types-and-facilities", "shegaon bhakta niwas room types and facilities"],
  [34, "locations/shegaon", "shegaon-bhakta-niwas-common-booking-mistakes", "shegaon bhakta niwas booking mistakes"],
  [35, "locations/shegaon", "shegaon-room-booking-near-samadhi-mandir", "shegaon room booking near samadhi mandir"],
  [36, "locations/shegaon", "shegaon-bhakta-niwas-booking-confirmation-timeline", "shegaon bhakta niwas booking confirmation timeline"],
  [37, "locations/shegaon", "shegaon-visawa-room-booking-guide", "shegaon visawa room booking"],
  [38, "locations/shegaon", "shegaon-room-booking-during-ekadashi-and-festivals", "shegaon room booking during ekadashi"],
  [39, "locations/shegaon", "shegaon-bhakta-niwas-advance-payment-guide", "shegaon bhakta niwas advance payment"],
  [40, "locations/shegaon", "shegaon-same-day-room-booking-options", "shegaon same day room booking"],
  [41, "locations/shegaon", "shegaon-gajanan-maharaj-temple-complete-visitor-guide", "shegaon gajanan maharaj temple visitor guide"],
  [42, "locations/shegaon", "shegaon-train-timings-and-stay-planning", "shegaon train timings and stay"],
  [43, "locations/shegaon", "shegaon-one-day-vs-two-day-visit-planning", "shegaon one day vs two day visit"],
  [44, "locations/shegaon", "shegaon-family-trip-itinerary-with-room-booking", "shegaon family trip with room booking"],
  [45, "locations/shegaon", "shegaon-darshan-and-stay-same-trip-planning", "shegaon darshan and stay planning"],
  [46, "locations/shegaon", "shegaon-nearby-devasthan-visit-with-overnight-stay", "shegaon nearby devasthan overnight stay"],
  [47, "locations/pandharpur", "pandharpur-bhakta-niwas-check-in-check-out-timings", "pandharpur bhakta niwas check in check out timings"],
  [48, "locations/pandharpur", "pandharpur-bhakta-niwas-online-booking-vs-whatsapp", "pandharpur bhakta niwas online booking vs whatsapp"],
  [49, "locations/pandharpur", "pandharpur-bhakta-niwas-refund-and-cancellation-guide", "pandharpur bhakta niwas refund and cancellation"],
  [50, "locations/pandharpur", "pandharpur-bhakta-niwas-dormitory-vs-family-rooms", "pandharpur bhakta niwas dormitory vs family rooms"],
  [51, "locations/pandharpur", "pandharpur-bhakta-niwas-room-types-and-facilities", "pandharpur bhakta niwas room types and facilities"],
  [52, "locations/pandharpur", "pandharpur-bhakta-niwas-common-booking-mistakes", "pandharpur bhakta niwas booking mistakes"],
  [53, "locations/pandharpur", "pandharpur-wari-accommodation-booking-guide", "pandharpur wari accommodation booking"],
  [54, "locations/pandharpur", "pandharpur-ashadhi-ekadashi-room-booking", "pandharpur ashadhi ekadashi room booking"],
  [55, "locations/pandharpur", "pandharpur-vitthal-rukmini-darshan-and-stay-plan", "pandharpur vitthal rukmini darshan and stay"],
  [56, "locations/pandharpur", "pandharpur-chandrabhaga-snana-and-stay-planning", "pandharpur chandrabhaga snana stay"],
  [57, "locations/pandharpur", "pandharpur-room-booking-near-vitthal-temple", "pandharpur room booking near vitthal temple"],
  [58, "locations/pandharpur", "pandharpur-kartik-ekadashi-stay-booking", "pandharpur kartik ekadashi stay booking"],
  [59, "locations/pandharpur", "pandharpur-math-bhakta-niwas-complete-guide", "pandharpur math bhakta niwas guide"],
  [60, "locations/pandharpur", "pandharpur-two-day-itinerary-with-overnight-stay", "pandharpur two day itinerary with stay"],
  [61, "locations/omkareshwar", "omkareshwar-ac-room-booking-guide", "omkareshwar ac room booking"],
  [62, "locations/omkareshwar", "omkareshwar-jyotirlinga-darshan-and-room-booking-combo", "omkareshwar darshan and room booking combo"],
  [63, "locations/omkareshwar", "omkareshwar-room-booking-from-indore", "omkareshwar room booking from indore"],
  [64, "locations/omkareshwar", "omkareshwar-mandhata-island-stay-guide", "omkareshwar mandhata island stay"],
  [65, "locations/omkareshwar", "omkareshwar-family-room-booking-guide", "omkareshwar family room booking"],
  [66, "locations/omkareshwar", "omkareshwar-group-room-booking-guide", "omkareshwar group room booking"],
  [67, "locations/omkareshwar", "omkareshwar-winter-devotee-stay-guide", "omkareshwar winter stay planning"],
  [68, "locations/omkareshwar", "omkareshwar-darshan-queue-and-stay-timing-plan", "omkareshwar darshan queue and stay timing"],
  [69, "locations/omkareshwar", "omkareshwar-one-night-stay-plan", "omkareshwar one night stay plan"],
  [70, "locations/omkareshwar", "omkareshwar-room-booking-with-elderly-devotees", "omkareshwar elderly devotee room booking"],
  [71, "locations/omkareshwar", "omkareshwar-narmada-parikrama-stay-planning", "omkareshwar narmada parikrama stay"],
  [72, "locations/omkareshwar", "omkareshwar-mahashivratri-room-booking", "omkareshwar mahashivratri room booking"],
  [73, "locations/omkareshwar", "omkareshwar-first-timer-stay-and-darshan-plan", "omkareshwar first timer stay plan"],
  [74, "locations/omkareshwar", "omkareshwar-sawan-room-availability-guide", "omkareshwar sawan room availability"],
  [75, "locations/trimbakeshwar", "trimbakeshwar-narayan-nagbali-pooja-stay-booking", "trimbakeshwar narayan nagbali pooja stay booking"],
  [76, "locations/trimbakeshwar", "trimbakeshwar-kaal-sarp-dosh-pooja-and-stay-plan", "trimbakeshwar kaal sarp dosh pooja stay"],
  [77, "locations/trimbakeshwar", "trimbakeshwar-kumbh-mela-nashik-stay-guide", "trimbakeshwar kumbh mela stay guide"],
  [78, "locations/trimbakeshwar", "trimbakeshwar-room-booking-near-temple-walking-distance", "trimbakeshwar room booking near temple"],
  [79, "locations/trimbakeshwar", "trimbakeshwar-monsoon-visit-and-room-booking", "trimbakeshwar monsoon visit and rooms"],
  [80, "locations/trimbakeshwar", "trimbakeshwar-ac-room-booking-guide", "trimbakeshwar ac room booking"],
  [81, "locations/trimbakeshwar", "trimbakeshwar-family-room-booking-with-kids", "trimbakeshwar family room booking with kids"],
  [82, "locations/trimbakeshwar", "trimbakeshwar-accessible-room-booking", "trimbakeshwar accessible room booking"],
  [83, "locations/trimbakeshwar", "trimbakeshwar-darshan-queue-timing-and-stay-plan", "trimbakeshwar darshan queue and stay timing"],
  [84, "locations/trimbakeshwar", "trimbakeshwar-one-night-stay-before-pooja", "trimbakeshwar one night stay before pooja"],
  [85, "locations/trimbakeshwar", "trimbakeshwar-mumbai-devotees-weekend-stay-plan", "trimbakeshwar mumbai weekend stay plan"],
  [86, "locations/trimbakeshwar", "trimbakeshwar-pune-devotees-travel-and-stay-plan", "trimbakeshwar pune devotees travel and stay"],
  [87, "locations/trimbakeshwar", "trimbakeshwar-diwali-and-winter-stay-guide", "trimbakeshwar diwali winter stay booking"],
  [88, "locations/trimbakeshwar", "trimbakeshwar-bhakta-niwas-devotee-experience-tips", "trimbakeshwar bhakta niwas devotee tips"],
  [89, "spiritual", "gajanan-maharaj-jayanti-celebration-guide", "gajanan maharaj jayanti celebration"],
  [90, "spiritual", "gajanan-maharaj-miracles-stories", "gajanan maharaj miracles stories"],
  [91, "spiritual", "gajanan-maharaj-bhajans-collection", "gajanan maharaj bhajans"],
  [92, "spiritual", "gajanan-maharaj-chaturmas-guide", "gajanan maharaj chaturmas"],
  [93, "spiritual", "gajanan-maharaj-punyatithi-guide", "gajanan maharaj punyatithi"],
  [94, "spiritual", "shegaon-aarti-timings-daily-schedule", "shegaon aarti timings"],
  [95, "spiritual", "gajanan-maharaj-doha-chaupai-meaning", "gajanan maharaj doha chaupai"],
  [96, "spiritual", "gajanan-maharaj-life-lessons-guide", "gajanan maharaj life lessons"],
  [97, "spiritual", "gajanan-maharaj-and-dattatreya-tradition", "gajanan maharaj dattatreya tradition"],
  [98, "spiritual", "gajanan-maharaj-bhakti-vidarbha-legacy", "gajanan maharaj vidarbha bhakti legacy"],
  [99, "spiritual", "reading-gajanan-vijay-for-beginners", "reading gajanan vijay for beginners"],
  [100, "spiritual", "gajanan-maharaj-seva-opportunities-guide", "gajanan maharaj seva opportunities"],
];

const BUCKETS = {
  "locations/shegaon": {
    category: "locations",
    image: "/images/shegaon-temple.svg",
    locationIds: ["shegaon-bhakt-niwas"],
    tags: ["shegaon", "accommodation", "sansthan-seo", "pilgrimage-guide"],
  },
  "locations/pandharpur": {
    category: "locations",
    image: "/images/pandharpur.svg",
    locationIds: ["pandharpur-math"],
    tags: ["pandharpur", "accommodation", "sansthan-seo", "pilgrimage-guide"],
  },
  "locations/omkareshwar": {
    category: "locations",
    image: "/images/omkareshwar.svg",
    locationIds: ["omkareshwar"],
    tags: ["omkareshwar", "accommodation", "sansthan-seo", "pilgrimage-guide"],
  },
  "locations/trimbakeshwar": {
    category: "locations",
    image: "/images/trimbakeshwar.svg",
    locationIds: ["trimbakeshwar"],
    tags: ["trimbakeshwar", "accommodation", "sansthan-seo", "pilgrimage-guide"],
  },
  guides: {
    category: "guides",
    image: "/images/shegaon-temple.svg",
    locationIds: ["shegaon-bhakt-niwas", "omkareshwar", "pandharpur-math", "trimbakeshwar"],
    tags: ["guides", "booking", "sansthan-seo", "travel-planning"],
  },
  spiritual: {
    category: "spiritual",
    image: "/images/shegaon-temple.svg",
    locationIds: ["shegaon-bhakt-niwas"],
    tags: ["gajanan-maharaj", "spirituality", "sansthan-seo", "devotion"],
  },
};

const LOCATION_ID_OVERRIDES = {
  37: ["shegaon-visawa", "shegaon-bhakt-niwas"],
};

const BATCHES = [
  { id: 1, ns: [29, 38], label: "shegaon" },
  { id: 2, ns: [39, 48], label: "shegaon + pandharpur" },
  { id: 3, ns: [49, 58], label: "pandharpur" },
  { id: 4, ns: [59, 68], label: "pandharpur + omkareshwar" },
  { id: 5, ns: [69, 78], label: "omkareshwar + trimbakeshwar" },
  { id: 6, ns: [79, 88], label: "trimbakeshwar" },
  { id: 7, ns: [89, 98], label: "spiritual" },
  { id: 8, ns: [99, 8], label: "spiritual + guides" },
  { id: 9, ns: [9, 18], label: "guides" },
  { id: 10, ns: [19, 28], label: "guides" },
];

function batchForN(n) {
  for (const batch of BATCHES) {
    const [start, end] = batch.ns;
    if (start <= end ? n >= start && n <= end : n >= start || n <= end) {
      return batch.id;
    }
  }
  throw new Error(`No batch mapped for n=${n}`);
}

function isoDateForN(n) {
  const base = Date.UTC(2026, 4, 28); // 2026-05-28
  return new Date(base + (n - 1) * 86400000).toISOString().slice(0, 10);
}

function buildRecords() {
  return TOPICS.map(([n, dir, slug, primaryKeyword]) => {
    const bucket = BUCKETS[dir];
    return {
      n,
      batch: batchForN(n),
      dir,
      slug,
      path: `${dir}/${slug}.md`,
      date: isoDateForN(n),
      category: bucket.category,
      image: bucket.image,
      locationIds: LOCATION_ID_OVERRIDES[n] || bucket.locationIds,
      tags: bucket.tags,
      primaryKeyword,
    };
  });
}

function getMarkdownFiles(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) files.push(...getMarkdownFiles(fullPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) files.push(fullPath);
  }
  return files;
}

function cmdInit() {
  const records = buildRecords();
  fs.mkdirSync(OPS_DIR, { recursive: true });
  fs.writeFileSync(METADATA_PATH, JSON.stringify(records, null, 2) + "\n");
  console.info("gold-batch-init", { count: records.length, path: METADATA_PATH });
}

function cmdCheck() {
  const records = buildRecords();
  const failures = [];

  // Within-batch uniqueness
  const slugSeen = new Map();
  const keywordSeen = new Map();
  for (const record of records) {
    if (slugSeen.has(record.slug)) {
      failures.push(`slug collision within batch: ${record.slug} (n=${slugSeen.get(record.slug)} and n=${record.n})`);
    } else {
      slugSeen.set(record.slug, record.n);
    }
    const normalizedKeyword = record.primaryKeyword.toLowerCase().trim();
    if (keywordSeen.has(normalizedKeyword)) {
      failures.push(`primary keyword collision within batch: "${normalizedKeyword}" (n=${keywordSeen.get(normalizedKeyword)} and n=${record.n})`);
    } else {
      keywordSeen.set(normalizedKeyword, record.n);
    }
  }

  // Against existing posts — files at planned paths are skipped only when they
  // are our own previously-written posts (slug matches the planned slug).
  const plannedSlugByPath = new Map(records.map((record) => [record.path, record.slug]));
  for (const filePath of getMarkdownFiles(BLOG_ROOT)) {
    const relativePath = path.relative(BLOG_ROOT, filePath).replace(/\\/g, "/");
    const parsed = matter(fs.readFileSync(filePath, "utf8"));
    const fileSlug = typeof parsed.data.slug === "string" ? parsed.data.slug.trim() : path.basename(relativePath, ".md");

    if (plannedSlugByPath.has(relativePath)) {
      if (fileSlug === plannedSlugByPath.get(relativePath)) {
        continue; // our own post from a previous run — skip self-comparison
      }
      failures.push(`planned path occupied by existing post: ${relativePath} (slug "${fileSlug}")`);
    }

    if (slugSeen.has(fileSlug)) {
      failures.push(`slug collision with existing post: ${fileSlug} (${relativePath})`);
    }
    const primaryKeyword = Array.isArray(parsed.data.keywords) ? String(parsed.data.keywords[0] || "").toLowerCase().trim() : "";
    if (primaryKeyword && keywordSeen.has(primaryKeyword)) {
      failures.push(`primary keyword collision with existing post: "${primaryKeyword}" (n=${keywordSeen.get(primaryKeyword)} vs ${relativePath})`);
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) console.error("gold-batch-check-failure", { reason: failure });
    process.exit(1);
  }
  console.info("gold-batch-check-summary", { status: "passed", topics: records.length });
}

function cmdStatus() {
  const records = buildRecords();
  const byBatch = new Map();
  for (const record of records) {
    if (!byBatch.has(record.batch)) byBatch.set(record.batch, { total: 0, written: 0, missing: [] });
    const bucket = byBatch.get(record.batch);
    bucket.total += 1;
    if (fs.existsSync(path.join(BLOG_ROOT, record.path))) bucket.written += 1;
    else bucket.missing.push(record.n);
  }
  for (const batchId of [...byBatch.keys()].sort((a, b) => a - b)) {
    const bucket = byBatch.get(batchId);
    console.info("gold-batch-status", {
      batch: batchId,
      written: bucket.written,
      total: bucket.total,
      missingN: bucket.missing,
    });
  }
}

const command = process.argv[2];
if (command === "init") cmdInit();
else if (command === "check") cmdCheck();
else if (command === "status") cmdStatus();
else {
  console.error("usage: node scripts/gold-standard-batch-tooling.mjs <init|check|status>");
  process.exit(1);
}
