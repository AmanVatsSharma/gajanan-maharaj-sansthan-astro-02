# Bulk-replace two legacy phone numbers with the new site-wide number.
#   +91 96612 63850  -> +91 80531 90691
#   +91 75210 63034  -> +91 80531 90691
# Scans all .astro/.ts/.tsx/.json/.md/.mjs files under src/ and public/.
# Skips: node_modules, .git, dist, .vercel, .playwright-mcp, content/blog
# Prints per-file change counts and a final totals line. Idempotent.

$ErrorActionPreference = 'Stop'

$root = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')

$oldSpaced1 = '+91 96612 63850'
$oldSpaced2 = '+91 75210 63034'
$newSpaced  = '+91 80531 90691'

# Also catch any no-space / machine-readable variants (e.g. in data files).
$oldPlain1  = '+919661263850'
$oldPlain2  = '+917521063034'
$newPlain   = '+918053190691'

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
    $orig   = $text
    $count  = 0

    $c1 = ([regex]::Matches($text, [regex]::Escape($oldSpaced1))).Count
    $c2 = ([regex]::Matches($text, [regex]::Escape($oldSpaced2))).Count
    $c3 = ([regex]::Matches($text, [regex]::Escape($oldPlain1))).Count
    $c4 = ([regex]::Matches($text, [regex]::Escape($oldPlain2))).Count
    $count = $c1 + $c2 + $c3 + $c4

    if ($count -gt 0) {
      $text = $text.Replace($oldSpaced1, $newSpaced).Replace($oldSpaced2, $newSpaced).Replace($oldPlain1, $newPlain).Replace($oldPlain2, $newPlain)
      [System.IO.File]::WriteAllText($path, $text)
      $rel = $path.Substring($root.Path.Length + 1)
      Write-Host ("{0,4} replacements  {1}" -f $count, $rel)
      $script:totalFiles++
      $script:totalRepl += $count
    }
  }

Write-Host ""
Write-Host ("TOTAL: {0} files, {1} replacements" -f $totalFiles, $totalRepl)
