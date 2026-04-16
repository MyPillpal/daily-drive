$taskName = "DailyBillingScrape"
$projectDir = "C:\Dev\daily-drive"
$npmPath = (Get-Command npm).Source

$action = New-ScheduledTaskAction `
    -Execute $npmPath `
    -Argument "run billing:scrape" `
    -WorkingDirectory $projectDir

$trigger = New-ScheduledTaskTrigger -Daily -At "11:50PM"

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Removed existing task '$taskName'."
}

Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Scrape Claude billing data and sync to Supabase nightly"

Write-Host ""
Write-Host "Scheduled task '$taskName' created."
Write-Host "  Runs daily at 11:50 PM."
Write-Host "  Working dir: $projectDir"
Write-Host ""
Write-Host "To verify:  Get-ScheduledTask -TaskName '$taskName'"
Write-Host "To remove:  Unregister-ScheduledTask -TaskName '$taskName'"
Write-Host "To run now: Start-ScheduledTask -TaskName '$taskName'"
