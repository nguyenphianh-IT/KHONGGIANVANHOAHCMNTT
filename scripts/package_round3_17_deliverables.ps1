$files = @(
  'docs/phase-0b-2/PHASE_0B_2_3_ROUND3_17_PROJECT_TEAM_REPORT.md',
  'docs/phase-0b-2/PHASE_0B_2_3_ROUND3_17_CHANGELOG.md',
  'docs/phase-0b-2/PHASE_0B_2_3_ROUND3_17_SELF_CHECK_REPORT.md',
  'docs/phase-0b-2/PHASE_0B_2_3_ROUND3_17_DELIVERABLES_CHECKSUM.md',
  'docs/phase-0b-2/PHASE_0B_2_3_ROUND3_15_REPORT_CHECKSUM.md',
  'docs/phase-0b-2/PHASE_0B_2_3_ROUND3_16_PROJECT_TEAM_REPORT.md',
  'docs/phase-0b-2/PHASE_0B_2_3_ROUND3_16_CHANGELOG.md',
  'docs/phase-0b-2/PHASE_0B_2_3_ROUND3_16_SELF_CHECK_REPORT.md'
)
$dst = 'docs/phase-0b-2/PHASE_0B_2_3_DELIVERABLES_ROUND3_17.zip'
if (Test-Path $dst) { Remove-Item $dst -Force }
Compress-Archive -Path $files -DestinationPath $dst -Force
Write-Host "Created Round 3.17 deliverables package: $dst"
