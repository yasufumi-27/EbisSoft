param(
  [ValidateSet("morning", "afternoon", "both")]
  [string]$Slot = "both"
)

$ErrorActionPreference = "Stop"
$projectDir = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$expectedRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path

if ($projectDir -ne $expectedRoot) {
  throw "プロジェクトの解決先が一致しません"
}

Set-Location -LiteralPath $projectDir
& node (Join-Path $PSScriptRoot "run.mjs") $Slot
if ($LASTEXITCODE -ne 0) {
  throw "SNS下書き生成に失敗しました (exit=$LASTEXITCODE)"
}
