$appPath = "c:\Users\Owner\source\repos\nantetudev\NantetuServer_Develop\src\App.jsx"

# Read all lines
$lines = [System.Collections.ArrayList](Get-Content $appPath)

# Remove lines 36-634 (0-indexed: 35-633)
# Remove 599 lines starting from index 35
for ($i = 0; $i -lt 599; $i++) {
    $lines.RemoveAt(35)
}

# Insert comment at line 36 (index 35)
$lines.Insert(35, "// LANGUAGES object now imported from './config/languages'")

# Write back
Set-Content -Path $appPath -Value $lines

Write-Host "Successfully removed LANGUAGES from App.jsx"
