---
title: "WhatsUp Gold 21 Trial Install"
date: 2022-03-26 15:00:00 +0000
categories: server
tags: proxmox microsoft windows server virtio wug whatsupgold nms monitoring logging
description: >- # this means to ignore newlines until "baseurl:"
  In this article I will be exploring the steps required  to install WhatsUp Gold (WUG) 21 trial and create a HTTP redirect.
---

In this article I will be exploring the steps required  to install WhatsUp Gold (WUG) 21 trial and create a HTTP redirect.

## What is WUG

[WhatsUp Gold](https://www.whatsupgold.com/) is a [Network Monitoring System](https://en.wikipedia.org/wiki/Network_monitoring) (NMS), which provides complete visibility into the status and performance of  applications, network devices and servers in the cloud or on-premises.

WUG is not a free or open-source application and there are paywalls for features, but they do offer a 14-day trial, this is useful when comparing against products such as [Zabbix](https://networkingdream.com/server/proxmox-debian-lxc-install-zabbix-6.0-lts/).

## System Requirements

* Windows Server 2022 minimum requirements
  * CPU: 1.4 GHz 64-bit processor
  * RAM: 512 MB (2 GB for Desktop Experience) ECC
  * Storage: 32 GB
* WhatsUp Gold documented requirements
  * CPU: 4 cores @ 2.6 GHz
  * RAM: 8 GB
  * Storage: 25 GB (Installation)
* WhatsUp Gold installer suggested minimum requirements
  * CPU: 8 cores @ 2.6 GHz
  * RAM: 32 GB
  * Storage: 585 GB for 2 weeks log retention

Following WhatsUp Gold's system requirements page Windows Server 2012, 2012 R2, 2016 and 2019 are supported. Although the [documentation for WhatsUp Gold 2022](https://docs.ipswitch.com/NM/WhatsUpGold_PLC/WhatsUp_Gold_PCG.pdf) includes support for Server 2022.

WhatsUp Gold includes MS SQL server 2017 Express by default, although they support Microsoft SQL server 2014, 2016, 2017 and 2019.

Microsoft SQL Express [Limitations](https://docs.microsoft.com/en-us/sql/sql-server/editions-and-components-of-sql-server-version-15?view=sql-server-ver15#Cross-BoxScaleLimits):

* Database file size: 10 GB.
* Memory: 1410 MB.
* Processor: 1 socket, up to 4 cores.

WhatsUp Gold recommend a modern browser such as; Firefox, Chrome or Edge.

In this demonstration I will be installation Microsoft Server 2022 Standard edition with the [trial version of WhatsUp Gold](https://www.whatsupgold.com/trial) version 21.1.1, leveraging the MS SQL Express free licence, as the limitations will not impact me.

## VM Creation

Virtual Machine specification, based on minimum requirements above:

* CPU: ~~4 cores~~ 8 cores
* RAM: ~~8 GB~~ 16 GB
* Storage: 64 GB

## Microsoft Server Installation

Please follow my other article called [Proxmox Windows VM](https://networkingdream.com/server/proxmox-windows-vm/), for a guide to setup a Microsoft server within Proxmox including VirtIO drivers for full feature support.

## WhatsUp Gold Installation

If your license includes **Log Management**, **Failover**, and/or **Distributed functionality**, you will also be presented with additional feature-specific installation steps at the appropriate point(s) during the installation process.

**Standard Installation** - Installed with a dedicated instance of SQL Server Express 2017. Additionally, if your license includes Log Management features, a dedicated instance of Elasticsearch will also be installed.

**Advanced Installation** - User-defined settings including specifying a dedicated Windows account for IIS and, depending on your license, enabling Failover and/or Distributed features, and pointing to an existing instance of SQL Server and/or Elasticsearch.

![wug-install-1](/assets/images/posts/wug-install-1.png)

The system check will notify about IIS not being installed but states that it will be installed for you.

![wug-install-2](/assets/images/posts/wug-install-2.png)

We do not want our WhatsUp Gold web panel accessible from HTTP, therefore the default options are perfect.

We will create a HTTP to HTTPS redirect rule later.

![wug-install-3](/assets/images/posts/wug-install-3.png)

In this demonstration a Self-Signed certificate will be generated.

![wug-install-4](/assets/images/posts/wug-install-4.png)

### Elasticsearch

Elasticsearch - "a distributed search and analytics engine built on Apache Lucene and is commonly used for log analytics, full-text search,  security intelligence, business analytics, and operational intelligence  use cases."

[IBM released a 10 minute YouTube video that explains Elasticsearch](https://www.youtube.com/watch?v=ZP0NmfyfsoM).

If you do not require or licensed for Log Management then check the "I'm not planning to use" option at the bottom, but as this is a trial I will install the open-source version of Elasticsearch.

![wug-install-5](/assets/images/posts/wug-install-5.png)

The edition of Elasticsearch that is distributed with WhatsUp Gold is the open-source edition, this version lacks the authentication and encryption features.  The "normal" edition of Elasticsearch (non open-source) has authentication and  encryption feature set but cannot be distributed without permission from [Elastic.co](http://Elastic.co).

In this demonstration I will "Install an open-source version of Elasticsearch with WhatsUp Gold".

![wug-install-6](/assets/images/posts/wug-install-6.png)

Despite [WhatsUp Gold's system requirements](https://www.whatsupgold.com/system-requirements), there was a "information question" which much higher minimum requirements.

![wug-install-7](/assets/images/posts/wug-install-7.png)

In production I'd recommend having the WhatsUp Gold installation separate from the operating system by adding a second disk, then at this prompt we would alter to move the directory.

I would also suggest the "Advanced" installation and not using MS SQL Express.

But in this demonstration I have a single disk and the default values are fine.

![wug-install-8](/assets/images/posts/wug-install-8.png)

Another "information question", this time regarding storage space, which recommends 585 GB for a 2 week log retention.

![wug-install-9](/assets/images/posts/wug-install-9.png)

A summary window to the installation directories.

![wug-install-10](/assets/images/posts/wug-install-10.png)

Installation took roughly 20-30 minutes.

![wug-install-11](/assets/images/posts/wug-install-11.png)

Once installation has completed the installer will do a clean up and open a browser, where we set the default administrator's password.

![wug-install-12](/assets/images/posts/wug-install-12.png)

Installation is now complete.

## Quick Start

On first login a "Quick Start" prompt will appear, this is designed to get your instance up and running as soon as possible by performing a network discovery scan.

The first question is what to scan, I have selected the Local subnet.

![wug-quickstart-1](/assets/images/posts/wug-quickstart-1.png)

Next WhatsUp Gold will ask for some credentials, ~~I provided the default read community school for SNMPv2.~~ The "public" community string for SNMPv1 and v2 are added by default, although we cannot see it.

This is also a good place for adding your Windows domain credentials.

![wug-quickstart-2](/assets/images/posts/wug-quickstart-2.png)

The last question is an email configuration so WhatsUp Gold can start emailing.

![wug-quickstart-3](/assets/images/posts/wug-quickstart-3.png)

After the scan completes there should be some devices listed, as shown below.

![wug-quickstart-4](/assets/images/posts/wug-quickstart-4.png)

### HTTPS Redirect

Install the "URL Rewrite" [extension](https://www.iis.net/downloads/microsoft/url-rewrite), using the download provided or using Web Platform.

![wug-iis-rewrite-1](/assets/images/posts/wug-iis-rewrite-1.png)

Once installed, navigate to our "WhatsUp Gold" site and click "URL Rewrite".

![wug-iis-rewrite-2](/assets/images/posts/wug-iis-rewrite-2.png)

Click the "Add Rule(s)" button in the top right, then create a "Blank rule".

![wug-iis-rewrite-3](/assets/images/posts/wug-iis-rewrite-3.png)

Provide a name for the rule and for the pattern use the following

```text
(.*)
```

![wug-iis-rewrite-4](/assets/images/posts/wug-iis-rewrite-4.png)

Scroll down to "Conditions" and click "Add".

Select the `{HTTPS}` condition input and for the pattern use the following

```text
^OFF$
```

![wug-iis-rewrite-5](/assets/images/posts/wug-iis-rewrite-5.png)

Lastly scroll down to "Action" and change the type to "Redirect" and use the following for the Redirect URL

```text
https://{HTTP_HOST}/{REQUEST_URI}
```

Then apply the rule.

![wug-iis-rewrite-6](/assets/images/posts/wug-iis-rewrite-6.png)

This will create a `web.config` file in the WhatsUp directory, as shown in the figure below.

![wug-iis-rewrite-7](/assets/images/posts/wug-iis-rewrite-7.png)

Lastly we can remove the default website by right clicking and selecting "Remove".

![wug-iis-rewrite-8](/assets/images/posts/wug-iis-rewrite-8.png)
