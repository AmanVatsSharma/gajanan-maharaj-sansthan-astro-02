import fs from "node:fs";
import path from "node:path";

const results = [];
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const fp = path.join(d, f);
    const s = fs.statSync(fp);
    if (s.isDirectory()) walk(fp);
    else if (f.endsWith(".md")) {
      const text = fs.readFileSync(fp, "utf-8");
      const words = (text.match(/\b\w+\b/g) || []).length;
      const rel = path.relative("content/blog", fp).replace(/\\/g, "/");
      results.push({ file: rel, words });
    }
  }
}
walk("content/blog");
results.sort((a, b) => a.words - b.words);
const over1500 = results.filter((r) => r.words >= 1500);
const under1500 = results.filter((r) => r.words < 1500);
console.log("Total:", results.length, "| Over 1500:", over1500.length, "| Under 1500:", under1500.length);

// Group under-1500 by top-level directory
const byTopDir = {};
for (const r of under1500) {
  const parts = r.file.split("/");
  const top = parts[0] || "root";
  if (!byTopDir[top]) byTopDir[top] = [];
  byTopDir[top].push(r);
}
console.log("\nThin posts by top-level directory:");
for (const [dir, files] of Object.entries(byTopDir).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${dir}: ${files.length}`);
}

// Word count buckets
const bucket1 = under1500.filter((r) => r.words < 500);
const bucket2 = under1500.filter((r) => r.words >= 500 && r.words < 1000);
const bucket3 = under1500.filter((r) => r.words >= 1000 && r.words < 1500);
console.log("\nWord count buckets:");
console.log("  < 500:", bucket1.length);
console.log("  500-999:", bucket2.length);
console.log("  1000-1499:", bucket3.length);

// Show 30 thinnest
console.log("\n=== 30 THINNEST POSTS ===");
for (const r of results.slice(0, 30)) {
  console.log(`${r.words.toString().padStart(5)} | ${r.file}`);
}

// Check target files from the plan
console.log("\n=== PLAN TARGET VERIFICATION ===");
const planPartA = [
  "guides/gajanan-vijay-granth-parayan-complete-guide.md",
  "spiritual/gajanan-maharaj-biography-life-story-shegaon.md",
  "spiritual/gajanan-maharaj-aarti-mantra-lyrics-meaning.md",
  "guides/trimbakeshwar-narayan-nagbali-kaal-sarp-dosh-pooja-guide.md",
  "guides/shegaon-samadhi-mandir-history-architecture.md",
  "guides/bhakt-niwas-room-tariff-room-types-2026.md",
  "guides/how-to-reach-shegaon-train-bus-from-every-city.md",
  "guides/shegaon-annadan-mahaprasad-free-food-guide.md",
  "events/rishi-panchami-shegaon-samadhi-utsav-guide.md",
  "guides/omkareshwar-mamleshwar-jyotirlinga-darshan-guide.md",
];

const allFiles = new Set(results.map((r) => r.file));
for (const p of planPartA) {
  console.log(p, "-> EXISTS:", allFiles.has(p));
}
