# Builda a extensão MV3 (unpacked) com o editor e o GSAP embutidos.
#
#   .\build-extension.ps1
#
# Saída: extension/  -> carregar em chrome://extensions (modo desenvolvedor > "Load unpacked")
param([switch]$SkipBuild)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
$ext = Join-Path $root 'extension'

if (-not $SkipBuild) {
  Write-Host 'compilando animachine.js (webpack 1 + babel 5)...'
  & .\node_modules\.bin\webpack.cmd --config webpack.browser.config.dev.js
  if ($LASTEXITCODE -ne 0) { throw "build falhou (exit $LASTEXITCODE)" }
}

Copy-Item (Join-Path $root 'browser\animachine.js') (Join-Path $ext 'animachine.js') -Force
New-Item -ItemType Directory -Force -Path (Join-Path $ext 'vendor') | Out-Null
Copy-Item (Join-Path $root 'node_modules\gsap\src\minified\TweenMax.min.js') (Join-Path $ext 'vendor\gsap.min.js') -Force

$bundle = Get-Item (Join-Path $ext 'animachine.js')
$gsap = Get-Item (Join-Path $ext 'vendor\gsap.min.js')
Write-Host ("extension pronta: animachine.js {0:N2} MB + gsap.min.js {1:N0} KB" -f ($bundle.Length/1MB), ($gsap.Length/1KB))
Write-Host "carregue $ext em chrome://extensions (Developer mode > Load unpacked)"
