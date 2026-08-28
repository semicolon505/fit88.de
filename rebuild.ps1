$ErrorActionPreference = 'Continue'
$log = "C:\Users\Raneem\Desktop\fit88.de\rebuild-out.txt"
"=== CLEAN OLD SVGS ===" | Set-Content $log -Encoding UTF8
$img = "C:\Users\Raneem\Desktop\fit88.de\client\src\img"
Remove-Item "$img\logo.svg" -Force -ErrorAction SilentlyContinue
Remove-Item "$img\hero-nutritionist.svg" -Force -ErrorAction SilentlyContinue
Get-ChildItem $img | ForEach-Object { $_.Name } | Add-Content $log -Encoding UTF8

"=== PACK ===" | Add-Content $log -Encoding UTF8
& powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Raneem\Desktop\fit88.de\pack.ps1" 2>&1 | Add-Content $log -Encoding UTF8

"=== ZIP CONTENT CHECK ===" | Add-Content $log -Encoding UTF8
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("C:\Users\Raneem\Desktop\fit88-de-site-fixed.zip")
("ZIP_ENTRIES=" + $zip.Entries.Count) | Add-Content $log -Encoding UTF8
($zip.Entries | Where-Object { $_.FullName -match '\.(png|svg)$' } | ForEach-Object { $_.FullName }) | Add-Content $log -Encoding UTF8
$zip.Dispose()
"DONE" | Add-Content $log -Encoding UTF8