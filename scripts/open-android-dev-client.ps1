$ErrorActionPreference = 'Stop'

$packageName = 'com.midnight-sp.personalapp'

function Wait-ForAndroidDevice {
  param(
    [int]$TimeoutSeconds = 60
  )

  $start = Get-Date
  while ((New-TimeSpan -Start $start -End (Get-Date)).TotalSeconds -lt $TimeoutSeconds) {
    $devices = adb devices | Select-String "emulator-.*\s+device|\S+\s+device"
    if ($devices) {
      return $true
    }
    Start-Sleep -Seconds 2
  }

  return $false
}

Write-Host "Checking ADB device..." -ForegroundColor Cyan
if (-not (Wait-ForAndroidDevice -TimeoutSeconds 60)) {
  Write-Host "No connected Android device/emulator found." -ForegroundColor Red
  Write-Host "Start emulator first, then run: npm run android:open" -ForegroundColor Red
  exit 1
}

Write-Host "Checking dev build package: $packageName" -ForegroundColor Cyan
$installed = adb shell pm list packages $packageName
if ($installed -notmatch [Regex]::Escape($packageName)) {
  Write-Host "Dev build is not installed: $packageName" -ForegroundColor Yellow
  Write-Host "Run once: npm run android" -ForegroundColor Yellow
  exit 1
}

Write-Host "Launching $packageName..." -ForegroundColor Cyan
adb shell monkey -p $packageName -c android.intent.category.LAUNCHER 1 | Out-Null
Write-Host "Opened development build." -ForegroundColor Green
