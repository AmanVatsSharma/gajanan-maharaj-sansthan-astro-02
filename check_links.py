import re, os, sys

targets = [
    'guides/shegaon-darshan-timing-guide.md',
    'guides/shegaon-bhakta-niwas-accommodation-guide.md',
    'guides/shegaon-bhakta-niwas-booking-process.md',
    'guides/shegaon-anand-sagar-visit-guide.md',
    'guides/shegaon-travel-guide.md',
    'guides/omkareshwar-darshan-timing-guide.md',
    'guides/omkareshwar-bhakta-niwas-accommodation-guide.md',
    'guides/omkareshwar-first-time-visitor-guide.md',
    'guides/trimbakeshwar-darshan-timing-guide.md',
    'guides/trimbakeshwar-bhakta-niwas-accommodation-guide.md',
    'guides/trimbakeshwar-mahashivratri-booking-guide.md',
    'guides/pandharpur-darshan-timing-guide.md',
    'guides/pandharpur-bhakta-niwas-accommodation-guide.md',
    'guides/pandharpur-first-time-visitor-guide.md',
    'guides/all-12-jyotirlinga-planning.md',
    'guides/how-to-reach-shegaon-train-bus-from-every-city.md',
    'guides/bhakt-niwas-room-tariff-room-types-2026.md',
    'guides/shegaon-samadhi-mandir-history-architecture.md',
    'spiritual/gajanan-vijay-granth-reading-guide.md',
    'spiritual/gajanan-maharaj-biography-life-story-shegaon.md',
    'spiritual/gajanan-maharaj-aarti-mantra-lyrics-meaning.md',
    'guides/trimbakeshwar-narayan-nagbali-kaal-sarp-dosh-pooja-guide.md',
    'guides/shegaon-annadan-mahaprasad-free-food-guide.md',
    'events/rishi-panchami-shegaon-samadhi-utsav-guide.md',
    'guides/omkareshwar-mamleshwar-jyotirlinga-darshan-guide.md',
]

for rel in targets:
    path = f'content/blog/{rel}'
    if not os.path.exists(path):
        print(f'MISSING: {rel}')
        continue
    with open(path) as f:
        text = f.read()
    # Extract frontmatter
    fm_end = text.index('---', 3) if '---' in text[3:] else len(text)
    body = text[fm_end:]
    links = re.findall(r'\[[^\]]+\]\((/[^)]+)\)', body)
    loc_links = [l for l in links if l.startswith('/locations/')]
    book_links = [l for l in links if l.startswith('/booking') or l.startswith('/contact')]
    blog_links = [l for l in links if l.startswith('/blog/')]
    wc = len(re.findall(r'\b\w+\b', body))
    
    issues = []
    if not loc_links:
        issues.append('NO /locations/ LINK')
    if not book_links:
        issues.append('NO /booking or /contact LINK')
    if len(links) < 3:
        issues.append(f'Only {len(links)} internal links')
    if wc < 1500:
        issues.append(f'{wc} words')
    
    if issues:
        print(f'{rel}: {", ".join(issues)}')
    else:
        print(f'{rel}: OK ({wc} words)')
