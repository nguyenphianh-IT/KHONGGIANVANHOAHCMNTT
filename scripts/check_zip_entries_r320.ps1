Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("docs\phase-0b-2\PHASE_0B_2_3_DELIVERABLES_ROUND3_20.zip")
Write-Host "Count:" $zip.Entries.Count
foreach ($entry in $zip.Entries) {
    Write-Host "  " $entry.FullName "(Size:" $entry.Length ")"
}
$zip.Dispose()
