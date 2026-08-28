$ErrorActionPreference = 'Stop'
$img = "C:\Users\Raneem\Desktop\fit88.de\client\src\img"
# remove now-unused generated SVGs replaced by real brand assets
Remove-Item "$img\logo.svg" -Force -ErrorAction SilentlyContinue
Remove-Item "$img\hero-nutritionist.svg" -Force -ErrorAction SilentlyContinue
Get-ChildItem $img | Select-Object Name, Length | Format-Table -AutoSize
"CLEAN_OK"