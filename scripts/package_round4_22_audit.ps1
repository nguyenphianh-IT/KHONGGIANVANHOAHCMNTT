Set-Location "docs\phase-0b-3\phase-0b-3-1"
$auditFiles = @(
  "PHASE_0B_3_1_FINAL_DOCUMENTATION_AUDIT_REPORT_ROUND4_22.md",
  "PHASE_0B_3_1_IMPLEMENTATION_READINESS_VERDICT_ROUND4_22.md",
  "PHASE_0B_3_1_FINDINGS_REGISTER_ROUND4_22.md",
  "PHASE_0B_3_1_AUDIT_EVIDENCE_MANIFEST_ROUND4_22.md"
)
$auditDst = "PHASE_0B_3_1_AUDIT_DELIVERABLES_ROUND4_22.zip"
if (Test-Path $auditDst) { Remove-Item $auditDst -Force }
Compress-Archive -Path $auditFiles -DestinationPath $auditDst -Force
Write-Host "Audit ZIP created successfully: $auditDst"
