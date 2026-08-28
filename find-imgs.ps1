$ErrorActionPreference = 'SilentlyContinue'
$out = "C:\Users\Raneem\Desktop\fit88.de\img-paths.txt"
"=== Desktop recursive (png/jpg large) ===" | Set-Content $out -Encoding UTF8
Get-ChildItem "C:\Users\Raneem\Desktop" -Recurse -File -Include *.png,*.jpg,*.jpeg,*.webp |
  Where-Object { $_.Length -gt 100KB } |
  ForEach-Object { $_.FullName } | Add-Content $out -Encoding UTF8
"=== Temp recent ===" | Add-Content $out -Encoding UTF8
$cut = (Get-Date).AddHours(-6)
Get-ChildItem "C:\Users\Raneem\AppData\Local\Temp" -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -match "\.(png|jpg|jpeg)$" -and $_.LastWriteTime -gt $cut } |
  Select-Object -First 20 | ForEach-Object { $_.FullName } | Add-Content $out -Encoding UTF8