# Empacota a extensão num zip pronto para o GitHub Releases.
#
#   .\scripts\package-extension.ps1
#   .\scripts\package-extension.ps1 -SkipBuild
#
# Saída: dist\animachine-mv3-v<versao>.zip  (pasta "animachine-mv3/" dentro do zip,
# caminhos com "/" para funcionar em Windows, macOS e Linux)
param(
  [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not $SkipBuild) {
  powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root 'build-extension.ps1')
}

$manifest = Get-Content (Join-Path $root 'extension\manifest.json') -Raw | ConvertFrom-Json
$version = $manifest.version
$stageRoot = Join-Path $env:TEMP "animachine-mv3-stage-$version"
$stage = Join-Path $stageRoot 'animachine-mv3'

if (Test-Path $stageRoot) { Remove-Item $stageRoot -Recurse -Force }
New-Item -ItemType Directory -Force -Path $stage | Out-Null
Copy-Item (Join-Path $root 'extension\*') $stage -Recurse -Force

New-Item -ItemType Directory -Force -Path (Join-Path $root 'dist') | Out-Null
$zipPath = Join-Path $root "dist\animachine-mv3-v$version.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
try {
  # compatível com PowerShell 5.1 (não existe [IO.Path]::GetRelativePath)
  $baseUri = [Uri]([IO.Path]::GetFullPath($stage).TrimEnd('\') + '\')
  Get-ChildItem $stage -Recurse -File | ForEach-Object {
    $itemUri = [Uri]([IO.Path]::GetFullPath($_.FullName))
    $inner = [Uri]::UnescapeDataString($baseUri.MakeRelativeUri($itemUri).ToString()).Replace('\', '/')
    $entryName = 'animachine-mv3/' + $inner
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $zip, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
}
finally {
  $zip.Dispose()
}

$hash = (Get-FileHash $zipPath -Algorithm SHA256).Hash.ToLower()
Write-Host ("zip: {0} ({1:N2} MB)" -f $zipPath, ((Get-Item $zipPath).Length / 1MB))
Write-Host "versao: $version"
Write-Host "sha256: $hash"
