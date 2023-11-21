# install.ps1

Write-Host "Installing Chocolatey"
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

Write-Host "Installing Python and Ansible"
choco install -y python
choco install -y ansible

Write-Host "Installing IIS"
Install-WindowsFeature -Name Web-Server -IncludeManagementTools

Write-Host "Granting required permissions"
Add-LocalGroupMember -Group "Administrators" -Member $env:USERNAME



