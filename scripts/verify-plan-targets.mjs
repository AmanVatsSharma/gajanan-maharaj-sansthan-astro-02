import fs from "node:fs";
import path from "node:path";

const partB = [
  "locations/shegaon/shegaon-darshan-timing-guide.md",
  "locations/shegaon/shegaon-bhakta-niwas-accommodation-guide.md",
  "locations/shegaon/shegaon-bhakta-niwas-booking-process.md",
  "locations/shegaon/shegaon-anand-sagar-visit-guide.md",
  "locations/shegaon/shegaon-travel-guide.md",
  "locations/omkareshwar/omkareshwar-darshan-timing-guide.md",
  "locations/omkareshwar/omkareshwar-bhakta-niwas-accommodation-guide.md",
  "locations/omkareshwar/omkareshwar-first-time-visitor-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-darshan-timing-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-bhakta-niwas-accommodation-guide.md",
  "locations/trimbakeshwar/trimbakeshwar-mahashivratri-booking-guide.md",
  "locations/pandharpur/pandharpur-darshan-timing-guide.md",
  "locations/pandharpur/pandharpur-bhakta-niwas-accommodation-guide.md",
  "locations/pandharpur/pandharpur-first-time-visitor-guide.md",
  "guides/all-12-jyotirlinga-planning.md",
];

console.log("=== Part B: File Existence Check ===");
for (const f of partB) {
  const fp = path.join("content/blog", f);
  const exists = fs.existsSync(fp);
  let wc = 0;
  if (exists) {
    const text = fs.readFileSync(fp, "utf-8");
    wc = (text.match(/\b\w+\b/g) || []).length;
  }
  console.log(exists ? "EXISTS" : "MISSING", String(wc).padStart(5), "words |", f);
}

console.log("\n=== MANUAL_SEED_POST_PATHS ===");
const configPath = "scripts/seo-cluster-config.mjs";
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, "utf-8");
  const match = config.match(/MANUAL_SEED_POST_PATHS[\s\S]*?\]/);
  if (match) console.log(match[0].slice(0, 600));
  else console.log("MANUAL_SEED_POST_PATHS not found");
}

console.log("\n=== Manifest check ===");
const manifestPath = "content/blog/_ops/generated-seo-cluster-manifest.json";
console.log(fs.existsSync(manifestPath) ? "EXISTS" : "MISSING", manifestPath);

console.log("\n=== Gold standard reference ===");
const refPath = "content/blog/locations/shegaon/shegaon-accommodation-guide.md";
if (fs.existsSync(refPath)) {
  const text = fs.readFileSync(refPath, "utf-8");
  const wc = (text.match(/\b\w+\b/g) || []).length;
  console.log("EXISTS", wc, "words");
} else {
  console.log("MISSING - searching for accommodation guides...");
  const matches: { file: string; words: number }[] = [];
  function findAccom(d: string) {
    for (const f of fs.readdirSync(d)) {
      const fp = path.join(d, f);
      const s = fs.statSync(fp);
      if (s.isDirectory()) { findAccom(fp); continue; }
      if (f.includes("accommodation") && f.endsWith(".md")) {
        const t = fs.readFileSync(fp, "utf-8");
        const wc = (t.match(/\b\w+\b/g) || []).length;
        const rel = path.relative("content/blog", fp);
        matches.push({ file: rel, words: wc });
      }
    }
  }
  findAccom("content/blog");
  matches.sort((a, b) => b.words - a.words);
  for (const m of matches.slice(0, 5)) console.log(m.words, m.file);
}
