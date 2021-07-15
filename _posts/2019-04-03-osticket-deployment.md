---
title:  "osTicket Deployment"
date:   2019-04-03 16:10:44 +0000
categories: server
tags: osticket ticketing helpdesk
description: >- # this means to ignore newlines until "baseurl:"
  This article is a compressed series regarding deploying osTicket to a Microsoft Server, adding plugins, customisation and troubleshooting.
---

**This series of articles has been compressed into a single post.**

1. [Microsoft Server 2016](#microsoft-server-2016)
1. [osTicket Plugins core](#osticket-plugins-core)
1. [osTicket customisation](#osticket-customisation)
1. [osTicket Plugins community](#osticket-plugins-community)
1. [Troubleshooting](#troubleshooting)

---

## Microsoft Server 2016

Deploying osTicket on a Microsoft Server 2016 Virtual Machine on top of a Microsoft Hyper-V cluster.

### Virtual Machine Creation
I have created a highly available Generation 2 Virtual Machine called osTicket, giving it 8192MB of RAM, 4 vCPU, added it to the Virtual Switch and given it a 512GB Hard Disk.

### Installing Microsoft Server 2016
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

### Prep
I have downloaded PHP 5.6, MariaDB 10.3.13 and osTicket 1.10.5 and placed them onto the osTicket server.

### Add Roles and Features
osTicket will require a web server so I will be installing the Web Server (IIS) role with management tools.
I will continue with the defaults for Web Server Role (IIS), Role Services as there is no mention of additional requires from osTicket, if I need to bolt on anything I can do that at a later point.

### Moving files
Move the contents of the osTicket upload folder into the inetpub > wwwroot folder.

### Installing PHP 5.6
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

### Configuring PHP extensions

#### Intl Extension
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

#### APCu Extension
_Unable to get working on IIS 10_

#### Zend OPcache Extension
_Unable to get working on IIS 10_

### Installing Maria DB
Following through the wizard I will be using the 'custom Setup' defaults.
Set a secure root password, click next I will continue with the default values for service name and networking port (TCP 3306).

#### Fulfil the DB requirements
osTicket requires one MySQL database with a valid user, password and full privileges.

MariaDB comes with HeidiSQL which is a GUI DB management tool, which is useful if you do not know the commands.

Start by creating a new database calling it 'osticket' will a collation of 'utf8_unicode_ci'.

Then I will create a SQL user called 'osticketadmin' and grant it full access to the 'osticket' database.

Close the connection and we should be good with the requirements for database.

### osTicket Configuration File
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



---



## osTicket Plugins core

On the osTicket download there are options to add plugins, I will be adding the following plugins: 

1. HTTP Pass-Through (auth-passthru.phar), 
1. LDAP and Active Directory (auth-ldap.phar), 
1. Attachments on the Filesystem (storage-fs.phar)

Drop the '.phar' files into the plugins directory (C:\inetpub\wwwroot\include\plugins)
Goto the webpanel, login as a agent and then navigate to Manage > Plugins, click the 'Add New Plugin' button and install all three newly added plugins.

![Currently Installed Plugins](/assets/images/posts/installed_plugins.jpg "Currently Installed Plugins")

### Attachments on the Filesystem

We will be creating a new folder in the osticket root called 'Attachments' and making sure that the webserver can write to this newly created folder by changing the security properties to allow SERVER\Users access to modify the attachments folder.

![Attachments Folder Permissions](/assets/images/posts/attachments_permissions.jpg "Attachments Folder Permissions")

Once we have the folder we can add the path into the Base folder for attachment files of Attachments and apply, you should see a green success message.

![Attachments Folder Path](/assets/images/posts/attachments_folder_path.jpg "Attachments Folder Path")

Finally we need to change the 'Store Attachments' to 'FileSystem' this can be found via Admin Panel > Settings > System, under the Attachments Storage and Settings tab.

### LDAP and Active Directory

We will be configuring for Microsoft Active Directory and not LDAP. 
First we need to enable the 'php-ldap' extension:

1. Check your PHP ext folder for the file 'php-ldap.dll'
1. Edit your php.ini file
1. Append 'extension=php-ldap.dll' within your 'Extension List' section
1. Save the file
1. Restart IIS

Active Directory configuration requires your domain name and DNS servers (optional), save the configuration and enable the plugin.

1. Search User: Active Directory Username
1. Search User Password: ****
1. Search Base: OU=USERS,DC=domain,DC=internal (example)
1. LDAP Schema: Microsoft Active Directory
1. Authentication Modes: checked Staff and Client

Save and you should recieve a configuration updated successfully message.

#### IIS Server Role

You'll need to add the 'Windows Authentication' server role from within Server Manager.

![Server IIS Role Windows Authentication](/assets/images/posts/windows_authentication_role.jpg "Server IIS Role Windows Authentication")

Then within IIS Manager, your osticket site disable all other authentications except 'Windows Authentication', I have only enabled NTLM providers once this has been applied this will allow SSO (Single Sign-On) using Windows authentication.

![IIS Manager Site Authentication](/assets/images/posts/iis_authentications.jpg "IIS Manager Site Authentication")

### HTTP Pass-Through

Enable staff and client authentication check boxes, save the configuration then enable the plugin.

Users from Active Directory will now automatically sign in and have their accounts created/registered in osTicket.

**Edit: After enabling the custom error messages I had issues with the SSO feature, I have had to leave these as default for now**


#### Notes

I needed to make sure that my osticket URL was set to Safe Site (2) in my zone assignments GPO and Google Chrome group policy had the URL added for 'authentication server whitelist' and 'kerberos delegration server whitelist'. Firefox required the preference item of 'network.automatic-ntlm-auth.trusted-uris' to have the server address as a value.

Once I had all configured the pass-through and single sign-on worked perfectly in all browsers (tested in: Internet Explorer, Google Chrome and Mozilla Firefox).


### HTTPS support

Its important to secure our connections so we will be adding HTTPS support using a self signed certificate.

From the IIS Manager select the server (OSTICKET) then select 'Server Certificates'.

![IIS Manager Server Certificates](/assets/images/posts/iis_server_certificates.jpg "IIS Manager Server Certificates")

From the 'Server Certificates' we have actions for creating a self-signed certificate.

![Server Certificates Create](/assets/images/posts/action_create_cert.jpg "Server Certificates Create")

Create a new self-signed certificate, give it a name I have called mine 'osticket'.
Once created right click the certificate and 'Enable Automatic Rebind of Renewed Certificate' for when the certificate expires then export the certificate so we can add this to our client machines.

Finally goto our website, 'Default Web Site' in my case right click and 'Edit Bindings'. Here we will add a new binding for HTTPS using the newly created self-signed certificate.

![IIS HTTPS Binding](/assets/images/posts/https_binding.jpg "IIS HTTPS Binding")

From here can we visit our HTTPS osTicket website but we must accept a warning about the self-signed certificate. 
You'll need to push this certificate to your client machines or use a trusted certificate.

### Domain Signed Certificate

From IIS Manager go into Server Certificates and select 'Create Domain Certificate' from the actions pane.

Fill all of the information in for Common name (enter site URL), Organization, OU, City, State, Country and continue.
Select your Domain Certificate Authority normally your PKI or PDC then provide a friendly name.

Complete the registeration and your new certificate will be created.


### Force HTTPS using URL Rewrite

We will now create a URL rewrite rule to redirect any http traffic to https, edit your web.config file found with the inetpub>wwwroot folder and add this rule within the rules section.

```
<rule name="HTTP/S to HTTPS Redirect" enabled="true" stopProcessing="true">
        <match url="(.*)" />
        <conditions logicalGrouping="MatchAny">
          <add input="{SERVER_PORT_SECURE}" pattern="^0$" />
        </conditions>
        <action type="Redirect" url="https://{HTTP_HOST}{REQUEST_URI}" redirectType="Permanent" />
</rule>
```

Restart the IIS service and review the newly added rule via URL Rewrite

![URL Rewrite HTTPS rule](/assets/images/posts/https_rule.jpg "URL Rewrite HTTPS rule")

Test the rule by typing in the http address and watch the redirect into https.




---



## osTicket customisation

**Contents**

1. [Language Packs](#language-packs)
1. [Custom Error Pages](#custom-error-pages)
1. [Office 365 NoReply Email Settings](#office-365-noreply-email-settings)
1. [Admin Login Button](#admin-login-button)
1. [Custom Graphic](#custom-graphic)
1. [Date and Time Fix](#date-and-time-fix)
1. [Database Search Min-Characters](#database-search-min-characters)
1. [HTTP redirect](#http-redirect)

### Language Packs

Additional language packs are available from [osticket.com](https://osticket.com), to install them copy the .phar file into the osticket directory (wwwroot/include/i18n/).

Then from the admin panel goto Settings > System and change the primary or secondary languages to the newly installed language pack.

### Custom Error Pages

The stock error pages are ugly, so lets change them to something a little more custom.
Firstly we'll need a custom error page, I have created a simple page for demostration purposes the code is a little large due to a BASE64 image (embedded image) of osTicket's logo.

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>osTicket Error</title>
    <link href="https://fonts.googleapis.com/css?family=Archivo+Black|Roboto" rel="stylesheet">
    <style type="text/css">
    html {
      line-height: 1.15; /* 1 */
      -webkit-text-size-adjust: 100%; /* 2 */
    }
    body{
      margin: 0;
      padding: 0;
    }
    .container{
      text-align: center;
      margin: 20px auto;
      font-family: 'Roboto', sans-serif;
    }
    h1{
      font-family: 'Archivo Black', sans-serif;
      font-size: 2em;
      margin: 0.67em 0;
    }
    img {
      border-style: none;
    }
    a{
      color: #F16B32;
      text-decoration: none;
    }
    a:hover, a:focus, a:active{
      color: #C9470F;
      text-decoration: underline;
    }
    </style>
  </head>
  <body>
    <div class="container">
      <img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA0LTE1VDExOjA1OjMwKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNC0xNVQxMToxMToxMiswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wNC0xNVQxMToxMToxMiswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphNzllZDYyNS1jMDlk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">
      <h1>OOPS!</h1>
      <p>Seems you have an error, keep calm and return home.</p>
      <br><br>
      <p><a href="../">osTicket Home</a></p>
    </div>
  </body>
</html>
```

Now lets set this page to be the new error page, starting in IIS Manager goto your osticket site then open 'Error Pages'.
We will be changing the path for each status code so we still have the correct errors logged and displayed to the user as they can be helpful.

Change error page option to 'Execute a URL on this site' and select the relative path.

![Custom Error Pages](/assets/images/posts/error_pages.jpg "Custom Error Pages")

Next from the Error Pages pane select 'Edit Feature Settings' and enable 'Custom error pages'.

This will complete the process, you are probably best to create a set of error pages unique to the reported status code (401, 403, 404, 405, 406, 412, 500, 501, 502) but they can be pretty and less intimidating for the end user.

**Edit: After enabling the custom error messages I had issues with the SSO feature, I have had to leave these as default for now**

### Office 365 NoReply Email Settings

You'll want to have a noreply email address for sending confirmation emails about tickets to clients, you'll need an email pre-configured, once you have this you can populate the settings required to get the account to work.

Login to the Admin panel and navigate to Emails > Emails then create a new email

Fill in the required details of:

1. Email Address: noReply@yourdomain.com
1. Email Name: NoReply
1. Auto-Response: Disabled
1. Username: noReply@yourdomain.com
1. Password: *
1. Fetching Email via IMAP or POP: Disabled
1. Sending Email via SMTP: Enabled
1. Hostname: smtp.office365.com
1. Port Number: 587
1. Authentication Required: Yes
1. Header Spoofing: Unchecked

Save this configuration then goto the 'Diagnostic' page, select noReply@yourdomain.com from the 'FROM' list, provide an email to send to with a message and click 'Send Message' this will test the account.

### Admin Login Button

My setup is using SSO Active Directory with HTTP pass-through so agents did not have the login prompt with the admin login link so I wanted to include a button for them to press to easily get to the agent panel.

I noticed to hijack the powered by osTicket link in the footer. You can find this file in wwwroot > include > client its called 'footer.inc.php'. - I simply changed the anchor link value.

```
<a id="poweredBy" href="../scp/login.php" target="_blank"><?php echo __('Helpdesk software - powered by osTicket'); ?></a>
```


### Custom Graphic

You can add customised graphics via the admin panel, settings > company.

I wanted to keep the look and feel of the stock osTicket so I found the original files and modified them to fit the company branding

the original ost-logo.png (agent logo) is located `C:\inetpub\wwwroot\scp\images\ost-logo.png` and the original print-logo.png (client logo) is located `C:\inetpub\wwwroot\include\fpdf\print-logo.png` from these you can copy the file.

Dimensions of ost-logo.png are 395px x 132px

Dimensions of the print-logo.png are 817px x 170px

Here is a sample of my modified agent logo

![Agent Logo](/assets/images/posts/osticket_ost-logo.png "Agent Logo")

Here is a sample of my modified client logo

![Client Logo](/assets/images/posts/osticket_logo.png "Client Logo")


### Date and Time Fix

Once you're at the stage of configuring custom forms, you may wish to use the Date and Time input, I found that the date day was duplicated, for example 1616/Apr/19 was being displayed instead of 16/Apr/19.

To fix this problem I needed to configure an advanced 'Date and Time Format' this can be found via the admin panel under Settings > System.

I used the following configuration:

1. Default Locale: English (United Kingdom)
2. Default Time Zone: Europe / London (Auto Detected)
3. Date and Time Format: Advanced
  4. Time Format: HH:mm i
  5. Date Format: d/M/y
  6. Date and Time Format: d/M/y HH:mm i
  7. Day, Date and Time Format: E, d MMM y HH:mm i

This fixed the duplication of the day information.


### Database Search Min-Characters

I wanted to be able to quickly search for users when creating a ticket but found that by default it required a minimum of 4 characters before it would query the database, personally I would get happier with minimum length of 3 so the search would be performed on the 3rd character.

I found this article '[osTicket with MySQL – Search with 4 characters or less](https://www.netzmacher.ch/mysql/osticket-with-mysql-search-with-4-characters-or-less/)', they describe their problem and steps they took to resolve it.

Firstly query your SQL database for the `'ft_min_word_len'` variable, I personally have '[HeidiSQL](https://www.heidisql.com/)' installed on my osTicket server as part of the MariaDB installation.

We will be issuing the following command from the 'Query' tab.

```
SHOW VARIABLES LIKE 'ft_min_word_len';
```

The screenshot below shows the query being performed using HeidiSQL, as we can see the returned value is 4.

![Querying SQL for ft_min_word_len variable](/assets/images/posts/sql_minword_query.jpg "Querying SQL for ft_min_word_len variable")

Next we need to alter the SQL configuration file (my.ini) which can be found `C:\Program Files\MariaDB 10.3\data` on my installation.

Edit the my.ini file and under the [mysqld] section add the following, once added save the file and restart the server.

```
[mysqld]
ft_min_word_len=3
```

Once the server is back up and running we will need to rebuild the table indexes, my table is InnoDB so the repair is not required but if you need to you can be perform this by issuing the following command.

```
REPAIR TABLE osticket.ost__search QUICK
```

or we can use the GUI to perform this repair, the screenshot below shows the 'maintenance' window for ost_search table.

![HeidiSQL table maintenance window](/assets/images/posts/sql_maintenance.jpg "HeidiSQL table maintenance window")

Once compelete, we will be able to search with our new reduced minimum word requirement.

### HTTP Redirect

Forcing through HTTPS connection over HTTP using a URL Rewrite rule.

```
<rule name="HTTPS force" enabled="true" stopProcessing="true">
   <match url="(.*)" />
   <conditions>
     <add input="{HTTPS}" pattern="^OFF$" />
   </conditions>
   <action type="Redirect" url="https://{HTTP_HOST}{REQUEST_URI}" redirectType="Permanent" />
</rule>
```

In IIS Manager under the website in SSL Settings, you'll need to have Require SSL unchecked otherwise IIS will report a Forbidden error.




---



## osTicket Plugins community

I will be adding the following plugins: 

1. [Ticket Closer Plugin](https://github.com/clonemeagain/plugin-autocloser)
1. [Attachment Preview](https://github.com/clonemeagain/attachment_preview)


### Ticket Closer Plugin

Download master zip and extract into '\include\plugins\autocloser' then install the plugin by selecting 'Add New Plugin' from the Admin Panel > Manage > Plugins page, then select Install.

Now the plugin is installed we can enable it by selecting the plugin selecting the 'More' option and selecting 'Enable'.

For testing purposes I will be changing the option of 'Max Ticket age in days' to 1 and creating a canned response which gets sent to the client.

#### Creating a Canned Response

Make sure that canned responses are enabled via the Admin panel, navigate to Settings > Knowledgebase and enable 'Canned Responses'.

Now we have access to the canned responses we can create our auto closer reponse. From the agent panel goto the Knowledgebase tab and click 'Add New Reponse'.

![Auto Closer Canned Response](/assets/images/posts/auto_closer_canned_response.jpg "Auto Closer Canned Response")

Once you have your canned response configured go back to the auto closer plugin options, scroll down to 'Auto-Reply Canned Response' and select the newly created canned response from the drop down menu.


### Attachment Preview

Download master zip and extract into '\include\plugins\attachment_preview' then install the plugin by selecting 'Add New Plugin' from the Admin Panel > Manage > Plugins page, then select Install.

Now the plugin is installed we can click it for options, I will be unchecking 'Show IE upgrade link' but leaving everything else as its default value. Save the changes then Enable the plugin.

I created a sample ticket to test the plugin.

Plugin Disabled

![Attachment Preview Plugin Disabled](/assets/images/posts/attachment_preview_disabled.jpg "Attachment Preview Plugin Disabled")

Plugin Enabled

![Attachment Preview Plugin Enabled](/assets/images/posts/attachment_preview_enabled.jpg "Attachment Preview Plugin Enabled")

### Other Community Plugins

You may find this curated list useful: [Awesome osTicket](https://github.com/clonemeagain/awesome-osticket)

The osTicket plugin forums: [osTicket Forum - Plugins](https://forum.osticket.com/t/plugins)



---



## Troubleshooting

**Contents**

1. [Firefox Enterprise Certificates](#firefox-enterprise-certificates)
1. [NET::ERR_CERT_COMMON_NAME_INVALID](#neterr_cert_common_name_invalid)
1. [NET::ERR_CERT_WEAK_SIGNATURE_ALGORITHM](#neterr_cert_weak_signature_algorithm)
1. [IOException](#ioexception)
1. [STARTTLS Email Error](#starttls)

### Firefox Enterprise Certificates

Our SSL domain certificate may not be known by Firefox therefore warning the users about an unsecure website, this can be fixed by telling Firefox to trust enterprise certificates.

Open Firefox and in a new tab, type `about:config` in the address bar and press Enter/Return. Click the button promising to be careful. Next in the search box above the list, type `security.enterprise_roots.enabled` double-click the preference to switch the value from false to true.

Close Firefox and the next time you visit your osTicket helpdesk you'll have a green padlock (secure).

If you want to configure this for your enterprise deployment then you just need to add the pref into your `.cfg` configuration file

```
pref("security.enterprise_roots.enabled", true);
```

### NET::ERR_CERT_COMMON_NAME_INVALID

You may receive this security warning which means that the certificate is not containing the correct DNS entries for the site you are visiting.

In my situation I needed to create a certificate template and then create a new certificate request using the MMC (Microsoft Management Console) with the certificate snap-in.

#### Certificate Authority Template

On the certificate authority server I opened the certificate authority application (certsrv), right clicked the certificate templates folder in the navigation pane and selected manage.

Right click the Web Server template and duplicate, this will create a copy of which you can edit and rename.

![Duplicate Template](/assets/images/posts/duplicate_template.jpg "Duplicate Template")

While editing the new template you may wish to publish the certificate in Active Directory, increase the Compatibility settings (additional settings are based on the compatibility level) I am using a Windows Server 2016 authority with a Windows 10 / Windows Server 2016 recipient. You may also wish to have the CA certificate manager have to approve which is under the 'Issuance Requirements' tab and lastly you may wish to tweak the algorithm name and key size which is under the 'Cryptography tab'.

Lastly I also needed to tweak the security settings to allow authenticated users to enroll otherwise the certificate template was being listed as unavailable later.

#### Create Template Request

Back onto the osTicket server, open the MMC (Microsoft Management Console) and add the certificate snap-in for the local computer. Next right click the personal store and 'Request New Certificate', from the wizard window use the Active Directory Enrollment Policy and select the Web Server template (hopefully you renamed the template) you should have a warning message below the title asking for more details, this is good as we wish to input our own values.

Follow the wizard through and add your own common name in the subject name field and in the alternative name field add your DNS records, completing the wizard will create the request for the certificate and in my case add it to the pending area for approval.

![Completed Request](/assets/images/posts/pending_certificate.jpg "Completed Request")

Finally to create the certificate we need to approve it by going back onto the certificate authority and issuing the pending certificate.

![Issue Pending Certificate](/assets/images/posts/issue_pending_cert.jpg "Issue Pending Certificate")

Once the certificate has been created we will need to retrieve the certificate on our osTicket machine, this can be done via the MMC certificate snap-in by right clicking certificates (local computer) select all tasks and automatically enroll and retrieve certificates, this will pull down the newly created certificate.

#### Using the new certificate

To use the certificate in our osTicket deployment will need to swap the certificate over in IIS manager, right click our osTicket site and edit bindings and for the HTTPS binding change the certificate to the newly created version then restart the site.

### NET::ERR_CERT_WEAK_SIGNATURE_ALGORITHM

You may receive this security warning when using Google Chrome, this will be due to the certificate hash algorithm being SHA1. If you want to fix this problem you'll need to have your certificate authority issue a minimum of SHA2 this could mean you need to update your PKI which is recommeneded to test all systems for compatibility before migrating your PKI.

### IOException

`IOException: Unable to read resource content`, I had this problem being reported by the system and under greater investigation found that the 'File Attachment' plugin had files which did not have the correct security permissions.

I fixed this problem by blanket reapplying the security permissions from the parent folder which corrected all the child folders and items.

### STARTTLS

Our email notification account stopped working and started reporting STARTTLS errors, the fix was to modify the `/include/pear/NET/SMTP.php` file and change the following:

```
// Turn off peer name verification by default
if (!$socket_options)
$socket_options = array(
  'ssl' => array(
    'verify_peer' => false,
    'verify_peer_name' => false
  )
);
```

The SMTP settings needed to be as follows:

```
Sending Email vis SMTP

hostname: SMTP.office365.com
port: 25
authentication required: yes
```
