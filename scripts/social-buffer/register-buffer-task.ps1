param(
  [string]$Time = "02:30"
)

$ErrorActionPreference = "Stop"
$runner = (Resolve-Path (Join-Path $PSScriptRoot "fill-queue.mjs")).Path
$projectDir = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$node = (Get-Command node.exe -ErrorAction Stop).Source

$action = New-ScheduledTaskAction `
  -Execute $node `
  -Argument "`"$runner`"" `
  -WorkingDirectory $projectDir
$trigger = New-ScheduledTaskTrigger -Daily -At $Time
$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -WakeToRun `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 30)

Register-ScheduledTask `
  -TaskName "EbisSoft Buffer Instagram Queue" `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Generate Instagram carousels with Codex CLI and keep four days queued in Buffer Free" `
  -Force | Out-Null

Get-ScheduledTask -TaskName "EbisSoft Buffer Instagram Queue" |
  Select-Object TaskName, State
