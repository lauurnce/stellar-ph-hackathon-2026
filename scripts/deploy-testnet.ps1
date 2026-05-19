# Pangolin Escrow — Deploy to Stellar Testnet
# Run from project root: .\scripts\deploy-testnet.ps1
# Requires: stellar-cli installed, identity "my-key" created and funded

param(
    [string]$KeyName = "my-key",
    [string]$Network = "testnet"
)

$ErrorActionPreference = "Stop"

$wasmPath = Join-Path (Join-Path (Join-Path (Join-Path (Join-Path (Join-Path $PSScriptRoot "..") "contract") "target") "wasm32-unknown-unknown") "release") "pangolin_escrow.wasm"
$wasmPath = Resolve-Path $wasmPath -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Path

if (-not (Test-Path $wasmPath)) {
    Write-Host "ERROR: WASM file not found at: $wasmPath" -ForegroundColor Red
    Write-Host "Run .\scripts\build-contract.ps1 first." -ForegroundColor Yellow
    exit 1
}

Write-Host "Deploying Pangolin Escrow to $Network..." -ForegroundColor Cyan
Write-Host "WASM: $wasmPath" -ForegroundColor Gray
Write-Host "Key:  $KeyName" -ForegroundColor Gray
Write-Host ""

$contractId = stellar contract deploy `
    --wasm $wasmPath `
    --source $KeyName `
    --network $Network

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Deploy failed." -ForegroundColor Red
    exit 1
}

Write-Host "`nDeployment successful!" -ForegroundColor Green
Write-Host "Contract ID: $contractId" -ForegroundColor Yellow
Write-Host ""
Write-Host "Add to pangolin\.env.local:" -ForegroundColor Cyan
Write-Host "  NEXT_PUBLIC_SOROBAN_CONTRACT_ID=$contractId" -ForegroundColor White
Write-Host ""
Write-Host "Verify on Stellar Expert:" -ForegroundColor Cyan
Write-Host "  https://stellar.expert/explorer/testnet/contract/$contractId" -ForegroundColor White
