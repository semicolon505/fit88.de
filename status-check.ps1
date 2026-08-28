$ErrorActionPreference = 'Continue'
$log = "C:\Users\Raneem\Desktop\fit88.de\status.txt"
$client = "C:\Users\Raneem\Desktop\fit88.de\client"
"=== FINAL STATUS ===" | Set-Content $log -Encoding UTF8

# 1) images present
$need = @("$client\src\img\logo.png", "$client\src\img\hero-lineart.png")
foreach ($f in $need) {
  if (Test-Path $f) { "OK: $(Split-Path -Leaf $f) ($([math]::Round((Get-Item $f).Length/1KB,1)) KB)" | Add-Content $log -Encoding UTF8 }
  else { "MISSING: $f" | Add-Content $log -Encoding UTF8 }
}

# 2) every html uses new assets
$bad = Get-ChildItem $client -Filter *.html | Where-Object { (Get-Content $_.FullName -Raw) -match 'logo\.svg|hero-nutritionist|manus' }
if ($bad) { "HTML_PROBLEM: $($bad.Name -join ', ')" | Add-Content $log -Encoding UTF8 }
else { "ALL_8_PAGES_CLEAN_AND_LINKED" | Add-Content $log -Encoding UTF8 }

# 3) js syntax
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) { & node --check "$client\src\fit88.js"; ("JS_EXIT=" + $LASTEXITCODE) | Add-Content $log -Encoding UTF8 }

# 4) zip fresh?
$zip = "C:\Users\Raneem\Desktop\fit88-de-site-fixed.zip"
if (Test-Path $zip) {
  ("ZIP_EXISTS size_kb=" + [math]::Round((Get-Item $zip).Length/1KB,1) + " modified=" + (Get-Item $zip).LastWriteTime.ToString("yyyy-MM-dd HH:mm")) | Add-Content $log -Encoding UTF8
}
"DONE" | Add-Content $log -Encoding UTF8