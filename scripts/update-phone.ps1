# Bulk-replace legacy phone numbers with the canonical site-wide number.
# The canonical number lives in src/data/contact.ts (CONTACT_DETAILS.booking.mobile).
# This script normalises every known legacy variant back to that canonical value.
#
# Legacy numbers replaced:
#   +91 96612 63850  -> +91 89698 71378   (canonical spaced form)
#   +91 75210 63034  -> +91 89698 71378
#   +91 80531 90691  -> +91 89698 71378   (stale number left by an earlier buggy run)
#   +919661263850 / +917521063034 / +918053190691  -> +918969871378   (plain forms)
#
# Scans all .astro/.ts/.tsx/.json/.md/.mjs/.js/.xml/.txt files under src/ and public/.
# Skips: node_modules, .git, dist, .vercel, .playwright-mcp, content/blog.
# Prints per-file change counts and a final totals line. Idempotent (a second run
# reports 0 replacements because the canonical form is not in the old-list).

$ErrorActionPreference = 'Stop'

$root = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')

# Canonical target — both forms MUST refer to the same number.
$newSpaced = '+91 89698 71378'
$newPlain  = '+918969871378'

# Legacy spaced forms to replace.
$oldSpaced1 = '+91 96612 63850'
$oldSpaced2 = '+91 75210 63034'
$oldSpaced3 = '+91 80531 90691'

# Legacy no-space / machine-readable variants to replace.
$oldPlain1 = '+919661263850'
$oldPlain2 = '+917521063034'
$oldPlain3 = '+918053190691'

$excludeDirs = @('node_modules', '.git', 'dist', '.vercel', '.playwright-mcp', 'content\blog')
$includeExt  = @('.astro', '.ts', '.tsx', '.json', '.md', '.mjs', '.js', '.xml', '.txt')

$totalFiles = 0
$totalRepl  = 0

Get-ChildItem -Path $root -Recurse -File |
  Where-Object {
    $skip = $false
    foreach ($d in $excludeDirs) {
      if ($_.FullName -like "*\$d\*") { $skip = $true; break }
    }
    -not $skip -and $includeExt -contains $_.Extension.ToLower()
  } |
  ForEach-Object {
    $path   = $_.FullName
    $text   = [System.IO.File]::ReadAllText($path)
    $count  = 0

    $c1 = ([regex]::Matches($text, [regex]::Escape($oldSpaced1))).Count
    $c2 = ([regex]::Matches($text, [regex]::Escape($oldSpaced2))).Count
    $c3 = ([regex]::Matches($text, [regex]::Escape($oldSpaced3))).Count
    $c4 = ([regex]::Matches($text, [regex]::Escape($oldPlain1))).Count
    $c5 = ([regex]::Matches($text, [regex]::Escape($oldPlain2))).Count
    $c6 = ([regex]::Matches($text, [regex]::Escape($oldPlain3))).Count
    $count = $c1 + $c2 + $c3 + $c4 + $c5 + $c6

    if ($count -gt 0) {
      $text = $text.Replace($oldSpaced1, $newSpaced).Replace($oldSpaced2, $newSpaced).Replace($oldSpaced3, $newSpaced).Replace($oldPlain1, $newPlain).Replace($oldPlain2, $newPlain).Replace($oldPlain3, $newPlain)
      [System.IO.File]::WriteAllText($path, $text)
      $rel = $path.Substring($root.Path.Length + 1)
      Write-Host ("{0,4} replacements  {1}" -f $count, $rel)
      $script:totalFiles++
      $script:totalRepl += $count
    }
  }

Write-Host ""
Write-Host ("TOTAL: {0} files, {1} replacements" -f $totalFiles, $totalRepl)
