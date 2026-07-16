import re

with open('scripts/expand-thin-posts.mjs', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixed = []
for line in lines:
    stripped = line.strip()
    if 'faqs.push' in stripped or 'tips.push' in stripped or stripped.startswith('return'):
        sq = stripped.count("'")
        if sq >= 3:
            first_sq = stripped.index("'")
            last_sq = stripped.rindex("'")
            if first_sq < last_sq:
                inner = stripped[first_sq+1:last_sq]
                if "'" in inner:
                    new_inner = inner.replace("'", "\\'")
                    line = stripped[:first_sq+1] + new_inner + stripped[last_sq:] + '\n'
    fixed.append(line)

with open('scripts/expand-thin-posts.mjs', 'w', encoding='utf-8') as f:
    f.writelines(fixed)
print('Fixed apostrophes')
