param(
  [string]$MorningTime = "07:00",
  [string]$AfternoonTime = "16:00"
)

$ErrorActionPreference = "Stop"
$runner = (Resolve-Path (Join-Path $PSScriptRoot "run-social-draft.ps1")).Path
$powerShell = (Get-Command powershell.exe).Source

function Register-DraftTask {
  param(
    [string]$TaskName,
    [string]$Slot,
    [string]$Time
  )

  $action = New-ScheduledTaskAction `
    -Execute $powerShell `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$runner`" -Slot $Slot"
  $trigger = New-ScheduledTaskTrigger -Daily -At $Time
  $settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -WakeToRun `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 25)

  Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "エビスソフト Instagram投稿前の画像案を生成してiPhoneへ通知" `
    -Force | Out-Null
}

Register-DraftTask -TaskName "EbisSoft Instagram Draft AM" -Slot "morning" -Time $MorningTime
Register-DraftTask -TaskName "EbisSoft Instagram Draft PM" -Slot "afternoon" -Time $AfternoonTime

Get-ScheduledTask -TaskName "EbisSoft Instagram Draft *" |
  Select-Object TaskName, State
