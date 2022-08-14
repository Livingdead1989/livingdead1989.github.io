---
title: "PowerShell Core"
date: 2022-08-14 09:10:00 +0000
categories: server
tags: powershell
description: >- # this means to ignore newlines until "baseurl:"
  Introduction to PowerShell Core
---

## PowerShell Core

PowerShell Core, introduced in 2016 is open-source and designed to run cross-platform on Windows, Mac, and Linux. PowerShell Core runs on top of [.NET Core](https://docs.microsoft.com/en-us/dotnet/core/introduction), a cross-platform, open-source version of .NET.

PowerShell and PowerShell Core can run in parallel, and its important to remember that not all cmdlets and features are available in PowerShell Core.



## Installation

### Windows

[Windows Installation Documentation](https://docs.microsoft.com/en-gb/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2)

Download [Windows (x64) LTS MSI](https://github.com/powershell/powershell) file - at the time, version 7.2 LTS is the current stable.

The default install options are

![powershell-core-1](/assets/images/posts/powershell-core-1.png)

![powershell-core-2](/assets/images/posts/powershell-core-2.png)

Once installed you can verify the installed version

```powershell
$PSVersionTable
```

To call PowerShell Core from a normal command prompt use the command

```bash
PWSH
```



### Linux

[Installation Documentation](https://docs.microsoft.com/en-gb/powershell/scripting/install/installing-powershell-on-linux?view=powershell-7.2#ubuntu-2004)

Ubuntu Install Script

```bash
# Update the list of packages
sudo apt-get update
# Install pre-requisite packages.
sudo apt-get install -y wget apt-transport-https software-properties-common
# Download the Microsoft repository GPG keys
wget -q "https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb"
# Register the Microsoft repository GPG keys
sudo dpkg -i packages-microsoft-prod.deb
# Update the list of packages after we added packages.microsoft.com
sudo apt-get update
# Install PowerShell
sudo apt-get install -y powershell
```

Debian 11 Install Script

```bash
# Install system components
sudo apt update  && sudo apt install -y curl gnupg apt-transport-https

# Import the public repository GPG keys
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -

# Register the Microsoft Product feed
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-debian-bullseye-prod bullseye main" > /etc/apt/sources.list.d/microsoft.list'

# Install PowerShell
sudo apt update && sudo apt install -y powershell
```



Run and Verify

```bash
PWSH
```

```powershell
$PSVersionTable
```



![powershell-core-3](/assets/images/posts/powershell-core-3.png)



## Help

To access help by using the command below or `help`.

```powershell
Get-Help
```

To update your offline help files, use the update command.

```powershell
Update-Help
```

Use the online help, through a browser

```powershell
Get-Help -Name Get-Cotent -Online
```

Help has different levels of detail, starting from the basic to full.

```powershell
Get-Help -Name Get-Cotent

Get-Help -Name Get-Cotent -Detailed

Get-Help -Name Get-Cotent -Full

Get-Help -Name Get-Cotent -Examples
```





## Commands

The help documentation is always a good place to start when learning what a command does.

```powershell
Get-Help Get-Command
```

List all commands available

```powershell
Get-Command
```

Get all commands that start with the verb "Get".

```powershell
Get-Command -Verb Get
```

![powershell-core-4](/assets/images/posts/powershell-core-4.png)

Get all commands that contain the noun "Module", this can also be wrapped with wildcards to provide more results.

```powershell
Get-Command -Noun Module
```

![powershell-core-5](/assets/images/posts/powershell-core-5.png)

Get commands with a specific parameter, such as "ComputerName".

```powershell
Get-Command -ParameterName ComputerName
```

![powershell-core-6](/assets/images/posts/powershell-core-6.png)

Get all the commands contained within a specific module, in the example below I use the "PackageManagement" module.

```powershell
Get-Command -Module PackageManagement
```

![powershell-core-7](/assets/images/posts/powershell-core-7.png)



## Alias

To list all configured alias, use the following command;

```powershell
Get-Alias
```

If you wanted to know a specific alias, just append that to the end

```powershell
Get-Alias -Name cls
```

![powershell-core-8](/assets/images/posts/powershell-core-8.png)



## Pipeline

The pipeline allows the administrator to stitch one command to another, passing the object through, for example.

```powershell
Get-Service -Name "BITS" | Start-Service
```





## Objects

* **Methods** = Actions that an object can take.
* **Properties** = An attribute of an object.



To see all the available methods and properties on an object, use `Get-Member`.

```powershell
Get-Date | Get-Member
```

![powershell-core-9](/assets/images/posts/powershell-core-9.png)



PowerShell hides some properties, these can all be shown by using the `Select-Object` command.

```powershell
Get-Date | Select-Object *
```

![powershell-core-10](/assets/images/posts/powershell-core-10.png)



## Modules

To find all the currently imported modules

```powershell
Get-Module
```

The above command does not show all available modules, to list all available modules use the following command:

```powershell
Get-Module -ListAvailable
```

![powershell-core-11](/assets/images/posts/powershell-core-11.png)

To list the available commands within a module use:

```powershell
Get-Command -Module PackageManagement
```

![powershell-core-12](/assets/images/posts/powershell-core-12.png)

If you wish to remove a module from current PowerShell session, you can use the command:

```powershell
Remove-Module -Name PackageManagement
```

Modules are stored in the Module Path

```powershell
$env:PSModulePath
```

To import a module

```powershell
Import-Module -Name PackageManagement
```

To import a module from a different location

```powershell
Import-Module -Name /home/user/Downloads/module
```

### PowerShell Gallery

Additional modules can be found on [PowerShell Gallery](https://www.powershellgallery.com/), the web interface is easy to use.

To find modules via PowerShell use

```powershell
Find-Module
```

Most modules are designed for Windows PowerShell, but we can filter by tag for PowerShell Core

```powershell
Find-Module -Tag 'PSEdition_Core'
```

To install a module either use a pipe or install command

```powershell
Find-Module -Name AdminToolbox.ActiveDirectory | Install-Module
```

```powershell
Install-Module -Name AdminToolbox.ActiveDirectory
```

![powershell-core-13](/assets/images/posts/powershell-core-13.png)

Its important to keep modules up-to-date, review your versions

```powershell
Get-Module -Name AdminToolbox.Remoting -ListAvailable

Find-Module -Name AdminToolbox.Remoting
```

Update by using the command

```powershell
Update-Module -Name AdminToolbox.Remoting
```



To uninstall a module completely

```powershell
Uninstall-Module -Name AdminToolbox.ActiveDirectory
```





## Functions

Are blocks of code that can be reused, if you PowerShell scripts  contain repeated code, this is a good opportunity to utilise a function.

Functions should be defined before they are needed, at the top of the script.

When naming a function always try to use the PowerShell verb noun convention.

[Parameters](https://docs.microsoft.com/en-us/powershell/scripting/developer/cmdlet/cmdlet-parameters?view=powershell-7.2) provide the mechanism that allows a cmdlet to accept input

```powershell
function Test-ServiceStarted {
    param(
        [Parameter()]
        [string]$Name
    )
    
    if ((Get-Service -Name $Name).Status -eq 'Running'){
        $True
    } else {
        $False
    }

}

Test-ServiceStarted -Name  wuauserv
```



## Remote Resource Management

Any Windows Server after 2012 R2 will have [PSRemoting](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/enable-psremoting?view=powershell-7.2) enabled by default, but there are additional configuration required such as; Firewall exeception and the Service running.

To enable use the command

```powershell
Enable-PSRemoting
```

Create a PowerShell Temporary session

```powershell
$credential = Get-Credential

Invoke-Command -ComputerName 192.168.100.169 -Credential $credential -ScriptBlock { hostname }
```

Create a PowerShell session

```powershell
$credential = Get-Credential

Enter-PSSession -ComputerName 192.168.100.169 -Credential $credential
```



### Remoting from Linux to Windows

[SSH](https://docs.microsoft.com/en-us/powershell/scripting/learn/remoting/ssh-remoting-in-powershell-core?view=powershell-7.2) is used to connect to and from Linux systems.

1. [Install OpenSSH for Windows](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse?tabs=powershell)
2. [Configure Remoting SSH on Windows](https://docs.microsoft.com/en-us/powershell/scripting/learn/remoting/ssh-remoting-in-powershell-core?view=powershell-7.2)



Install OpenSSH server

```powershell
Get-WindowsCapability -Online | Where-Object Name -Like 'OpenSSH.Server' | Add-WindowsCapability -Online
```

Configure service

```powershell
Start-Service sshd

Set-Service -Name sshd -StartupType 'Automatic'
```



Edit file `C:\ProgramData\ssh\sshd_config`, adding the following Subsystem

```
Subsystem powershell c:/progra~1/powershell/7/pwsh.exe -sshs -NoLogo
```

Ensure `PasswordAuthentication` is configured to `yes`.

Restart the `sshd` service

```powershell
Restart-Service sshd
```





























