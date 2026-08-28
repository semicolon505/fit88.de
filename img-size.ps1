Add-Type -AssemblyName System.Drawing
$files = @("C:\Users\Raneem\Desktop\fit88.de\client\src\img\logo.png",
           "C:\Users\Raneem\Desktop\fit88.de\client\src\img\hero-lineart.png")
foreach ($f in $files) {
  $img = [System.Drawing.Image]::FromFile($f)
  "${f}: $($img.Width) x $($img.Height)"
  $img.Dispose()
}