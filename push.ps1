# Git Automation Push Script for Dipraj Misal
$repoUrl = "https://github.com/misaldipraj22-web/portfolio.git"

# Check if Git is installed
$gitInstalled = $false
try {
    $null = git --version
    if ($LASTEXITCODE -eq 0) {
        $gitInstalled = $true
    }
} catch {
    # Git not found
}

if (-not $gitInstalled) {
    Write-Host "Git was not detected on your system path." -ForegroundColor Yellow
    Write-Host "Installing Git automatically via Windows Package Manager (winget)..." -ForegroundColor Cyan
    Write-Host "IMPORTANT: Please click 'Yes' on the Windows Admin UAC prompt that appears!" -ForegroundColor Cyan
    
    # Run winget installer
    Start-Process winget -ArgumentList "install --id Git.Git -e --accept-source-agreements --accept-package-agreements" -NoNewWindow -Wait
    
    # Reload environment path
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    # Verify again
    try {
        $null = git --version
        $gitInstalled = $true
        Write-Host "Git successfully installed and configured!" -ForegroundColor Green
    } catch {
        Write-Host "Could not locate Git after installation." -ForegroundColor Red
        Write-Host "Please install Git manually from: https://git-scm.com/download/win" -ForegroundColor Yellow
        Write-Host "After installing Git, open a new PowerShell window and run this script again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit..."
        exit
    }
}

# Run Git commands
Write-Host "Initializing local repository..." -ForegroundColor Cyan
git init

Write-Host "Staging files..." -ForegroundColor Cyan
git add .

Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial portfolio setup"

Write-Host "Configuring default branch to 'main'..." -ForegroundColor Cyan
git branch -M main

# Add remote configuration
Write-Host "Connecting remote origin..." -ForegroundColor Cyan
try {
    git remote add origin $repoUrl
} catch {
    git remote set-url origin $repoUrl
}

# Push repository contents
Write-Host "Pushing files to GitHub..." -ForegroundColor Cyan
Write-Host "NOTE: A GitHub authentication window may appear. Please log in to complete the transfer." -ForegroundColor Yellow
git push -u origin main -f

Write-Host "`nSuccessfully pushed code to GitHub repository!" -ForegroundColor Green
Write-Host "View your code at: https://github.com/misaldipraj22-web/portfolio" -ForegroundColor Green
Read-Host "`nPress Enter to exit..."
