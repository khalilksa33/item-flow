# build-installer.ps1
# This script builds the Vite web UI, publishes the .NET WinForms wrapper as a self‑contained
# executable, and packages everything into an MSI using WiX.
# Prerequisites: .NET SDK 6+, WiX Toolset (or it will be downloaded automatically).

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# -------------------------------------------------------------------------
# Helper – download WiX if not present
# -------------------------------------------------------------------------
function Get-WiX {
    param(
        [string]$Destination = "$PSScriptRoot\wix"
    )
    $binPath = Join-Path $Destination "bin"
    if (-Not (Test-Path "$binPath\candle.exe")) {
        Write-Host "WiX not found – downloading zip..."
        $zipUrl = "https://github.com/wixtoolset/wix3/releases/download/wix314rtm/wix314-binaries.zip"
        $zipPath = "$env:TEMP\wix311.zip"
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
        Expand-Archive -Path $zipPath -DestinationPath $Destination -Force
    }
    return $Destination
}


# -------------------------------------------------------------------------
# Step 1 – Build the web UI
# -------------------------------------------------------------------------
Write-Host "=== Step 1: Build Vite web assets ==="
# Ensure we are at repository root before calling the script that lives there
Push-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
    ..\build-web.ps1
Pop-Location

# -------------------------------------------------------------------------
# Step 2 – Publish .NET WinForms wrapper (self‑contained)
# -------------------------------------------------------------------------
Write-Host "=== Step 2: Publish .NET project ==="
# Publish .NET WinForms wrapper (self‑contained)
# Use the correct project file path (current directory)
$projectPath = Join-Path $PSScriptRoot "KamySoftInstaller.csproj"
if (-Not (Test-Path $projectPath)) {
    throw "Project file not found at $projectPath"
}
dotnet publish $projectPath `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -p:PublishSingleFile=true `
    -p:PublishReadyToRun=true `
    -o "$PSScriptRoot\publish"
# Check for WiX tools before proceeding
$wixPath = Get-WiX
$wixBin = Join-Path $wixPath "bin"
$heat = "$wixBin\heat.exe"
if (-Not (Test-Path $heat)) {
    Write-Warning "WiX 'heat.exe' not found. Skipping MSI generation. Please install WiX manually if you need an MSI."
    exit 0
}

# -------------------------------------------------------------------------
# Step 3 – Harvest published folder into a WiX component group
# -------------------------------------------------------------------------
$wixPath = Get-WiX
$heat = "$wixPath\heat.exe"
$harvestOutput = "$PSScriptRoot\KamySoftInstaller\KamySoftComponents.wxs"
Write-Host "=== Step 3: Harvest published output with WiX ==="
& $heat dir "$PSScriptRoot\KamySoftInstaller\publish" `
    -cg KamySoftComponents `
    -dr INSTALLFOLDER `
    -srd -sreg -sfrag `
    -var var.PublishDir `
    -out $harvestOutput

# -------------------------------------------------------------------------
# Step 4 – Compile the WiX source into an MSI
# -------------------------------------------------------------------------
$candle = "$wixBin\candle.exe"
$light   = "$wixBin\light.exe"
Write-Host "=== Step 4: Compile WiX sources ==="
& $candle "$PSScriptRoot\KamySoftInstaller\KamySoftInstaller.wxs" $harvestOutput `
    -dPublishDir="$PSScriptRoot\KamySoftInstaller\publish"
if ($LASTEXITCODE -ne 0) { throw "candle.exe failed" }

& $light -ext WixUIExtension `
    "$PSScriptRoot\KamySoftInstaller\KamySoftInstaller.wixobj" "$PSScriptRoot\KamySoftInstaller\KamySoftComponents.wixobj" `
    -o "$PSScriptRoot\output\KamySoftInstaller.msi"
if ($LASTEXITCODE -ne 0) { throw "light.exe failed" }

Write-Host "\n✅ MSI built successfully: $PSScriptRoot\output\KamySoftInstaller.msi"
