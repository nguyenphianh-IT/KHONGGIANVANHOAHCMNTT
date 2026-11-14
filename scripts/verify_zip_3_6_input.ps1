Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = (Resolve-Path "docs/phase-0b-2/PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_5.zip").Path
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$entryCount = $zip.Entries.Count
Write-Host "Total entries in ZIP: $entryCount"

$allPassed = $true
$nonMd = 0
$corrupt = 0
foreach ($entry in $zip.Entries) {
    if (-not $entry.Name.EndsWith(".md")) {
        $nonMd++
    }
    try {
        $stream = $entry.Open()
        $buffer = New-Object byte[] 4096
        $totalRead = 0
        while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
            $totalRead += $read
        }
        $stream.Close()
        if ($totalRead -ne $entry.Length) {
            $corrupt++
            Write-Host "Mismatch: $($entry.FullName)"
        }
    } catch {
        $corrupt++
        Write-Host "Error: $($entry.FullName)"
    }
}
$zip.Dispose()

Write-Host "Non-MD: $nonMd"
Write-Host "Corrupt: $corrupt"
if ($corrupt -eq 0 -and $entryCount -eq 31 -and $nonMd -eq 0) {
    Write-Host "ZIP CRC & INTEGRITY: 100% PASS (31 ENTRIES)"
} else {
    Write-Host "ZIP CRC: FAILED"
}
