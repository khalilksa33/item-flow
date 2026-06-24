# build-web.ps1
# This script builds the Vite web application and copies the output to the .NET project.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Ensure we are in the repository root
Push-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Installing npm dependencies..."
# Install npm dependencies including missing recharts and browserslist helpers
npm install
Write-Host "Installing missing PostCSS helper and recharts..."
npm install caniuse-lite browserslist recharts
# Skipping browserslist database update to avoid bun dependency
# npx browserslist --update-db

Write-Host "Building the Vite project with npx..."
npx vite build

# The built assets are placed in the 'dist' folder.
# Copy them into the KamySoftInstaller project output folder for packaging.
$dest = Join-Path -Path "KamySoftInstaller" -ChildPath "dist"
if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
Copy-Item -Path "dist" -Destination $dest -Recurse

Write-Host "Web assets have been copied to $dest"
Pop-Location
