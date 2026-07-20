import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = 'C:/Users/ASUS TUF A15/Desktop/DevOPS/Websites/Gajanan Maharaj Sansthan/gajanan-maharaj-sansthan-astro-02';

const filesToCheck = [
  'content/blog/guides/extended-stay-planning-for-devotees.md',
  'content/blog/guides/pandharpur-and-shegaon-family-yatra-plan.md',
  'content/blog/guides/shegaon-and-ajanta-ellora-combined-trip.md',
  'content/blog/guides/complete-transport-guide-for-devotees.md',
  'content/blog/guides/how-to-manage-luggage-during-yatra.md',
  'content/blog/guides/festival-dates-and-booking-windows.md',
  'content/blog/guides/whatsapp-booking-troubleshooting.md',
  'content/blog/guides/multi-location-pilgrimage-planning-guide.md',
  'content/blog/guides/planning-a-one-week-maharashtra-yatra.md',
  'content/blog/guides/indore-omkareshwar-shegaon-yatra.md',
  'content/blog/guides/mumbai-to-shegaon-weekend-guide.md',
];

for (const relPath of filesToCheck) {
  const fullPath = path.join(projectRoot, relPath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const parts = content.split('---');
  const body = parts[2] || '';
  const words = body.trim().split(/\s+/).length;
  const status = words <= 1800 ? (words >= 1500 ? 'OK' : 'LOW') : 'HIGH';
  console.log(`${path.basename(relPath).padEnd(55)} ${String(words).padStart(5)} words  ${status}`);
}
