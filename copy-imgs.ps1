$ErrorActionPreference = 'Stop'
$src = "C:\Users\Raneem\Desktop\fit88\assets"
$dst = "C:\Users\Raneem\Desktop\fit88.de\client\src\img"
Copy-Item "$src\hero-doctor-lineart.png" "$dst\hero-lineart.png" -Force
Copy-Item "$src\logo-transparent.png"   "$dst\logo.png" -Force
Get-ChildItem $dst | Select-Object Name, Length | Format-Table -AutoSize
"COPIED_OK"