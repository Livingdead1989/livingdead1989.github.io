---
title:  "osTicket Troubleshooting"
date:   2019-06-14 15:00:00 +0000
categories: osticket
---

# Contents
1. [Firefox Enterprise Certificates](#firefox-enterprise-certificates)
1. [NET::ERR_CERT_COMMON_NAME_INVALID](#neterr_cert_common_name_invalid)
1. [NET::ERR_CERT_WEAK_SIGNATURE_ALGORITHM](#neterr_cert_weak_signature_algorithm)
1. [IOException](#ioexception)
1. [STARTTLS Email Error](#starttls)

# Firefox Enterprise Certificates

Our SSL domain certificate may not be known by Firefox therefore warning the users about an unsecure website, this can be fixed by telling Firefox to trust enterprise certificates.

Open Firefox and in a new tab, type `about:config` in the address bar and press Enter/Return. Click the button promising to be careful. Next in the search box above the list, type `security.enterprise_roots.enabled` double-click the preference to switch the value from false to true.

Close Firefox and the next time you visit your osTicket helpdesk you'll have a green padlock (secure).

If you want to configure this for your enterprise deployment then you just need to add the pref into your `.cfg` configuration file

```
pref("security.enterprise_roots.enabled", true);
```

# NET::ERR_CERT_COMMON_NAME_INVALID

You may receive this security warning which means that the certificate is not containing the correct DNS entries for the site you are visiting.

In my situation I needed to create a certificate template and then create a new certificate request using the MMC (Microsoft Management Console) with the certificate snap-in.

## Certificate Authority Template

On the certificate authority server I opened the certificate authority application (certsrv), right clicked the certificate templates folder in the navigation pane and selected manage.

Right click the Web Server template and duplicate, this will create a copy of which you can edit and rename.

![Duplicate Template](/assets/images/posts/duplicate_template.jpg "Duplicate Template")

While editing the new template you may wish to publish the certificate in Active Directory, increase the Compatibility settings (additional settings are based on the compatibility level) I am using a Windows Server 2016 authority with a Windows 10 / Windows Server 2016 recipient. You may also wish to have the CA certificate manager have to approve which is under the 'Issuance Requirements' tab and lastly you may wish to tweak the algorithm name and key size which is under the 'Cryptography tab'.

Lastly I also needed to tweak the security settings to allow authenticated users to enroll otherwise the certificate template was being listed as unavailable later.

## Create Template Request

Back onto the osTicket server, open the MMC (Microsoft Management Console) and add the certificate snap-in for the local computer. Next right click the personal store and 'Request New Certificate', from the wizard window use the Active Directory Enrollment Policy and select the Web Server template (hopefully you renamed the template) you should have a warning message below the title asking for more details, this is good as we wish to input our own values.

Follow the wizard through and add your own common name in the subject name field and in the alternative name field add your DNS records, completing the wizard will create the request for the certificate and in my case add it to the pending area for approval.

![Completed Request](/assets/images/posts/pending_certificate.jpg "Completed Request")

Finally to create the certificate we need to approve it by going back onto the certificate authority and issuing the pending certificate.

![Issue Pending Certificate](/assets/images/posts/issue_pending_cert.jpg "Issue Pending Certificate")

Once the certificate has been created we will need to retrieve the certificate on our osTicket machine, this can be done via the MMC certificate snap-in by right clicking certificates (local computer) select all tasks and automatically enroll and retrieve certificates, this will pull down the newly created certificate.

## Using the new certificate

To use the certificate in our osTicket deployment will need to swap the certificate over in IIS manager, right click our osTicket site and edit bindings and for the HTTPS binding change the certificate to the newly created version then restart the site.

# NET::ERR_CERT_WEAK_SIGNATURE_ALGORITHM

You may receive this security warning when using Google Chrome, this will be due to the certificate hash algorithm being SHA1. If you want to fix this problem you'll need to have your certificate authority issue a minimum of SHA2 this could mean you need to update your PKI which is recommeneded to test all systems for compatibility before migrating your PKI.

# IOException

`IOException: Unable to read resource content`, I had this problem being reported by the system and under greater investigation found that the 'File Attachment' plugin had files which did not have the correct security permissions.

I fixed this problem by blanket reapplying the security permissions from the parent folder which corrected all the child folders and items.

# STARTTLS

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
