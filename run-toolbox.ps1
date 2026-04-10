param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Command
)

$ErrorActionPreference = 'Stop'
$imageName = 'chatbot-devops-toolbox:latest'
$currentDir = (Get-Location).Path
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$kubeDir = Join-Path $HOME '.kube'
$sshDir = Join-Path $HOME '.ssh'

Write-Host "Building toolbox image: $imageName"
docker build -f "$repoRoot/toolbox/Dockerfile" -t $imageName "$repoRoot/toolbox"

$dockerArgs = @(
  'run', '--rm', '-it',
  '-v', "${currentDir}:/workspace",
  '-w', '/workspace'
)

if (Test-Path $kubeDir) {
  $dockerArgs += @('-v', "${kubeDir}:/root/.kube")
}

if (Test-Path $sshDir) {
  $dockerArgs += @('-v', "${sshDir}:/root/.ssh:ro")
}

$dockerArgs += $imageName

if ($Command.Count -gt 0) {
  $dockerArgs += $Command
}

Write-Host "Running ephemeral toolbox container in $currentDir"
& docker @dockerArgs
