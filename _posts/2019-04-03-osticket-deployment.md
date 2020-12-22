---
title:  "osTicket Microsoft Server 2016"
date:   2019-04-03 16:10:44 +0000
categories: server osticket
---

Deploying osTicket on a Microsoft Server 2016 Virtual Machine on top of a Microsoft Hyper-V cluster.

## Virtual Machine Creation
I have created a highly available Generation 2 Virtual Machine called osTicket, giving it 8192MB of RAM, 4 vCPU, added it to the Virtual Switch and given it a 512GB Hard Disk.

## Installing Microsoft Server 2016
Standard Desktop Experience installation of Microsoft Server 2016.

Configuration of the operating system:

1. Local Administrator Account Set
1. Domain Joined
1. Hostname: osTicket
1. IP Address Information
	2. IP: xxx.xxx.xxx.xxx
	2. Netmask: xxx.xxx.xxx.xxx
	2. Gateway: xxx.xxx.xxx.xxx
	2. DNS: xxx.xxx.xxx.xxx xxx.xxx.xxx.xxx

## Prep
I have downloaded PHP 5.6, MariaDB 10.3.13 and osTicket 1.10.5 and placed them onto the osTicket server.

## Add Roles and Features
osTicket will require a web server so I will be installing the Web Server (IIS) role with management tools.
I will continue with the defaults for Web Server Role (IIS), Role Services as there is no mention of additional requires from osTicket, if I need to bolt on anything I can do that at a later point.

## Moving files
Move the contents of the osTicket upload folder into the inetpub > wwwroot folder.

## Installing PHP 5.6
From IIS Manager, I installed the "Web Platform Components" when the installation has completed I searched for "PHP 5.6" and installed PHP 5.6.31 with all the recommened prerequisites (all successfully installed except PHP Manager for IIS - I'll take a look to why this failed later).

You may need to rename the php.ini-production to just php.ini, edit the file and remove the semi-colon from the extension_dir

```
; Directory in which the loadable extensions (modules) reside.
; http://php.net/extension-dir
extension_dir = "./"
; On windows:
extension_dir = "ext"
```

Save and close the file and restart the IIS server.

_Notes_

You may wish to turn expose_php = off this just prevents the webserver from sending back the X-Powered-By header exposing your PHP version.

## Configuring PHP extensions

### Intl Extension
Edit the php.ini file found in your PHP installation folder (C:\Program Files (x86)\PHP\v5.6)
Remove the semi-colons and set your locale

```
[intl]
intl.default_locale = GBR
; This directive allows you to produce PHP errors when some error
; happens within intl functions. The value is the level of the error produced.
; Default is 0, which does not produce any errors.
intl.error_level = E_WARNING
intl.use_exceptions = 0
```

Remove the semi-colon from the Windows Extensions for extension=php_intl.dll, you may need to add this value instead then save and close the file and restart the server.

### APCu Extension
_Unable to get working on IIS 10_

### Zend OPcache Extension
_Unable to get working on IIS 10_

## Installing Maria DB
Following through the wizard I will be using the 'custom Setup' defaults.
Set a secure root password, click next I will continue with the default values for service name and networking port (TCP 3306).

### Fulfil the DB requirements
osTicket requires one MySQL database with a valid user, password and full privileges.

MariaDB comes with HeidiSQL which is a GUI DB management tool, which is useful if you do not know the commands.

Start by creating a new database calling it 'osticket' will a collation of 'utf8_unicode_ci'.

Then I will create a SQL user called 'osticketadmin' and grant it full access to the 'osticket' database.

Close the connection and we should be good with the requirements for database.

## osTicket Configuration File
Rename the ost-sampleconfig.php to ost-config.php and grant 'everyone' full permissions, continue with the wizard.

Enter the osTicket Basic Installation details
1. Helpdesk name
1. Default Email
1. Admin User Details
1. Database Settings
	1. MySQL Table Prefix (default of ost_)
	1. MySQL hostname (default of localhost)
	1. MySQL Database (osticket - the DB we created earlier)
	1. MySQL Username (osticketadmin - the user we created earlier)
	1. MySQL Password (password for the osticketadmin account)

Once you have successfully completed the configuration stage you can remove the 'everyone' permission or run the PowerShell command

```
icacls C:\inetpub\wwwroot\include\ost-config.php /reset
```

You'll also need to make the file 'Read-Only' otherwise you will be prompt in the webpanel for 'Please change permission of config file (ost-config.php) to remove write access. e.g chmod 644 ost-config.php' as a warning banner at the top of the screen.

Remove the setup directory as it is no longer required and is considered a security risk, you can nagivate to that directory and delete or remove using PowerShell

```
remove-item C:\inetpub\wwwroot\setup
```

This ends the installation process of osTicket, now you must finish your customisations within the osTicket webpanel.

