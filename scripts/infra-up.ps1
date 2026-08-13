$ErrorActionPreference = "Stop"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error "Docker is required for local infrastructure but was not found on PATH."
}

docker compose up -d postgres
docker compose ps postgres
