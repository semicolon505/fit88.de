$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\Raneem\Desktop\fit88.de\client"
Get-ChildItem $dir -Filter *.html | ForEach-Object {
  $p = $_.FullName
  $c = [System.IO.File]::ReadAllText($p)
  $before = $c
  # favicon first (keeps type attribute correct)
  $c = $c.Replace('href="src/img/logo.svg" type="image/svg+xml"', 'href="src/img/logo.png" type="image/png"')
  # header + footer + approach-logo imgs
  $c = $c.Replace('src/img/logo.svg', 'src/img/logo.png')
  # hero art
  $c = $c.Replace('src/img/hero-nutritionist.svg', 'src/img/hero-lineart.png')
  if ($c -ne $before) {
    [System.IO.File]::WriteAllText($p, $c, $utf8)
    "$($_.Name): UPDATED"
  } else {
    "$($_.Name): no change"
  }
}
# sanity: ensure zero remaining old refs across all html
"--- remaining old refs ---"
$still = Get-ChildItem $dir -Filter *.html | Where-Object { (Get-Content $_.FullName -Raw) -match 'logo\.svg|hero-nutritionist' }
if ($still) { $still.FullName } else { "NONE_REMAIN" }