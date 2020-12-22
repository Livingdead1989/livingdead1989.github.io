---
title:  "osTicket Plugins - Core"
date:   2019-04-10 15:42:44 +0000
categories: osticket
---

# Core Plugins
On the osTicket download there are options to add plugins, I will be adding the following plugins: 

1. HTTP Pass-Through (auth-passthru.phar), 
1. LDAP and Active Directory (auth-ldap.phar), 
1. Attachments on the Filesystem (storage-fs.phar)

Drop the '.phar' files into the plugins directory (C:\inetpub\wwwroot\include\plugins)
Goto the webpanel, login as a agent and then navigate to Manage > Plugins, click the 'Add New Plugin' button and install all three newly added plugins.

![Currently Installed Plugins](/assets/images/posts/installed_plugins.jpg "Currently Installed Plugins")

## Attachments on the Filesystem
We will be creating a new folder in the osticket root called 'Attachments' and making sure that the webserver can write to this newly created folder by changing the security properties to allow SERVER\Users access to modify the attachments folder.

![Attachments Folder Permissions](/assets/images/posts/attachments_permissions.jpg "Attachments Folder Permissions")

Once we have the folder we can add the path into the Base folder for attachment files of Attachments and apply, you should see a green success message.

![Attachments Folder Path](/assets/images/posts/attachments_folder_path.jpg "Attachments Folder Path")

Finally we need to change the 'Store Attachments' to 'FileSystem' this can be found via Admin Panel > Settings > System, under the Attachments Storage and Settings tab.

## LDAP and Active Directory
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

### IIS Server Role
You'll need to add the 'Windows Authentication' server role from within Server Manager.

![Server IIS Role Windows Authentication](/assets/images/posts/windows_authentication_role.jpg "Server IIS Role Windows Authentication")

Then within IIS Manager, your osticket site disable all other authentications except 'Windows Authentication', I have only enabled NTLM providers once this has been applied this will allow SSO (Single Sign-On) using Windows authentication.

![IIS Manager Site Authentication](/assets/images/posts/iis_authentications.jpg "IIS Manager Site Authentication")

## HTTP Pass-Through
Enable staff and client authentication check boxes, save the configuration then enable the plugin.

Users from Active Directory will now automatically sign in and have their accounts created/registered in osTicket.

**Edit: After enabling the custom error messages I had issues with the SSO feature, I have had to leave these as default for now**


### Notes

I needed to make sure that my osticket URL was set to Safe Site (2) in my zone assignments GPO and Google Chrome group policy had the URL added for 'authentication server whitelist' and 'kerberos delegration server whitelist'. Firefox required the preference item of 'network.automatic-ntlm-auth.trusted-uris' to have the server address as a value.

Once I had all configured the pass-through and single sign-on worked perfectly in all browsers (tested in: Internet Explorer, Google Chrome and Mozilla Firefox).


# HTTPS support

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

## Domain Signed Certificate

From IIS Manager go into Server Certificates and select 'Create Domain Certificate' from the actions pane.

Fill all of the information in for Common name (enter site URL), Organization, OU, City, State, Country and continue.
Select your Domain Certificate Authority normally your PKI or PDC then provide a friendly name.

Complete the registeration and your new certificate will be created.


## Force HTTPS using URL Rewrite

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