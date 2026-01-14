param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

# 1. Build the project
Write-Host "🚧 Building project..." -ForegroundColor Yellow
# Use cmd /c to ensure npm runs correctly in PowerShell
cmd /c "npm run build"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# 2. Check dist directory
if (-not (Test-Path "dist")) {
    Write-Error "dist directory not found!"
    exit 1
}

# 3. Enter dist directory
Push-Location dist

# 4. Initialize Git and Push
Write-Host "🚀 Pushing to Gitee Pages..." -ForegroundColor Cyan

# Remove existing .git if any (to ensure fresh init)
if (Test-Path ".git") {
    Remove-Item -Path ".git" -Recurse -Force
}

git init
git add -A
git commit -m "deploy: Gitee Pages update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Check if remote exists (shouldn't since we re-inited, but good practice)
git remote add origin $RepoUrl

# Force push to 'pages' branch (standard for static sites sometimes, or master, but separate branch is cleaner)
# Using 'pages' branch to separate from source code
git push -f origin master:pages

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully deployed to Gitee Pages branch!" -ForegroundColor Green
    Write-Host "👉 Go to your Gitee Repo -> Services -> Gitee Pages to enable/update the service."
} else {
    Write-Error "Failed to push to Gitee."
}

# 5. Restore location
Pop-Location
