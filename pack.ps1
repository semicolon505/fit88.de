$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$client = Join-Path $root "client"
$js = Join-Path $client "src\fit88.js"

Write-Output "=== 1) JS SYNTAX CHECK ==="
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
  & node --check $js
  Write-Output ("NODE_CHECK_EXIT=" + $LASTEXITCODE)
} else {
  Write-Output "NODE_NOT_FOUND_SKIPPED"
}

Write-Output "=== 2) LOCAL REFERENCE CHECK ==="
$missing = @()
Get-ChildItem $client -Filter *.html | ForEach-Object {
  $page = $_
  $html = Get-Content $page.FullName -Raw
  foreach ($m in [regex]::Matches($html, '(?:src|href)="([^"]+)"')) {
    $r = $m.Groups[1].Value
    if ($r -match '^(https?:|mailto:|tel:|#|/)') { continue }
    $target = Join-Path $page.DirectoryName ($r.Replace("/", "\"))
    if (-not (Test-Path $target)) { $missing += ("{0} -> {1}" -f $page.Name, $r) }
  }
}
if ($missing.Count -eq 0) { Write-Output "ALL_LOCAL_REFS_OK" } else { $missing }

Write-Output "=== 3) PACKAGE ZIP ==="
$stage = Join-Path $env:TEMP ("fit88-stage-" + [guid]::NewGuid().ToString("N").Substring(0, 8))
New-Item -ItemType Directory -Path $stage | Out-Null
Copy-Item (Join-Path $client "*.html") $stage
New-Item -ItemType Directory -Path (Join-Path $stage "src") | Out-Null
Copy-Item (Join-Path $client "src\fit88.css") (Join-Path $stage "src\")
Copy-Item (Join-Path $client "src\fit88.js") (Join-Path $stage "src\")
New-Item -ItemType Directory -Path (Join-Path $stage "src\img") -OutVariable null | Out-Null
Copy-Item (Join-Path $client "src\img\*") (Join-Path $stage "src\img\")
Copy-Item (Join-Path $root "pack-readme.txt") (Join-Path $stage "README.txt")
$zip = "C:\Users\Raneem\Desktop\fit88-de-site-fixed.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zip -Force
Remove-Item $stage -Recurse -Force
if (Test-Path $zip) {
  $kb = [math]::Round((Get-Item $zip).Length / 1KB, 1)
  Write-Output ("ZIP_CREATED=" + $zip + " SIZE_KB=" + $kb)
} else {
  Write-Output "ZIP_FAILED"
}

Write-Output "=== DONE ==="