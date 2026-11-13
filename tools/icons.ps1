# Tạo icon app (bàn phím 3x3 trên nền xanh dương) cho PWA, và cho Android nếu đã có thư mục android/.
# Chạy: powershell -ExecutionPolicy Bypass -File tools/icons.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot
$from = [System.Drawing.ColorTranslator]::FromHtml('#3b82f6') # trùng màu nhấn trong www/css/app.css
$to = [System.Drawing.ColorTranslator]::FromHtml('#1d4ed8')

function Rounded([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = [float](2 * $r)
  $p.AddArc($x, $y, $d, $d, [float]180, [float]90)
  $p.AddArc([float]($x + $w - $d), $y, $d, $d, [float]270, [float]90)
  $p.AddArc([float]($x + $w - $d), [float]($y + $h - $d), $d, $d, [float]0, [float]90)
  $p.AddArc($x, [float]($y + $h - $d), $d, $d, [float]90, [float]90)
  $p.CloseFigure()
  return $p
}

# Vẽ ô icon (nền xanh + bàn phím) trong hình vuông ($x,$y,$size). shape: square | rounded | circle
function Draw-Tile($g, [float]$x, [float]$y, [float]$size, [double]$keys, [string]$shape) {
  $rect = New-Object System.Drawing.RectangleF $x, $y, $size, $size
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $from, $to, ([float]45)
  switch ($shape) {
    'square'  { $g.FillRectangle($bg, $rect) }
    'circle'  { $g.FillEllipse($bg, $rect) }
    'rounded' { $g.FillPath($bg, (Rounded $x $y $size $size ($size * 0.22))) }
  }
  $side = $size * $keys
  $cell = $side / 3; $gap = $cell * 0.2; $x0 = $x + ($size - $side) / 2; $y0 = $y + ($size - $side) / 2
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $amber = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#fbbf24'))
  for ($r = 0; $r -lt 3; $r++) {
    for ($c = 0; $c -lt 3; $c++) {
      $brush = if ($r -eq 1 -and $c -eq 1) { $amber } else { $white }
      $g.FillPath($brush, (Rounded ($x0 + $c * $cell + $gap / 2) ($y0 + $r * $cell + $gap / 2) ($cell - $gap) ($cell - $gap) (($cell - $gap) * 0.28)))
    }
  }
}

function New-Canvas([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)
  return @($bmp, $g)
}

function Save-Bitmap($bmp, $g, [string]$path) {
  New-Item -ItemType Directory -Force (Split-Path $path) | Out-Null
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

# Icon vuông kích thước $size
function Save-Icon([int]$size, [string]$path, [double]$keys, [string]$shape = 'square') {
  $bmp, $g = New-Canvas $size $size
  Draw-Tile $g 0 0 $size $keys $shape
  Save-Bitmap $bmp $g $path
}

# Màn hình chờ: nền trắng, icon bo góc ở giữa
function Save-Splash([int]$w, [int]$h, [string]$path) {
  $bmp, $g = New-Canvas $w $h
  $g.Clear([System.Drawing.Color]::White)
  $size = [Math]::Min($w, $h) * 0.3
  Draw-Tile $g (($w - $size) / 2) (($h - $size) / 2) $size 0.56 'rounded'
  Save-Bitmap $bmp $g $path
}

# PWA
$icons = Join-Path $root 'www\icons'
Save-Icon 192 "$icons\icon-192.png" 0.56 'rounded'
Save-Icon 512 "$icons\icon-512.png" 0.56 'rounded'
Save-Icon 512 "$icons\icon-maskable-512.png" 0.42
Save-Icon 180 "$icons\apple-touch-icon.png" 0.5

# Android
$res = Join-Path $root 'android\app\src\main\res'
if (Test-Path $res) {
  $densities = @{ mdpi = 1; hdpi = 1.5; xhdpi = 2; xxhdpi = 3; xxxhdpi = 4 }
  foreach ($d in $densities.Keys) {
    $s = $densities[$d]
    Save-Icon (48 * $s) "$res\mipmap-$d\ic_launcher.png" 0.56 'rounded'
    Save-Icon (48 * $s) "$res\mipmap-$d\ic_launcher_round.png" 0.5 'circle'
    Save-Icon (108 * $s) "$res\mipmap-$d\ic_launcher_foreground.png" 0.36  # vùng an toàn của adaptive icon
  }
  # Màn hình chờ (Android 11 trở xuống): vẽ lại mọi splash.png với đúng kích thước cũ
  Get-ChildItem $res -Recurse -Filter splash.png | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName); $w = $img.Width; $h = $img.Height; $img.Dispose()
    Save-Splash $w $h $_.FullName
  }
}
Write-Output 'Icons done'
