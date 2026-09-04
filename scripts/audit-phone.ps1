# Audit: list every distinct phone-number-like token currently in src/ + public/.
$ErrorActionPreference = 'Stop'
$root = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')
$exclude = '\\(node_modules|\.git|dist|\.vercel|\.playwright-mcp|content\\blog|\.remember)\\'
$includeExt = @('.astro', '.ts', '.tsx', '.json', '.xml', '.txt', '.md', '.mjs', '.js')

$tokens = @('+917033516657','+917970580390','+918053190691','+919599417591','8796359334','7521063034','9599417591','+917265255000','+91 70335 16657','+91 84342 89721','+91 80531 90691','+91 89698 71378','+91 72652 55000')

foreach ($tok in $tokens) {
  Write-Host ""
  Write-Host ("=== '{0}' ===" -f $tok)
  $found = $false
  Get-ChildItem -Path $root -Recurse -File |
    Where-Object {
      ($_.FullName -notmatch $exclude) -and
      ($includeExt -contains $_.Extension.ToLower())
    } |
    ForEach-Object {
      $t = [System.IO.File]::ReadAllText($_.FullName)
      if ($t -like "*$tok*") {
        $rel = $_.FullName.Substring($root.Path.Length + 1)
        $c = ([regex]::Matches($t, [regex]::Escape($tok))).Count
        Write-Host ("  {0,3}  {1}" -f $c, $rel)
        $found = $true
      }
    }
  if (-not $found) { Write-Host "  (none)" }
}
