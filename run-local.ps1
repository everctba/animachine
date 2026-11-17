# Builda o animachine da fonte e serve uma página de teste local.
#
#   .\run-local.ps1              # porta 8091
#   .\run-local.ps1 -Port 9000   # outra porta
#
# Pré-requisitos (já aplicados neste clone):
#   - npm install --legacy-peer-deps (dependências do animachine)
#   - repo ../spaceman e ../quick-interface com npm install --omit=dev
#   - junctions de babel-loader/afflatus/react-matterkit nos repos irmãos
#   - package.json: "spaceman" removido (é local), overrides graceful-fs, webpack-dev-server 1.16.5
param([int]$Port = 8091)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "compilando (webpack 1 + babel 5)..."
& .\node_modules\.bin\webpack.cmd --config webpack.browser.config.dev.js
if ($LASTEXITCODE -ne 0) { throw "build falhou (exit $LASTEXITCODE)" }

Copy-Item "$root\browser\animachine.js" "$root\local-test\animachine.js" -Force
Write-Host "servindo em http://127.0.0.1:$Port/"
Write-Host "abra no Chrome: http://127.0.0.1:$Port/"
python -m http.server $Port --bind 127.0.0.1 --directory "$root\local-test"
