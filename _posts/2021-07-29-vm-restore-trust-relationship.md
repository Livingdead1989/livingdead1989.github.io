---
title: "VM Restore Trust Relationship"
date: 2021-07-29 15:30:00 +0000
categories: networking
tags: virtual machine vm restore trust relationship domain adcs certificate
description: >- # this means to ignore newlines until "baseurl:"
  A short article regarding problems with trust relationships on a restored virtual machine and how I overcome this issue.
---

After restoring our Virtual Machine from a previous date, I noticed that I could not log into the domain account due to the following error:

"The trust relationship between this workstation and the primary domain failed."

![trust-relationship-error](/assets/images/posts/trust-relationship-error.png)

After some research I found that the domain machine password is changed every 90 days and because this Virtual machine was a Domain CA, I was stuck being unable to leave and rejoin the domain.

I found a solution that involved resetting the computer machine password, to do this I needed to log into the Virtual machine using the local administrator account and using PowerShell issue a `Reset-ComputerMachinePassword` command.

Some more information is available on the [doc.microsoft.com website](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/reset-computermachinepassword?view=powershell-5.1) as the built-in help didn't contain much.

![help-reset-computermachinepasword](/assets/images/posts/help-reset-computermachinepasword.png)

Microsoft state that the **Reset-ComputerMachinePassword** cmdlet changes the computer account password that the computers use to authenticate to the domain controllers in the domain. You can use it to reset the password of the local computer. The command runs with the credentials of the current user.

```powershell
PS C:\> Reset-ComputerMachinePassword
```

After executing the above command I was able to log back in using the domain account.

![domain-login](/assets/images/posts/domain-login.png)
