Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = (Resolve-Path "docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_5.zip").Path
$targetDir = Join-Path (Resolve-Path "docs/phase-0b-2").Path "PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_6"

if (Test-Path $targetDir) {
    Remove-Item $targetDir -Recurse -Force
}
New-Item -ItemType Directory -Path $targetDir | Out-Null

[System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $targetDir)

$files = Get-ChildItem -Path $targetDir
Write-Host "Extracted $($files.Count) files to $targetDir"
