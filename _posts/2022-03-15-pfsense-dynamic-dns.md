---
title: "pfSense Dynamic DNS"
date: 2022-03-15 09:10:00 +0000
categories: server
tags: homeserver server components hypervisor storage virtual machine container 
description: >- # this means to ignore newlines until "baseurl:"
  In this demonstration I will be configuring pfSense's DDNS client to update DNS records with Cloudflare.
---

Dynamic DNS (DDNS) client registers the IP address of a WAN interface with a variety of dynamic DNS service providers. This is advantageous when your ISP does not provide a static address, when your WAN address changes the DDNS client updates the DNS service provider, therefore records will always be correct.

In this demonstration I will be configuring pfSense's DDNS client to update DNS records with Cloudflare. 

There are two sections, first is configuring and collecting credentials for **Cloudflare** and the second is configuring **pfSense** and verifying the deployment is working.



## Cloudflare 

To create a API token log into Cloudflare and navigate to **My Profile** > **API Tokens**.

![pfsense-ddns-1](/assets/images/posts/pfsense-ddns-1.png)

Create a new API token and use the "Edit zone DNS" template.

![pfsense-ddns-2](/assets/images/posts/pfsense-ddns-2.png)

Provide a suitable name for the token and set the zone to the required domain.

![pfsense-ddns-3](/assets/images/posts/pfsense-ddns-3.png)

A new API token will be generated, save this token information as it will be required while configuring pfSense.

![pfsense-ddns-4](/assets/images/posts/pfsense-ddns-4.png)

The Zone ID is also required, which can be found under your configured domain and Overview, the figure below shows its location to the right side.

![pfsense-ddns-5](/assets/images/posts/pfsense-ddns-5.png)

The last step in Cloudflare is to create a new DNS record.

In the figure below I have created an A record for DDNS, configured its IPv4 address to Cloudflare's 1.1.1.1 and disabled Proxy status, this will be updated later and proof our deployment has worked.

![pfsense-ddns-6](/assets/images/posts/pfsense-ddns-6.png)



## pfSense Dynamic DNS

To configure Dynamic DNS within pfSense navigate to **Services** > **Dynamic DNS** and under **Dynamic DNS Clients** click the **Add** button.


![pfsense-ddns-7](/assets/images/posts/pfsense-ddns-7.png)

Set the service type to Cloudflare and leave the interface to your external (WAN).

![pfsense-ddns-8](/assets/images/posts/pfsense-ddns-8.png)

Populate the hostname field with your newly created DNS record with domain name.

![pfsense-ddns-9](/assets/images/posts/pfsense-ddns-9.png)

To improve privacy and security enable the Cloudflare Proxy.

![pfsense-ddns-10](/assets/images/posts/pfsense-ddns-10.png)

Then populate the username with the Zone ID and password with the API key.

![pfsense-ddns-11](/assets/images/posts/pfsense-ddns-11.png)

Click save when finished and the status should return with a green tick and your current WAN IP address will be displayed in the Cached IP.

![pfsense-ddns-12](/assets/images/posts/pfsense-ddns-12.png)

Go back to Cloudflare, under DNS and check the updated IP address and enable the proxy.



In this article we have configured Cloudflare and pfSense to utilise dynamic DNS and ensure that our external IP address is always aligned with our DNS records. This means that are hosted services will not have issues if our ISP changes our IP address.

