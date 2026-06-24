$ErrorActionPreference = 'Stop'

$project = Resolve-Path (Join-Path $PSScriptRoot '..')
$outputRoot = 'G:\My Drive\Visual Code Studio\LaunchPad'
$distRoot = Join-Path $outputRoot 'dist'
$appOut = Join-Path $distRoot 'win-unpacked'
$version = (Get-Content (Join-Path $project 'package.json') -Raw | ConvertFrom-Json).version

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

Push-Location $project
try {
  npm.cmd exec electron-builder -- --win dir
} catch {
  Write-Host "electron-builder ended before installer signing completed. Continuing with win-unpacked if present."
}
Pop-Location

if (-not (Test-Path (Join-Path $appOut 'LaunchPad.exe'))) {
  throw "Build output was not found at $appOut"
}

$rcedit = Get-ChildItem -Path "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign" -Recurse -Filter rcedit-x64.exe -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1 -ExpandProperty FullName

if ($rcedit) {
  $exe = Join-Path $appOut 'LaunchPad.exe'
  $icon = Join-Path $project 'build\icon.ico'
  $tempDir = Join-Path $env:TEMP 'LaunchPadIconStamp'
  New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
  $tempExe = Join-Path $tempDir 'LaunchPad.exe'
  Copy-Item -LiteralPath $exe -Destination $tempExe -Force
  & $rcedit $tempExe --set-icon $icon
  if ($LASTEXITCODE -eq 0) {
    Copy-Item -LiteralPath $tempExe -Destination $exe -Force
  }
}

$dataOut = Join-Path $appOut 'LaunchPad Data'
New-Item -ItemType Directory -Force -Path $dataOut | Out-Null
'[]' | Set-Content -Path (Join-Path $dataOut 'merchants.json') -Encoding UTF8

$releaseRoot = Join-Path $outputRoot 'releases'
$stage = Join-Path $releaseRoot "LaunchPad-v$version-win-x64"
$zip = Join-Path $releaseRoot "LaunchPad-v$version-win-x64.zip"
Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $zip -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $stage | Out-Null
Copy-Item -Path (Join-Path $appOut '*') -Destination $stage -Recurse -Force
Set-Content -Path (Join-Path $stage 'README-FIRST.txt') -Value "LaunchPad v$version`r`n`r`nBlank starter copy. Extract the ZIP, run LaunchPad.exe, and keep LaunchPad Data beside the executable. No merchant data is included." -Encoding UTF8
Compress-Archive -Path $stage -DestinationPath $zip -Force

$personalRoot = Join-Path $outputRoot 'personal-releases'
$personalStage = Join-Path $personalRoot "LaunchPad-personal-v$version-win-x64"
$personalZip = Join-Path $personalRoot "LaunchPad-personal-v$version-win-x64.zip"
Remove-Item -LiteralPath $personalStage -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $personalZip -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $personalStage | Out-Null
Copy-Item -Path (Join-Path $appOut '*') -Destination $personalStage -Recurse -Force

$sharedData = Join-Path $outputRoot 'LaunchPad Data\merchants.json'
$localData = Join-Path $env:APPDATA 'LaunchPad\merchants.json'
$sourceData = if (Test-Path $sharedData) { $sharedData } elseif (Test-Path $localData) { $localData } else { '' }
if ($sourceData) {
  Copy-Item -LiteralPath $sourceData -Destination (Join-Path $personalStage 'LaunchPad Data\merchants.json') -Force
}

Set-Content -Path (Join-Path $personalStage 'README-PERSONAL.txt') -Value "LaunchPad Personal v$version`r`n`r`nThis copy includes your current local/shared merchant data. Close LaunchPad on the other computer, extract this ZIP, run LaunchPad.exe, and keep LaunchPad Data beside it. Do not upload publicly." -Encoding UTF8
Compress-Archive -Path $personalStage -DestinationPath $personalZip -Force

[pscustomobject]@{
  Version = $version
  AppFolder = $appOut
  PublicZip = $zip
  PersonalZip = $personalZip
  SharedData = $sharedData
} | Format-List
