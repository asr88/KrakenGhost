# PowerShell Script

# Define paths (assuming script is in the root of your project)
$allFeaturesFolder = ".\all_features\4_5"
$featuresFolder = ".\features"
$backupFolder = ".\features_backup"

Write-Host "Starting feature file management..."

# Create backup folder if it doesn't exist
if (-not (Test-Path $backupFolder)) {
    New-Item -ItemType Directory -Force -Path $backupFolder
    Write-Host "Created backup folder"
}

# Get all feature files from all_features folder
$featureFiles = Get-ChildItem -Path "$allFeaturesFolder\*.feature"

if ($featureFiles.Count -eq 0) {
    Write-Host "No feature files found in all_features folder"
    exit
}

Write-Host "Found $($featureFiles.Count) feature files to process"

# Create a report file
$reportPath = ".\test_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
"Feature Test Results - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File $reportPath
"----------------------------------------" | Out-File $reportPath -Append

# Process each feature file one by one
foreach ($file in $featureFiles) {
    Write-Host "`nProcessing feature file: $($file.Name)"
    
    # Backup existing feature files
    if (Test-Path "$featuresFolder\*.feature") {
        Write-Host "Backing up existing feature files..."
        Move-Item -Path "$featuresFolder\*.feature" -Destination $backupFolder -Force
    }
    
    # Copy current feature file to features folder
    Write-Host "Moving feature file to features folder..."
    Copy-Item -Path $file.FullName -Destination $featuresFolder -Force
    
    # Run Kraken and capture output
    Write-Host "Running Kraken tests for $($file.Name)..."
    $testOutput = npx kraken-node run 2>&1 | Out-String
    
    # Log results to report file
    "`nResults for: $($file.Name)" | Out-File $reportPath -Append
    "----------------------------------------" | Out-File $reportPath -Append
    if ($LASTEXITCODE -ne 0) {
        "❌ Test Failed" | Out-File $reportPath -Append
        $testOutput | Out-File $reportPath -Append
    } else {
        "✅ Test Passed" | Out-File $reportPath -Append
    }
    
    # Clean up current feature file
    Write-Host "Cleaning up..."
    Remove-Item "$featuresFolder\*.feature" -Force
    
    # Restore backup if it exists
    if (Test-Path "$backupFolder\*.feature") {
        Move-Item -Path "$backupFolder\*.feature" -Destination $featuresFolder -Force
        Write-Host "Original feature files restored"
    }
    
    Write-Host "Completed processing $($file.Name)"
}

Write-Host "`nAll feature files have been processed!"
Write-Host "Test report available at: $reportPath" 