$appPath = "c:\Users\Owner\source\repos\nantetudev\NantetuServer_Develop\src\App.jsx"
$outputPath = "c:\Users\Owner\source\repos\nantetudev\NantetuServer_Develop\src\config\languages.js"

# Read the file
$lines = Get-Content $appPath

# Extract lines 60-658 (0-indexed: 59-657)
$langLines = $lines[59..657]

# Add export and join
$content = "export " + ($langLines -join "`r`n")

# Create directory if it doesn't exist
$dir = Split-Path $outputPath -Parent
if (!(Test-Path $dir)) {
    New-Item -Path $dir -ItemType Directory -Force | Out-Null
}

# Write the file
Set-Content -Path $outputPath -Value $content

Write-Host "Successfully created languages.js"
