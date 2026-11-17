# Prepara o animachine-mv3 para build em uma máquina limpa:
#   1. instala as dependências do editor
#   2. baixa os dois pacotes irmãos que nunca foram publicados no npm
#      (spaceman e quick-interface) e instala as dependências de runtime deles
#   3. cria os links (junctions) de babel-loader/afflatus/react/react-matterkit
#   4. builda a extensão em extension/
#
#   .\scripts\bootstrap.ps1
#   .\scripts\bootstrap.ps1 -NoBuild      # não builda no fim
param(
  [switch]$NoBuild
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$parent = Split-Path -Parent $root

function Ensure-Dir($path) {
  if (-not (Test-Path $path)) { New-Item -ItemType Directory -Force -Path $path | Out-Null }
}

function Ensure-Junction($link, $target, $label) {
  if (Test-Path $link) { return }
  if (-not (Test-Path $target)) { Write-Warning "sem alvo para $label ($target)"; return }
  New-Item -ItemType Junction -Path $link -Target $target | Out-Null
  Write-Host "  junction $label"
}

function Fetch-Repo($name) {
  $dir = Join-Path $parent $name
  if (Test-Path (Join-Path $dir 'package.json')) {
    Write-Host "  $name ja existe em $dir"
    return $dir
  }
  $tgz = Join-Path $env:TEMP "$name-master.tar.gz"
  $url = "https://codeload.github.com/azazdeaz/$name/tar.gz/refs/heads/master"
  Write-Host "  baixando $name de $url"
  Invoke-WebRequest -Uri $url -OutFile $tgz -UseBasicParsing -TimeoutSec 120
  Ensure-Dir $dir
  tar -xzf $tgz -C $dir --strip-components=1
  return $dir
}

Set-Location $root

Write-Host '[1/4] dependencias do animachine'
if (-not (Test-Path (Join-Path $root 'node_modules'))) {
  npm install --legacy-peer-deps --no-audit --no-fund
}
else {
  Write-Host '  node_modules ja existe'
}

Write-Host '[2/4] pacotes irmaos (spaceman, quick-interface)'
$spaceman = Fetch-Repo 'spaceman'
$quick = Fetch-Repo 'quick-interface'
foreach ($dir in @($spaceman, $quick)) {
  if (-not (Test-Path (Join-Path $dir 'node_modules'))) {
    Push-Location $dir
    npm install --omit=dev --legacy-peer-deps --no-audit --no-fund
    Pop-Location
  }
  else {
    Write-Host "  node_modules ja existe em $dir"
  }
}

Write-Host '[3/4] links entre os repos'
$babelLoader = Join-Path $root 'node_modules\babel-loader'
Ensure-Junction (Join-Path $spaceman 'node_modules\babel-loader') $babelLoader 'spaceman/babel-loader'
Ensure-Junction (Join-Path $quick 'node_modules\babel-loader') $babelLoader 'quick-interface/babel-loader'
foreach ($mod in @('afflatus', 'react', 'react-dom', 'react-matterkit')) {
  $target = Join-Path $root "node_modules\$mod"
  Ensure-Junction (Join-Path $quick "node_modules\$mod") $target "quick-interface/$mod"
}

Write-Host '[4/4] build da extensao'
if ($NoBuild) {
  Write-Host '  pulado (-NoBuild)'
}
else {
  powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root 'build-extension.ps1')
}

Write-Host ''
Write-Host "Pronto. Carregue '$root\extension' em chrome://extensions (Developer mode > Load unpacked)."
