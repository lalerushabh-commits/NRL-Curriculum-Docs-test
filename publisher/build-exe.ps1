# Build "NRL Curriculum Publisher.exe".
#
# The exe is deliberately thin. It contains the window and the step runner and
# nothing else: the converter lives in the repository and is picked up fresh on
# every run, so fixing the converter never means rebuilding or redistributing
# this. Rebuild it only when the window itself changes.
#
# Needs a real Python 3 with tkinter (the python.org installer has it; the one
# bundled with PlatformIO does not).
#
#   powershell -ExecutionPolicy Bypass -File publisher\build-exe.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

python -c "import tkinter" 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "This Python has no tkinter. Install Python 3 from python.org and try again." -ForegroundColor Red
  exit 1
}

python -m pip install --quiet --upgrade pyinstaller
if ($LASTEXITCODE -ne 0) { exit 1 }

python -m PyInstaller `
  --noconfirm `
  --onefile `
  --windowed `
  --name "NRL Curriculum Publisher" `
  --distpath dist `
  --workpath build `
  --specpath build `
  gui.py

if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host ""
Write-Host "Built publisher\dist\NRL Curriculum Publisher.exe" -ForegroundColor Green
Write-Host "Hand that one file to whoever writes the curriculum."
