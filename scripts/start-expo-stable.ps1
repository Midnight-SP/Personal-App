$ErrorActionPreference = 'Stop'

function Test-PortAvailable {
  param([int]$Port)

  try {
    $listeners = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
    if ($listeners) {
      return $false
    }

    return $true
  } catch {
    return $false
  }
}

function Get-FirstAvailablePort {
  param(
    [int]$StartPort = 8081,
    [int]$MaxPort = 8090
  )

  for ($port = $StartPort; $port -le $MaxPort; $port++) {
    if (Test-PortAvailable -Port $port) {
      return $port
    }
  }

  return $null
}

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "[1/4] Stopping stale Expo processes..." -ForegroundColor Cyan
$expoProcesses = Get-CimInstance Win32_Process |
  Where-Object {
    $_.Name -eq 'node.exe' -and
    $_.CommandLine -match 'expo(\s|\\)start' -and
    $_.CommandLine -match [Regex]::Escape($projectRoot)
  }

if ($expoProcesses) {
  foreach ($process in $expoProcesses) {
    try {
      Stop-Process -Id $process.ProcessId -Force -ErrorAction Stop
    } catch {
    }
  }
  Write-Host "Stopped $($expoProcesses.Count) Expo process(es)." -ForegroundColor Yellow
} else {
  Write-Host "No stale Expo processes found." -ForegroundColor Green
}

Write-Host "[2/4] Detecting LAN IPv4..." -ForegroundColor Cyan
$lanIp = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object {
    $_.IPAddress -notlike '169.254*' -and
    $_.InterfaceAlias -notmatch 'Loopback|vEthernet|Virtual|WSL' -and
    $_.PrefixOrigin -ne 'WellKnown'
  } |
  Select-Object -First 1 -ExpandProperty IPAddress

if (-not $lanIp) {
  Write-Host "Could not detect LAN IPv4 automatically." -ForegroundColor Red
  Write-Host "Start manually with: npx expo start --host lan --port 8081 -c" -ForegroundColor Red
  exit 1
}

Write-Host "LAN IP: $lanIp" -ForegroundColor Green
$port = Get-FirstAvailablePort -StartPort 8081 -MaxPort 8090
if (-not $port) {
  Write-Host "No free local port found in range 8081-8090." -ForegroundColor Red
  Write-Host "Free a port and run: npm run start:stable" -ForegroundColor Red
  exit 1
}

Write-Host "[3/4] Starting Expo on port $port..." -ForegroundColor Cyan
Write-Host "Use this URL in Expo Go: exp://$lanIp`:$port" -ForegroundColor Magenta
Write-Host "If phone can't connect, test in mobile browser: http://$lanIp`:$port" -ForegroundColor Magenta
Write-Host "" 
Write-Host "[4/4] Metro logs:" -ForegroundColor Cyan

npx expo start --host lan --port $port -c
