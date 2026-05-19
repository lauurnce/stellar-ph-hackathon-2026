# Pangolin Escrow — Build Contract
# Run from project root: .\scripts\build-contract.ps1

$ErrorActionPreference = "Stop"

$contractDir = Resolve-Path (Join-Path (Join-Path $PSScriptRoot "..") "contract")

Write-Host "Building Pangolin Escrow contract..." -ForegroundColor Cyan
Write-Host "Contract directory: $contractDir" -ForegroundColor Gray

Push-Location $contractDir

try {
    cargo build --target wasm32-unknown-unknown --release

    $wasmFiles = Get-ChildItem "target\wasm32-unknown-unknown\release\*.wasm" -ErrorAction SilentlyContinue
    if ($wasmFiles.Count -eq 0) {
        Write-Host "ERROR: No .wasm file found after build." -ForegroundColor Red
        Write-Host "Check that the crate-type is [cdylib] in Cargo.toml" -ForegroundColor Yellow
        exit 1
    }

    Write-Host "`nBuild successful!" -ForegroundColor Green
    foreach ($wasm in $wasmFiles) {
        $sizeMB = [math]::Round($wasm.Length / 1KB, 1)
        Write-Host "  $($wasm.Name) ($sizeMB KB)" -ForegroundColor Gray
    }

    Write-Host "`nNext step: run .\scripts\deploy-testnet.ps1" -ForegroundColor Cyan
} finally {
    Pop-Location
}
