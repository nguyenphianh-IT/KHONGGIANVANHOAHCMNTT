Add-Type -AssemblyName System.IO.Compression.FileSystem
$z = [System.IO.Compression.ZipFile]::OpenRead("docs\phase-0b-2\PHASE_0B_2_3_CMS_REDESIGN_REMEDIATED_ROUND3_14.zip")
$entry = $z.Entries | Where-Object { $_.Name -eq "PHASE_0B_2_3_ROUND3_14_SELF_CHECK_REPORT.md" }
if ($entry) {
    Write-Host "Found entry in ZIP Round 3.14:" $entry.FullName "Size:" $entry.Length
    $stream = $entry.Open()
    $ms = New-Object System.IO.MemoryStream
    $stream.CopyTo($ms)
    $bytes = $ms.ToArray()
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $hash = [System.BitConverter]::ToString($sha.ComputeHash($bytes)).Replace("-", "")
    Write-Host "Entry SHA-256:" $hash
    $stream.Dispose()
    $ms.Dispose()
} else {
    Write-Host "Entry not found"
}
$z.Dispose()
