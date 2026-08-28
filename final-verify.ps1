$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$log = "C:\Users\Raneem\Desktop\fit88.de\final-verify.txt"
$zip = [System.IO.Compression.ZipFile]::OpenRead("C:\Users\Raneem\Desktop\fit88-de-site-fixed.zip")
"=== VERIFY INSIDE ZIP ===" | Set-Content $log -Encoding UTF8
$newRefs = 0; $oldRefs = 0; $manus = 0
foreach ($e in $zip.Entries) {
  if ($e.FullName -notmatch '\.(html|css|js|txt|svg)$') { continue }
  $r = New-Object System.IO.StreamReader($e.Open())
  $c = $r.ReadToEnd(); $r.Close()
  if ($c -match 'logo\.png') { $newRefs++ }
  if ($c -match 'hero-lineart\.png') { $newRefs++ }
  if ($c -match 'logo\.svg|hero-nutritionist') { $oldRefs++; "OLD_REF_IN: $($e.FullName)" | Add-Content $log -Encoding UTF8 }
  if ($c -match '(?i)manus') { $manus++; "MANUS_IN: $($e.FullName)" | Add-Content $log -Encoding UTF8 }
}
("NEW_REFS_FOUND=" + $newRefs) | Add-Content $log -Encoding UTF8
("OLD_REFS=" + $oldRefs) | Add-Content $log -Encoding UTF8
("MANUS_HITS=" + $manus) | Add-Content $log -Encoding UTF8
# show the actual hero img + favicon lines from index.html
$idx = $zip.Entries | Where-Object { $_.FullName -eq 'index.html' }
$r = New-Object System.IO.StreamReader($idx.Open()); $html = $r.ReadToEnd(); $r.Close()
$m = [regex]::Match($html, '<link rel="icon"[^>]+>').Value
$m | Add-Content $log -Encoding UTF8
[regex]::Matches($html, '<img src="src/img/(logo|hero-lineart)\.png[^>]*>') | ForEach-Object { $_.Value } | Add-Content $log -Encoding UTF8
$zip.Dispose()
"DONE" | Add-Content $log -Encoding UTF8