$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$log = New-Object System.Collections.Generic.List[string]
$cut = (Get-Date).AddHours(-3)

# 1) project folder images (non-svg)
Get-ChildItem $root -Recurse -File -Include *.png,*.jpg,*.jpeg,*.webp -ErrorAction SilentlyContinue | ForEach-Object {
  $log.Add("PROJECT: " + $_.FullName.Replace($root,"") + "  " + [math]::Round($_.Length/1KB,1) + "KB  " + $_.LastWriteTime.ToString("HH:mm"))
}
# 2) Desktop recent images (skip known personal file)
Get-ChildItem "C:\Users\Raneem\Desktop" -File -Include *.png,*.jpg,*.jpeg,*.webp -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Name -notmatch "RANEM" } | ForEach-Object {
  $log.Add("DESKTOP: " + $_.Name + "  " + [math]::Round($_.Length/1KB,1) + "KB  " + $_.LastWriteTime.ToString("MM-dd HH:mm"))
}
# 3) Downloads recent
Get-ChildItem "C:\Users\Raneem\Downloads" -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -match "\.(png|jpg|jpeg|webp)$" -and $_.LastWriteTime -gt $cut } | ForEach-Object {
  $log.Add("DOWNLOADS: " + $_.Name + "  " + [math]::Round($_.Length/1KB,1) + "KB  " + $_.LastWriteTime.ToString("MM-dd HH:mm"))
}
# 4) Cline temp images (pasted attachments often land here)
Get-ChildItem "C:\Users\Raneem\AppData\Local\Temp" -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -match "\.(png|jpg|jpeg)$" -and $_.LastWriteTime -gt $cut -and $_.Length -gt 50KB } | Select-Object -First 15 | ForEach-Object {
  $log.Add("TEMP: " + $_.FullName + "  " + [math]::Round($_.Length/1KB,1) + "KB  " + $_.LastWriteTime.ToString("HH:mm"))
}
# 5) Pictures folder recent
Get-ChildItem "C:\Users\Raneem\Pictures" -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -match "\.(png|jpg|jpeg|webp)$" -and $_.LastWriteTime -gt $cut } | ForEach-Object {
  $log.Add("PICTURES: " + $_.FullName + "  " + [math]::Round($_.Length/1KB,1) + "KB  " + $_.LastWriteTime.ToString("MM-dd HH:mm"))
}
if ($log.Count -eq 0) { $log.Add("NO_IMAGE_FILES_FOUND_ANYWHERE") }
[System.IO.File]::WriteAllLines((Join-Path $root "img-hunt.txt"), $log, [System.Text.Encoding]::UTF8)
