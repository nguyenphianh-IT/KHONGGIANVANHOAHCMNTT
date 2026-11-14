$src = 'docs/phase-0b-2/PHASE_0B_2_3_DOCUMENTATION_DELTA_REMEDIATION_ROUND3_13/*'
$dst = 'docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_13.zip'
if (Test-Path $dst) { Remove-Item $dst -Force }
Compress-Archive -Path $src -DestinationPath $dst -Force
Write-Host "Packaging complete: $dst"
