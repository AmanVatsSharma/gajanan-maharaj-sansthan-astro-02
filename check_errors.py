import sys, re
text = sys.stdin.read()
blocks = text.split('blog-validation-error')
targets = [
    'shegaon-darshan-timing-guide.md','shegaon-bhakta-niwas-accommodation-guide.md',
    'shegaon-bhakta-niwas-booking-process.md','shegaon-anand-sagar-visit-guide.md',
    'shegaon-travel-guide.md','omkareshwar-darshan-timing-guide.md',
    'omkareshwar-bhakta-niwas-accommodation-guide.md','omkareshwar-first-time-visitor-guide.md',
    'trimbakeshwar-darshan-timing-guide.md','trimbakeshwar-bhakta-niwas-accommodation-guide.md',
    'trimbakeshwar-mahashivratri-booking-guide.md','pandharpur-darshan-timing-guide.md',
    'pandharpur-bhakta-niwas-accommodation-guide.md','pandharpur-first-time-visitor-guide.md',
    'all-12-jyotirlinga-planning.md','how-to-reach-shegaon-train-bus-from-every-city.md',
    'bhakt-niwas-room-tariff-room-types-2026.md','shegaon-samadhi-mandir-history-architecture.md',
    'gajanan-vijay-granth-reading-guide.md','gajanan-maharaj-biography-life-story-shegaon.md',
    'gajanan-maharaj-aarti-mantra-lyrics-meaning.md',
    'trimbakeshwar-narayan-nagbali-kaal-sarp-dosh-pooja-guide.md',
    'shegaon-annadan-mahaprasad-free-food-guide.md',
    'rishi-panchami-shegaon-samadhi-utsav-guide.md',
    'omkareshwar-mamleshwar-jyotirlinga-darshan-guide.md',
]
noise = {'blog-validation-error', 'timestamp', 'slug', 'file', 'errors', 'warnings', 'message'}
for block in blocks[1:]:
    m = re.search(r"file: '([^']+)'", block)
    if m:
        f = m.group(1)
        if any(t in f for t in targets):
            raw = re.findall(r"'([^']+)'", block)
            clean = [e for e in raw if not any(e.startswith(n) for n in noise)]
            clean = [e for e in clean if 'content' not in e and 'blog' not in e and len(e) < 120]
            if clean:
                print(f'{f}: {clean}')
            else:
                print(f'{f}: CLEAN')
