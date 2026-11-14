Add-Type -AssemblyName System.IO.Compression.FileSystem
$z = [System.IO.Compression.ZipFile]::OpenRead("docs\phase-0b-3\phase-0b-3-1\PHASE_0B_3_1_AUDIT_DELIVERABLES_ROUND4_22.zip")
Write-Host "Audit ZIP Count: " $z.Entries.Count
foreach($e in $z.Entries) {
  $stream = $e.Open()
  $buf = New-Object byte[] 1024
  while ($stream.Read($buf, 0, $buf.Length) -gt 0) {}
  $stream.Dispose()
  Write-Host " - " $e.FullName "(" $e.Length "bytes, Decompressed: PASS)"
}
$z.Dispose()
