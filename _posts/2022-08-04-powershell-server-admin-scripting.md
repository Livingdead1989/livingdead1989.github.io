---
title: "PowerShell Server Admin Scripting"
date: 2022-08-04 21:20:00 +0000
categories: powershell
tags: powershell script server admin
description: >- # this means to ignore newlines until "baseurl:"
  Beginner course on how to use PowerShell scripting for server administration.
---

## PowerShell

Microsoft PowerShell is a task automation solution made up of a command-line shell, a scripting language, and a configuration management framework. PowerShell Core brings cross-platform compatibility.

The extensible nature of PowerShell has enabled an ecosystem of PowerShell modules to deploy and manage almost any technology, for example:

* [AWS](https://aws.amazon.com/powershell/)
* [VMware](https://core.vmware.com/vmware-powercli)
* [Azure](https://docs.microsoft.com/en-us/powershell/azure)
* [SQL](https://docs.microsoft.com/en-us/sql/powershell/sql-server-powershell)
* [Exchange](https://docs.microsoft.com/en-us/powershell/exchange/exchange-management-shell)

Additional resources include [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/), [Discover PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/discover-powershell?view=powershell-7.2) and [Awesome PowerShell List](https://github.com/janikvonrotz/awesome-powershell).

The following are my notes while taking part in LinkedIn Learning course [PowerShell: Scripting for Server Administration](https://www.linkedin.com/learning/powershell-scripting-for-server-administration).



## Execution Policy

1. **Restricted** - No scripts will run
2. **AllSigned** - All scripts need to be digitally signed
3. **RemoteSigned** - Local scripts will run, but remote scripts will need to be digitally signed
4. **Unrestricted** - All scripts will run with a warning
5. **Bypass** - All scripts will run without warning
6. **Undefined**  - No policy has been set.

Scope from highest precedence

1. **Process** including a PowerShell session
2. Specific users using **CurrentUser** 
3. **LocalMachine** including all users

Two scopes that can be configured via Group Policy are

* **MachinePolicy**
* **UserPolicy**



### View 

```powershell
Get-ExecutionPolicy

Get-ExecutionPolicy -List
```

![powershell-scripting-1](/assets/images/posts/powershell-scripting-1.png)

### Set

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy AllSigned
```



## PowerShell Tolerance

PowerShell is mostly not case sensitive, although PowerShell Core may require case sensitivity for Cross-Platform support.

PowerShelll Core can use both backslash and forward slash interchangeably.

PowerShell scripts, new lines and indentations are often optional.



## PowerShell Style Guide

[PowerShell style guide](https://github.com/PoshCode/PowerShellPracticeAndStyle/blob/master/Style-Guide/Introduction.md) provides an agreed style guide for how scripts show look to make them more user friendly and more readable in the community.

Some basics include:

* If the script uses modules that are not loaded on every computer by default, then start the script by importing the appropriate modules.
* Do not create alias, instead use their real names.
* Functions should be defined before they are needed.
* Use a line break between functions and loops to aid with readability.
* Use [PascalCase](https://www.theserverside.com/definition/Pascal-case) - each word begins with a capital letter.
  * Similar to CamelCase, but the first word must be a capital.
* Comment your scripts. Using a hash, followed by a space `# `.



## PowerShell ISE Add-ons

Although there is a strong movement to using other applications such as [Visual Studio Code](https://code.visualstudio.com/?wt.mc_id=DX_841432), PowerShell ISE can provide all the functionality and add-ons.

From the Add-ons drop down menu select "Open Add-on Tools Website", which will open a TechNet page. On the page you'll find a list of community add-ons and their links.

![powershell-scripting-2](/assets/images/posts/powershell-scripting-2.png)



## Working with External Files

### Working with Text Files

Send output to:

* The screen - `Out-Host`
* Down the pipeline - `|` (pipe)
* Save for later:
  * To a variable - `$variable`
  * To a file - `Out-File`
    * `-NoClobber` do not override the file.
    * `-Append` adds to the end of the file.
    * `Add-Content` can replace `Out-File -Append`
    * `Set-Content` can replace `Out-File`, which will replace content.

`Test-Path` is used to test if a file or folder exists.

```powershell
if (-not (Test-Path -Path C:\Scripts )) {
    <# Action to perform if the condition is true #>
    Write-Host "Path does not exist."
} else {
    <# Action when all if and elseif conditions are false #>
    Write-Host "Path exists."
}
```



Access text files by using `Get-Content`, each line will be viewed as a string ready for processing.

We can use a text file containing usernames to create new local accounts.

*Note about passwords - a secure string is expected, not plain text*

```powershell
$SecurePassword = "Yellow3!n" | ConvertTo-SecureString -AsPlainText -Force

Get-Content C:\Scripts\Input\Users.txt | New-LocalUser -Password $SecurePassword
```

Although this will create accounts, there is minimal information, which is where use of a CSV file can expand our capabilities.



### Working with CSV files

Normally commas are used delimit values, but depending on the region of the system, the list separator may be a pipeline or other value. This can be checked via Control Panel.

It is important that all values are specificed within the CSV, even if they are empty, these can be represented with an empty double quotation `""` or two commas `,,`.

The example below will export the local users to a CSV file

```powershell
Get-LocalUser | Select FullName, Name | Export-Csv -path C:\Scripts\Output\LocalUsers.csv
```

This can then be imported onto another machine

*Note, other methods of handling secure passwords will be discussed later.*

```powershell
$SecurePassword = "Yellow3!n" | ConvertTo-SecureString -AsPlainText -Force

Import-CSV -Path C:\Scripts\Input\LocalUsers.csv | New-LocalUser -Password $SecurePassword
```



### Working with XML files

XML files provide:

* Number of entries per property example, a user with multiple group memberships
* Objects with multiple properties, can be a value for a property (CliXML)

```powershell
Get-Service -Name BITS | Export-CliXML -Path C:\Scripts\Output\BITSService.clixml
```

*Note: the file extension can be either clixml or xml*



## Building Blocks of PowerShell Scripts

### Modules

Look for commands using the `Get-Command` cmdlet, for example;

```powershell
Get-Command *User
```

![powershell-scripting-3](/assets/images/posts/powershell-scripting-3.png)

The list above are the available module commands on the server, additional commands can be added by adding the appropriate role tools.

Its advisable to save time, and not recreate functions or scripts if they are already available. [PowerShell Gallery](https://www.powershellgallery.com/) is a good place to search for existing functions and scripts created by the community

Some examples include:

* [PSTeams](https://www.powershellgallery.com/packages/PSTeams/2.1.2)
* [DellBIOSProvider](https://www.powershellgallery.com/packages/DellBIOSProvider/2.6.0)
* Az - Microsoft Azure Modules
* Dsc - Desired State Configuration Modules



### Functions

Are blocks of code that can be reused, if you PowerShell scripts contain repeated code, this is a good opportunity to utilise a function.

Functions should be defined before they are needed, at the top of the script.

When naming a function always try to use the PowerShell verb noun convention.

[Parameters](https://docs.microsoft.com/en-us/powershell/scripting/developer/cmdlet/cmdlet-parameters?view=powershell-7.2) provide the mechanism that allows a cmdlet to accept input for example `Export-CompanyDomainUsers -OUName Sales`

Variables can be useful for storing complex strings, which can contain parameters.

```powershell
Import-Module ActiveDirectory 

Function Export-CompanyDomainUsers {
    Param (
        [string] $OUName)
    
    $SearchBase = "OU="+$OUName+",DC=demo,DC=lab"
    $ExportName = "C:\Script\Output\"+$OUName+".csv"
     
    Get-ADUser -Filter * -SearchBase $SearchBase | 
    Select-Object SamAccountName,Enabled,GivenName,Surname,EmailAddress |
    Export-CSV -Path $ExportName  
}

Export-CompanyDomainUsers -OUName Sales
Export-CompanyDomainUsers -OUName Marketing
Export-CompanyDomainUsers -OUName Finance
```





## Administer Servers

### PowerShell Remoting

The `Get-Command` cmdlet can be used to query based upon parameter name, which can be powerful when searching for commands.

```powershell
Get-Command -ParameterName ComputerName
```

[PowerShell remoting](https://docs.microsoft.com/en-us/powershell/scripting/learn/ps101/08-powershell-remoting?view=powershell-7.2) must be enabled on the remote computer.

```powershell
Enable-PSRemoting
```

For an interactive **One-To-One** remote session use `Enter-PSSession`;

```powershell
Enter-PSSession -ComputerName dc01 -Credential $Cred
```

To perform tasks on **One-To-Many** computers the `Invoke-Command` cmdlet can be used

```powershell
Invoke-Command -ComputerName dc01, sql02 -ScriptBlock {Get-Service -Name W32time} -Credential $Cred
```



### WMI

[Windows Management Instrumentation](https://docs.microsoft.com/en-us/windows/win32/wmisdk/about-wmi) (WMI) is Microsoft's implementation of Web-Based Enterprise Management (WBEM), which is an industry initiative to develop a standard accessing management information in an enterprise environment.

WMI is hierarchically organised and broken down into 

1. **Namespaces**
2. A Namespace is further broken down into **Classes**.
3. An **Instance** is an occurrence of the class on the system.

![powershell-scripting-4](/assets/images/posts/powershell-scripting-4.png)

A WMI instance is an object, with properties and methods.

There are many tools to help explore WMI, such as [WMI Explorer](https://www.bleepingcomputer.com/download/wmi-explorer/).

![powershell-scripting-5](/assets/images/posts/powershell-scripting-5.png)

To list all WMI objects within PowerShell use the following command

```powershell
Get-WMIObject -List
```

`ROOT\CIMv2` holds the vast majority of operating system WMI instances.

WMI can be utilised within a PowerShell script such as below using the TimeZone.

![powershell-scripting-6](/assets/images/posts/powershell-scripting-6.png)



### CIM

[Common Information Model](https://www.dmtf.org/standards/cim) (CIM) is an open standard model for storing system information and is what WMI is based upon and the format used.

Microsoft previous used a proprietary method, but this may creating PowerShell Core difficult. [PowerShell Core](https://github.com/powershell/powershell) is a cross-platform implementation of PowerShell.

An example of using CIM below is listing the operating system.

```powershell
(Get-CimInstance -ClassName Win32_OperatingSystem).Caption
```

![powershell-scripting-7](/assets/images/posts/powershell-scripting-7.png)

The WMI equivalent command is;

```powershell
(Get-WmiObject -ClassName Win32_OperatingSystem).Caption
```



[CIM Session](https://docs.microsoft.com/en-us/powershell/module/cimcmdlets/new-cimsession?view=powershell-7.2) - `New-CimSession` can connect to one or more computers at the same time, for a session, whereas WMI cmdlets can only connect to a single computer and per command.

