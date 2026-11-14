Set-Location "docs\phase-0b-3\phase-0b-3-1"
$files = @(
  "PHASE_0B_3_1_PILOT_SCOPE.md",
  "PHASE_0B_3_1_RACI_MATRIX.md",
  "PHASE_0B_3_1_PILOT_RISK_REGISTER.md",
  "PHASE_0B_3_1_PILOT_ENTRY_CRITERIA.md",
  "PHASE_0B_3_1_PILOT_GOVERNANCE.md",
  "PHASE_0B_3_1_ROUND3_22_CHANGELOG.md",
  "PHASE_0B_3_1_ROUND3_22_SELF_CHECK_REPORT.md",
  "PHASE_0B_3_1_ROUND3_22_CHECKSUM_MANIFEST.md"
)
$dst = "PHASE_0B_3_1_DELIVERABLES_ROUND3_22.zip"
if (Test-Path $dst) { Remove-Item $dst -Force }
Compress-Archive -Path $files -DestinationPath $dst -Force
Write-Host "ZIP created successfully: $dst"
