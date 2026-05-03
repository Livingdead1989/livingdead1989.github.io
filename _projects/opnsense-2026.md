---
title: "OPNsense Zero to Hero Homelab"
layout: project
status: active # active / updated / archived
featured: true
homepage: https://networkingdream.com

description: >
  

excerpt: >
  

tags:
  - 

started: 2026-02-21
archived: false
og_image: /assets/og/projects/site.png

assets: /assets/projects/opnsense-2026

mermaid: true
---

## Initial Setup

General settings
- Added my preferred internal domain name.
- Set the `opnsense-dark` theme to prevent my eyes from melting.


Miscellaneous settings
- Thermal sensors, configured to "Intel Core CPU", this means you can add the Thermal Sensors widget on your dashboard and monitor their temperatures.
- System Sounds, Startup/Shutdown Sound disabled.
- Enabled Use PowerD and set the normal behaviour from `Hiadaptive` to `Minimum` mode this uses the lowest performance values to get the most power savings.

### Backup

Snapshots 

### Notifications
### MFA

---

## DHCP and DNS

### Primer Information and selection

**Dnsmasq and DHCP** is a lightweight and easy to configure DNS forwarder and DHCPv4/DHCPv6 server. It is designed for small and medium sized setups and synergizes well with Unbound DNS

**KEA DHCP** is designed for larger scale, highly available setup and synergizes well with radvd for HA enabled router advertisements.

**Unbound DNS** is a validating, recursive, caching DNS resolver. 

Currently it is not possible to register hostnames dynamically between KEA and Unbound, only static reservations will be synchronized on an Unbound service restart.

---

My requirements are:
- Lightweight
- DNS sinkhole / blocklist
- Easy to maintain
- Monitoring and Metrics

I currently deploy a [PiHole](https://pi-hole.net/){:target="_blank"} for my homelab DNS and DHCP needs, therefore OPNsense will need to replace this without losing features or functionality. PiHole is running a modified version of dnsmasq called [FTLDNS](https://github.com/pi-hole/FTL){:target="_blank"} therefore I will be deploying **Dnsmasq and DHCP** alongside **Unbound DNS** as it fits my sizing, management and HA requirement.

---

### Data Flow Diagram

<div class="mermaid">
flowchart LR
  client(Client Device) <--Query---> Unbound
  
  Unbound <--If Unknown--> extDNS[External DNS]

  Unbound <--If Local--> Dnsmasq

  Dnsmasq <--> DHCP[DHCP Server,
  Local Zones]
</div>

### Implementation of Dnsmasq and Unbound

These services are built-in to OPNsense, therefore we do not need to install any plugins.

Dnsmasq DNS & DHCP can be found within the "Services" navigation item.

Below are the changes that were made, otherwise the default values were used:

**General**

**Default:**
 - Enable: Enable
 - Interface: LAN

**DNS:**
 - Listen Port: `53053`
 - No hosts lookup: Enabled

**DNS Query Forwarding:**
 - Require domain: Enabled
 - Do not forward to system defined DNS servers: Enabled
 - Do not forward private reverse lookups: Enabled

**DHCP:**
 - DHCP default domain: `home.lan`
 - DHCP authoritative: Enabled

**Domains**

These are the DNS forwarding name servers, create a new entry.

**Quad9**
 - Sequence: 1
 - Domain: Quad9
 - IP address: `9.9.9.9`
 - Port: `853`

**Quad9**
 - Sequence: 2
 - Domain: Quad9
 - IP address: `149.112.112.112`
 - Port: `853`

**Hosts** (Reservations)

Reservations will reserve the IP address inside a range, meaning the reserved IP will not be offered to dynamic clients.

The reservation can also be outside the dynamic range, but it is not recommended for simple setups as the dynamic dns registration with dhcp-fqdn will not work correctly.

**DHCP Ranges**

**New LAN Scope**
  - Interface: LAN
  - Start address: `192.168.1.11`
  - End address: `192.168.1.59`
  - Subnet mask: `255.255.255.0`
  - Domain: `home.lan`
  - Description: LAN Scope

**DHCP Options**

Creating a DHCP range will automatically send out common DHCP options to requesting clients, without explicitly configuring them for example:

- router[3]
- dns-server[6]
- domain-name[15]
- client fqdn[81]



Unbound can be found within the "Services" navigation item.

Below are the changes that were made, otherwise the default values were used:

**General**

**Default:**
 - Enable: Enable
 - Listen Port: `53`
 - Interface: LAN
 - Enable DNSSEC Support: Enabled

**Query Forwarding**

This will use Dnsmasq as the forwarding address from Unbound.

**New Custom Forwarding (forward lookup):**
 - Enabled: Enable
 - Domain: `home.lan`
 - Server IP: `127.0.0.1`
 - Server Port: `53053`
 - Description: LAN Forward Lookup Dnsmasq

**New Custom Forwarding (reverse lookup):**
 - Enabled: Enable
 - Domain: `1.168.192.in-addr.arpa`
 - Server IP: `127.0.0.1`
 - Server Port: `53053`
 - Description: LAN Reverse Lookup Dnsmasq

---

### Overrides 

Overrides are used to create host records and aliases, when self-hosting through a reverse proxy you'll want to create a few overrides such as:

**Hosts:**
 - Host: home
 - Domain: example.com
 - Type: A
 - IP Address: IP of your proxy
 - Description: Reverse Proxy

**Aliases:**
 - Host override: home.example.com
 - Host: nextcloud
 - Domain: leave blank for parent domain
 - Description: NextCloud

When you have a new service, you create a new alais.

![Creating Unbound overrides for local services]({{ page.assets }}/unbound-overrides-proxy.png)

---

### Blocklists

OPNsense has a good selection of preconfigured DNS blocklists, but if you wanted to add your own then you need to enable advanced mode and add the URL.

![Adding a manual DNS block list URL]({{ page.assets }}/unbound-dnsbl-manual.png)

Here are some example lists:
- [YouTube Ads](https://raw.githubusercontent.com/kboghdady/youTube_ads_4_pi-hole/master/youtubelist.txt)
- [Fakenews Gambling and Porn](http://sbc.io/hosts/alternates/fakenews-gambling-porn/hosts)
- [ADAway](https://adaway.org/hosts.txt)
- [DNS over HTTPS](https://raw.githubusercontent.com/crypt0rr/public-doh-servers/main/dns.list)
- [PiHole](https://raw.githubusercontent.com/r0xd4n3t/pihole-adblock-lists/main/pihole_adlists.txt)

---

#### Apple Private Relay

Apple provide support and [documentation](https://developer.apple.com/icloud/prepare-your-network-for-icloud-private-relay/){:target="_blank"} for their services, including Private Relay.

To block access to Apple's Private Relay create a blocklist with the following Blocklist Domains:
- `mask.icloud.com`
- `mask-h2.icloud.com`

Enable advanced mode and enable Return NXDOMAIN.

By returning NXDOMAIN this avoids causing DNS resolution timeouts or silently dropping IP packets sent to the Private Relay server, as this can lead to delays on client devices.

---

### Schedule 

To update the blocklists on a schedule, create a Cron job via the System > Settings > Cron navigation menu.

For a weekly update that occurs on Sunday at 00:00, enter `0,0,*,*,0` with the command of "Update Unbound DNSBLs".

[Cron Calculator](https://crontab.guru/#0_0_*_*_0){:target="_blank"}

![Creating a Cron task for updating Unbound DNS block lists]({{ page.assets }}/unbound-cron.png)

---

### Safe Search

Unbound has a "Force SafeSearch" button within its General menu, applying to Google, DuckDuckGo, Bing, Qwant, PixaBay and YouTube. If you want more granular control you'll need to add the values yourself.

SSH onto OPNsense and create a new file, this will automatically get added to the Unbound configuration.

Edit the below file using `vi` or install nano using `pkg install nano`.

```bash
nano /usr/local/etc/unbound.opnsense.d/custom_safesearch.conf
```

Below is the safe search list, including YouTube, Yandex, DuckDuckGo, Bing, Pixabay, Qwant and Google.

```text
server:
# YouTube
local-zone: "www.youtube.com" redirect
local-data: "www.youtube.com CNAME restrictmoderate.youtube.com"
local-zone: "m.youtube.com" redirect
local-data: "m.youtube.com CNAME restrictmoderate.youtube.com"
local-zone: "youtubei.googleapis.com" redirect
local-data: "youtubei.googleapis.com CNAME restrictmoderate.youtube.com"
local-zone: "youtube.googleapis.com" redirect
local-data: "youtube.googleapis.com CNAME restrictmoderate.youtube.com"
local-zone: "www.youtube-nocookie.com" redirect
local-data: "www.youtube-nocookie.com CNAME restrictmoderate.youtube.com"

# Yandex
local-zone: "yandex.com" redirect
local-data: "yandex.com CNAME familysearch.yandex.ru"
local-zone: "yandex.ru" redirect
local-data: "yandex.ru CNAME familysearch.yandex.ru"
local-zone: "yandex.eu" redirect
local-data: "yandex.eu CNAME familysearch.yandex.ru"

# DuckDuckGo
local-zone: "duckduckgo.com" redirect
local-data: "duckduckgo.com CNAME safe.duckduckgo.com"
local-zone: "duck.com" redirect
local-data: "duck.com CNAME safe.duckduckgo.com"
local-zone: "external-content.duckduckgo.com" always_transparent

# Bing
local-zone: "bing.com" redirect
local-data: "bing.com CNAME strict.bing.com"

# Pixabay
local-zone: "pixabay.com" redirect
local-data: "pixabay.com CNAME safesearch.pixabay.com"

# Qwant
local-zone: "qwant.com" redirect
local-data: "qwant.com CNAME safeapi.qwant.com"

# Google. TLDs are fetched from https://www.google.com/supported_domains.
local-zone: "www.google.com" redirect
local-data: "www.google.com CNAME forcesafesearch.google.com"
local-zone: "www.google.ad" redirect
local-data: "www.google.ad CNAME forcesafesearch.google.com"
local-zone: "www.google.ae" redirect
local-data: "www.google.ae CNAME forcesafesearch.google.com"
local-zone: "www.google.com.af" redirect
local-data: "www.google.com.af CNAME forcesafesearch.google.com"
local-zone: "www.google.com.ag" redirect
local-data: "www.google.com.ag CNAME forcesafesearch.google.com"
local-zone: "www.google.com.ai" redirect
local-data: "www.google.com.ai CNAME forcesafesearch.google.com"
local-zone: "www.google.al" redirect
local-data: "www.google.al CNAME forcesafesearch.google.com"
local-zone: "www.google.am" redirect
local-data: "www.google.am CNAME forcesafesearch.google.com"
local-zone: "www.google.co.ao" redirect
local-data: "www.google.co.ao CNAME forcesafesearch.google.com"
local-zone: "www.google.com.ar" redirect
local-data: "www.google.com.ar CNAME forcesafesearch.google.com"
local-zone: "www.google.as" redirect
local-data: "www.google.as CNAME forcesafesearch.google.com"
local-zone: "www.google.at" redirect
local-data: "www.google.at CNAME forcesafesearch.google.com"
local-zone: "www.google.com.au" redirect
local-data: "www.google.com.au CNAME forcesafesearch.google.com"
local-zone: "www.google.az" redirect
local-data: "www.google.az CNAME forcesafesearch.google.com"
local-zone: "www.google.ba" redirect
local-data: "www.google.ba CNAME forcesafesearch.google.com"
local-zone: "www.google.com.bd" redirect
local-data: "www.google.com.bd CNAME forcesafesearch.google.com"
local-zone: "www.google.be" redirect
local-data: "www.google.be CNAME forcesafesearch.google.com"
local-zone: "www.google.bf" redirect
local-data: "www.google.bf CNAME forcesafesearch.google.com"
local-zone: "www.google.bg" redirect
local-data: "www.google.bg CNAME forcesafesearch.google.com"
local-zone: "www.google.com.bh" redirect
local-data: "www.google.com.bh CNAME forcesafesearch.google.com"
local-zone: "www.google.bi" redirect
local-data: "www.google.bi CNAME forcesafesearch.google.com"
local-zone: "www.google.bj" redirect
local-data: "www.google.bj CNAME forcesafesearch.google.com"
local-zone: "www.google.com.bn" redirect
local-data: "www.google.com.bn CNAME forcesafesearch.google.com"
local-zone: "www.google.com.bo" redirect
local-data: "www.google.com.bo CNAME forcesafesearch.google.com"
local-zone: "www.google.com.br" redirect
local-data: "www.google.com.br CNAME forcesafesearch.google.com"
local-zone: "www.google.bs" redirect
local-data: "www.google.bs CNAME forcesafesearch.google.com"
local-zone: "www.google.bt" redirect
local-data: "www.google.bt CNAME forcesafesearch.google.com"
local-zone: "www.google.co.bw" redirect
local-data: "www.google.co.bw CNAME forcesafesearch.google.com"
local-zone: "www.google.by" redirect
local-data: "www.google.by CNAME forcesafesearch.google.com"
local-zone: "www.google.com.bz" redirect
local-data: "www.google.com.bz CNAME forcesafesearch.google.com"
local-zone: "www.google.ca" redirect
local-data: "www.google.ca CNAME forcesafesearch.google.com"
local-zone: "www.google.cd" redirect
local-data: "www.google.cd CNAME forcesafesearch.google.com"
local-zone: "www.google.cf" redirect
local-data: "www.google.cf CNAME forcesafesearch.google.com"
local-zone: "www.google.cg" redirect
local-data: "www.google.cg CNAME forcesafesearch.google.com"
local-zone: "www.google.ch" redirect
local-data: "www.google.ch CNAME forcesafesearch.google.com"
local-zone: "www.google.ci" redirect
local-data: "www.google.ci CNAME forcesafesearch.google.com"
local-zone: "www.google.co.ck" redirect
local-data: "www.google.co.ck CNAME forcesafesearch.google.com"
local-zone: "www.google.cl" redirect
local-data: "www.google.cl CNAME forcesafesearch.google.com"
local-zone: "www.google.cm" redirect
local-data: "www.google.cm CNAME forcesafesearch.google.com"
local-zone: "www.google.cn" redirect
local-data: "www.google.cn CNAME forcesafesearch.google.com"
local-zone: "www.google.com.co" redirect
local-data: "www.google.com.co CNAME forcesafesearch.google.com"
local-zone: "www.google.co.cr" redirect
local-data: "www.google.co.cr CNAME forcesafesearch.google.com"
local-zone: "www.google.com.cu" redirect
local-data: "www.google.com.cu CNAME forcesafesearch.google.com"
local-zone: "www.google.cv" redirect
local-data: "www.google.cv CNAME forcesafesearch.google.com"
local-zone: "www.google.com.cy" redirect
local-data: "www.google.com.cy CNAME forcesafesearch.google.com"
local-zone: "www.google.cz" redirect
local-data: "www.google.cz CNAME forcesafesearch.google.com"
local-zone: "www.google.de" redirect
local-data: "www.google.de CNAME forcesafesearch.google.com"
local-zone: "www.google.dj" redirect
local-data: "www.google.dj CNAME forcesafesearch.google.com"
local-zone: "www.google.dk" redirect
local-data: "www.google.dk CNAME forcesafesearch.google.com"
local-zone: "www.google.dm" redirect
local-data: "www.google.dm CNAME forcesafesearch.google.com"
local-zone: "www.google.com.do" redirect
local-data: "www.google.com.do CNAME forcesafesearch.google.com"
local-zone: "www.google.dz" redirect
local-data: "www.google.dz CNAME forcesafesearch.google.com"
local-zone: "www.google.com.ec" redirect
local-data: "www.google.com.ec CNAME forcesafesearch.google.com"
local-zone: "www.google.ee" redirect
local-data: "www.google.ee CNAME forcesafesearch.google.com"
local-zone: "www.google.com.eg" redirect
local-data: "www.google.com.eg CNAME forcesafesearch.google.com"
local-zone: "www.google.es" redirect
local-data: "www.google.es CNAME forcesafesearch.google.com"
local-zone: "www.google.com.et" redirect
local-data: "www.google.com.et CNAME forcesafesearch.google.com"
local-zone: "www.google.fi" redirect
local-data: "www.google.fi CNAME forcesafesearch.google.com"
local-zone: "www.google.com.fj" redirect
local-data: "www.google.com.fj CNAME forcesafesearch.google.com"
local-zone: "www.google.fm" redirect
local-data: "www.google.fm CNAME forcesafesearch.google.com"
local-zone: "www.google.fr" redirect
local-data: "www.google.fr CNAME forcesafesearch.google.com"
local-zone: "www.google.ga" redirect
local-data: "www.google.ga CNAME forcesafesearch.google.com"
local-zone: "www.google.ge" redirect
local-data: "www.google.ge CNAME forcesafesearch.google.com"
local-zone: "www.google.gg" redirect
local-data: "www.google.gg CNAME forcesafesearch.google.com"
local-zone: "www.google.com.gh" redirect
local-data: "www.google.com.gh CNAME forcesafesearch.google.com"
local-zone: "www.google.com.gi" redirect
local-data: "www.google.com.gi CNAME forcesafesearch.google.com"
local-zone: "www.google.gl" redirect
local-data: "www.google.gl CNAME forcesafesearch.google.com"
local-zone: "www.google.gm" redirect
local-data: "www.google.gm CNAME forcesafesearch.google.com"
local-zone: "www.google.gr" redirect
local-data: "www.google.gr CNAME forcesafesearch.google.com"
local-zone: "www.google.com.gt" redirect
local-data: "www.google.com.gt CNAME forcesafesearch.google.com"
local-zone: "www.google.gy" redirect
local-data: "www.google.gy CNAME forcesafesearch.google.com"
local-zone: "www.google.com.hk" redirect
local-data: "www.google.com.hk CNAME forcesafesearch.google.com"
local-zone: "www.google.hn" redirect
local-data: "www.google.hn CNAME forcesafesearch.google.com"
local-zone: "www.google.hr" redirect
local-data: "www.google.hr CNAME forcesafesearch.google.com"
local-zone: "www.google.ht" redirect
local-data: "www.google.ht CNAME forcesafesearch.google.com"
local-zone: "www.google.hu" redirect
local-data: "www.google.hu CNAME forcesafesearch.google.com"
local-zone: "www.google.co.id" redirect
local-data: "www.google.co.id CNAME forcesafesearch.google.com"
local-zone: "www.google.ie" redirect
local-data: "www.google.ie CNAME forcesafesearch.google.com"
local-zone: "www.google.co.il" redirect
local-data: "www.google.co.il CNAME forcesafesearch.google.com"
local-zone: "www.google.im" redirect
local-data: "www.google.im CNAME forcesafesearch.google.com"
local-zone: "www.google.co.in" redirect
local-data: "www.google.co.in CNAME forcesafesearch.google.com"
local-zone: "www.google.iq" redirect
local-data: "www.google.iq CNAME forcesafesearch.google.com"
local-zone: "www.google.is" redirect
local-data: "www.google.is CNAME forcesafesearch.google.com"
local-zone: "www.google.it" redirect
local-data: "www.google.it CNAME forcesafesearch.google.com"
local-zone: "www.google.je" redirect
local-data: "www.google.je CNAME forcesafesearch.google.com"
local-zone: "www.google.com.jm" redirect
local-data: "www.google.com.jm CNAME forcesafesearch.google.com"
local-zone: "www.google.jo" redirect
local-data: "www.google.jo CNAME forcesafesearch.google.com"
local-zone: "www.google.co.jp" redirect
local-data: "www.google.co.jp CNAME forcesafesearch.google.com"
local-zone: "www.google.co.ke" redirect
local-data: "www.google.co.ke CNAME forcesafesearch.google.com"
local-zone: "www.google.com.kh" redirect
local-data: "www.google.com.kh CNAME forcesafesearch.google.com"
local-zone: "www.google.ki" redirect
local-data: "www.google.ki CNAME forcesafesearch.google.com"
local-zone: "www.google.kg" redirect
local-data: "www.google.kg CNAME forcesafesearch.google.com"
local-zone: "www.google.co.kr" redirect
local-data: "www.google.co.kr CNAME forcesafesearch.google.com"
local-zone: "www.google.com.kw" redirect
local-data: "www.google.com.kw CNAME forcesafesearch.google.com"
local-zone: "www.google.kz" redirect
local-data: "www.google.kz CNAME forcesafesearch.google.com"
local-zone: "www.google.la" redirect
local-data: "www.google.la CNAME forcesafesearch.google.com"
local-zone: "www.google.com.lb" redirect
local-data: "www.google.com.lb CNAME forcesafesearch.google.com"
local-zone: "www.google.li" redirect
local-data: "www.google.li CNAME forcesafesearch.google.com"
local-zone: "www.google.lk" redirect
local-data: "www.google.lk CNAME forcesafesearch.google.com"
local-zone: "www.google.co.ls" redirect
local-data: "www.google.co.ls CNAME forcesafesearch.google.com"
local-zone: "www.google.lt" redirect
local-data: "www.google.lt CNAME forcesafesearch.google.com"
local-zone: "www.google.lu" redirect
local-data: "www.google.lu CNAME forcesafesearch.google.com"
local-zone: "www.google.lv" redirect
local-data: "www.google.lv CNAME forcesafesearch.google.com"
local-zone: "www.google.com.ly" redirect
local-data: "www.google.com.ly CNAME forcesafesearch.google.com"
local-zone: "www.google.co.ma" redirect
local-data: "www.google.co.ma CNAME forcesafesearch.google.com"
local-zone: "www.google.md" redirect
local-data: "www.google.md CNAME forcesafesearch.google.com"
local-zone: "www.google.me" redirect
local-data: "www.google.me CNAME forcesafesearch.google.com"
local-zone: "www.google.mg" redirect
local-data: "www.google.mg CNAME forcesafesearch.google.com"
local-zone: "www.google.mk" redirect
local-data: "www.google.mk CNAME forcesafesearch.google.com"
local-zone: "www.google.ml" redirect
local-data: "www.google.ml CNAME forcesafesearch.google.com"
local-zone: "www.google.com.mm" redirect
local-data: "www.google.com.mm CNAME forcesafesearch.google.com"
local-zone: "www.google.mn" redirect
local-data: "www.google.mn CNAME forcesafesearch.google.com"
local-zone: "www.google.ms" redirect
local-data: "www.google.ms CNAME forcesafesearch.google.com"
local-zone: "www.google.com.mt" redirect
local-data: "www.google.com.mt CNAME forcesafesearch.google.com"
local-zone: "www.google.mu" redirect
local-data: "www.google.mu CNAME forcesafesearch.google.com"
local-zone: "www.google.mv" redirect
local-data: "www.google.mv CNAME forcesafesearch.google.com"
local-zone: "www.google.mw" redirect
local-data: "www.google.mw CNAME forcesafesearch.google.com"
local-zone: "www.google.com.mx" redirect
local-data: "www.google.com.mx CNAME forcesafesearch.google.com"
local-zone: "www.google.com.my" redirect
local-data: "www.google.com.my CNAME forcesafesearch.google.com"
local-zone: "www.google.co.mz" redirect
local-data: "www.google.co.mz CNAME forcesafesearch.google.com"
local-zone: "www.google.com.na" redirect
local-data: "www.google.com.na CNAME forcesafesearch.google.com"
local-zone: "www.google.com.ng" redirect
local-data: "www.google.com.ng CNAME forcesafesearch.google.com"
local-zone: "www.google.com.ni" redirect
local-data: "www.google.com.ni CNAME forcesafesearch.google.com"
local-zone: "www.google.ne" redirect
local-data: "www.google.ne CNAME forcesafesearch.google.com"
local-zone: "www.google.nl" redirect
local-data: "www.google.nl CNAME forcesafesearch.google.com"
local-zone: "www.google.no" redirect
local-data: "www.google.no CNAME forcesafesearch.google.com"
local-zone: "www.google.com.np" redirect
local-data: "www.google.com.np CNAME forcesafesearch.google.com"
local-zone: "www.google.nr" redirect
local-data: "www.google.nr CNAME forcesafesearch.google.com"
local-zone: "www.google.nu" redirect
local-data: "www.google.nu CNAME forcesafesearch.google.com"
local-zone: "www.google.co.nz" redirect
local-data: "www.google.co.nz CNAME forcesafesearch.google.com"
local-zone: "www.google.com.om" redirect
local-data: "www.google.com.om CNAME forcesafesearch.google.com"
local-zone: "www.google.com.pa" redirect
local-data: "www.google.com.pa CNAME forcesafesearch.google.com"
local-zone: "www.google.com.pe" redirect
local-data: "www.google.com.pe CNAME forcesafesearch.google.com"
local-zone: "www.google.com.pg" redirect
local-data: "www.google.com.pg CNAME forcesafesearch.google.com"
local-zone: "www.google.com.ph" redirect
local-data: "www.google.com.ph CNAME forcesafesearch.google.com"
local-zone: "www.google.com.pk" redirect
local-data: "www.google.com.pk CNAME forcesafesearch.google.com"
local-zone: "www.google.pl" redirect
local-data: "www.google.pl CNAME forcesafesearch.google.com"
local-zone: "www.google.pn" redirect
local-data: "www.google.pn CNAME forcesafesearch.google.com"
local-zone: "www.google.com.pr" redirect
local-data: "www.google.com.pr CNAME forcesafesearch.google.com"
local-zone: "www.google.ps" redirect
local-data: "www.google.ps CNAME forcesafesearch.google.com"
local-zone: "www.google.pt" redirect
local-data: "www.google.pt CNAME forcesafesearch.google.com"
local-zone: "www.google.com.py" redirect
local-data: "www.google.com.py CNAME forcesafesearch.google.com"
local-zone: "www.google.com.qa" redirect
local-data: "www.google.com.qa CNAME forcesafesearch.google.com"
local-zone: "www.google.ro" redirect
local-data: "www.google.ro CNAME forcesafesearch.google.com"
local-zone: "www.google.ru" redirect
local-data: "www.google.ru CNAME forcesafesearch.google.com"
local-zone: "www.google.rw" redirect
local-data: "www.google.rw CNAME forcesafesearch.google.com"
local-zone: "www.google.com.sa" redirect
local-data: "www.google.com.sa CNAME forcesafesearch.google.com"
local-zone: "www.google.com.sb" redirect
local-data: "www.google.com.sb CNAME forcesafesearch.google.com"
local-zone: "www.google.sc" redirect
local-data: "www.google.sc CNAME forcesafesearch.google.com"
local-zone: "www.google.se" redirect
local-data: "www.google.se CNAME forcesafesearch.google.com"
local-zone: "www.google.com.sg" redirect
local-data: "www.google.com.sg CNAME forcesafesearch.google.com"
local-zone: "www.google.sh" redirect
local-data: "www.google.sh CNAME forcesafesearch.google.com"
local-zone: "www.google.si" redirect
local-data: "www.google.si CNAME forcesafesearch.google.com"
local-zone: "www.google.sk" redirect
local-data: "www.google.sk CNAME forcesafesearch.google.com"
local-zone: "www.google.com.sl" redirect
local-data: "www.google.com.sl CNAME forcesafesearch.google.com"
local-zone: "www.google.sn" redirect
local-data: "www.google.sn CNAME forcesafesearch.google.com"
local-zone: "www.google.so" redirect
local-data: "www.google.so CNAME forcesafesearch.google.com"
local-zone: "www.google.sm" redirect
local-data: "www.google.sm CNAME forcesafesearch.google.com"
local-zone: "www.google.sr" redirect
local-data: "www.google.sr CNAME forcesafesearch.google.com"
local-zone: "www.google.st" redirect
local-data: "www.google.st CNAME forcesafesearch.google.com"
local-zone: "www.google.com.sv" redirect
local-data: "www.google.com.sv CNAME forcesafesearch.google.com"
local-zone: "www.google.td" redirect
local-data: "www.google.td CNAME forcesafesearch.google.com"
local-zone: "www.google.tg" redirect
local-data: "www.google.tg CNAME forcesafesearch.google.com"
local-zone: "www.google.co.th" redirect
local-data: "www.google.co.th CNAME forcesafesearch.google.com"
local-zone: "www.google.com.tj" redirect
local-data: "www.google.com.tj CNAME forcesafesearch.google.com"
local-zone: "www.google.tl" redirect
local-data: "www.google.tl CNAME forcesafesearch.google.com"
local-zone: "www.google.tm" redirect
local-data: "www.google.tm CNAME forcesafesearch.google.com"
local-zone: "www.google.tn" redirect
local-data: "www.google.tn CNAME forcesafesearch.google.com"
local-zone: "www.google.to" redirect
local-data: "www.google.to CNAME forcesafesearch.google.com"
local-zone: "www.google.com.tr" redirect
local-data: "www.google.com.tr CNAME forcesafesearch.google.com"
local-zone: "www.google.tt" redirect
local-data: "www.google.tt CNAME forcesafesearch.google.com"
local-zone: "www.google.com.tw" redirect
local-data: "www.google.com.tw CNAME forcesafesearch.google.com"
local-zone: "www.google.co.tz" redirect
local-data: "www.google.co.tz CNAME forcesafesearch.google.com"
local-zone: "www.google.com.ua" redirect
local-data: "www.google.com.ua CNAME forcesafesearch.google.com"
local-zone: "www.google.co.ug" redirect
local-data: "www.google.co.ug CNAME forcesafesearch.google.com"
local-zone: "www.google.co.uk" redirect
local-data: "www.google.co.uk CNAME forcesafesearch.google.com"
local-zone: "www.google.com.uy" redirect
local-data: "www.google.com.uy CNAME forcesafesearch.google.com"
local-zone: "www.google.co.uz" redirect
local-data: "www.google.co.uz CNAME forcesafesearch.google.com"
local-zone: "www.google.com.vc" redirect
local-data: "www.google.com.vc CNAME forcesafesearch.google.com"
local-zone: "www.google.co.ve" redirect
local-data: "www.google.co.ve CNAME forcesafesearch.google.com"
local-zone: "www.google.vg" redirect
local-data: "www.google.vg CNAME forcesafesearch.google.com"
local-zone: "www.google.co.vi" redirect
local-data: "www.google.co.vi CNAME forcesafesearch.google.com"
local-zone: "www.google.com.vn" redirect
local-data: "www.google.com.vn CNAME forcesafesearch.google.com"
local-zone: "www.google.vu" redirect
local-data: "www.google.vu CNAME forcesafesearch.google.com"
local-zone: "www.google.ws" redirect
local-data: "www.google.ws CNAME forcesafesearch.google.com"
local-zone: "www.google.rs" redirect
local-data: "www.google.rs CNAME forcesafesearch.google.com"
local-zone: "www.google.co.za" redirect
local-data: "www.google.co.za CNAME forcesafesearch.google.com"
local-zone: "www.google.co.zm" redirect
local-data: "www.google.co.zm CNAME forcesafesearch.google.com"
local-zone: "www.google.co.zw" redirect
local-data: "www.google.co.zw CNAME forcesafesearch.google.com"
local-zone: "www.google.cat" redirect
local-data: "www.google.cat CNAME forcesafesearch.google.com"
```

Once the file has been created, check the configuration using `configctl unbound check` then restart Unbound to apply the changes. A new banner will appear within Unbound DNS Overrides stating "The configuration contains manual overwrites, these may interfere with the settings configured here."

Verify that the overrides are working for example `duck.com` should return `safe.duckduckgo.com`.

```bash
nslookup duck.com
```

---

### Unbound Reporting

Enable reporting via the Reporting > Settings navigation menu and check Unbound DNS reporting statistics option.

Reports can be access in the Reporting > Unbound DNS menu item.

This report page is similar to what PiHole presents, there are displays for:
- Queries resolved
- Queries blocked
- Total entries in all blocklists
- Queries over x hours
- Top clients
- Top allowed domains
- Top block domains
- Detials page with log information

![Unbound reporting display]({{ page.assets }}/unbound-reporting.png)

---

## Dynamic DNS

Dynamic DNS is a method of updating your DNS records when your IP changes, this is extremely useful when you do not have a static IP address provided by your ISP and is fairly normal when self-hosting from a homelab.

OPNsense supports a range of service providers, such as Cloudflare.

To configure Cloudflare as a DDNS service, you'll need to create a Cloudflare API token with DNS read and edit permissions, as it will need to update the value.

You'll also need a host record created for example `ddns.example.com`

- Service: Cloudflare
- Username: `token` (the word)
- Password: API key
- Zone: Domain name
- Hostname: ddns.example.com
- Check IP Method: `Interface [IPv4]`
- Interface to Monitor: `WAN`

Once you have created the account, ensure that the service is enabled via the General Settings tab. By default it will periodocally update your record every 300 seconds (5 minutes).

I'd also recommend adding the Dynamic DNS widget on the OPNsense dashboard.

---

## Intrusion Detection

Intrusion Detection (IDS) and Prevention (IPS) Systems monitor packets going through an interface and review them against a set of rules. If the system is in detection it will simplify alert about the trigger, but in prevention mode the packet will be dropped.

The Intrusion Prevention System (IPS) system of OPNsense is based on [Suricata](https://suricata.io/){:target="_blank"} and utilizes Netmap to enhance performance.

IDS and IPS are built-in and available within the Services menu item.

---

### Settings

When you are ready to go live, come back and check the Enabled option.

There are three options for the capture mode these are:
 
1. **PCAP live mode (IDS)** - Alerts only
2. **Netmap (IPS)** - Alerts and discards
3. **Divert (IPS)** - Redirect packets via firewall rules

Rules for an IDS/IPS system usually need to have a clear understanding about the internal network, therefore the interface will be set to **LAN**.

Pattern matcher is the algorithm used to scan, there are three options available, these are: 

1. **Aho–Corasick** is the default.
2. **Hyperscan** is the best option on commodity hardware.
3. **Aho–Corasick Ken Steele variant** performs better than default.

![Intrusion Detection Settings page]({{ page.assets }}/intrusion-settings.png)

---

### Rulesets

OPNsense have a abuse.ch and ET open rulesets available to download from the Download tab.

- **abuse.ch/Feodo Tracker**
  - botnet Command & Control (C&C) servers associated with Dridex, Emotet (aka Heodo), TrickBot, QakBot (aka QuakBot / Qbot) and BazarLoader (aka BazarBackdoor).
- **abuse.ch/SSL Fingerprint Blacklist**
  - SSL black list that identifies JA3 fingerprints helping you to detect & block malware botnet C&C communication on the TCP layer.
- **abuse.ch/SSL IP Blacklist**
  - Same as above by using IP addresses.
- **abuse.ch/ThreatFox**
  - Dedicated to sharing indicators of compromise (IOCs) associated with malware.
- **abuse.ch/URLhaus**
  - Dedicated to sharing malicious URLs that are being used for malware distribution.
- [Emerging Threats Rule Categroies PDF](https://tools.emergingthreats.net/docs/ETPro%20Rule%20Categories.pdf){:target="_blank"}
- **OPNsense App detection rules**
  - [Rules](https://github.com/opnsense/rules){:target="_blank"} are focused on blocking web services and the URLs behind them.
    - file-transfer (file sharing in general)
    - media-streaming (streaming, like youtube or shoutcast)
    - social-networking (facebook, google+)
    - messaging (ICQ, whatsapp)
    - mail (gmail, yahoo mail, mail.ru)
    - uncategorized (Zynga, Amazon, etc.)

Check the required rulesets, enable them and then use the "Download & Update Rules" button.

Schedule the rulesets to automatically update by clicking the Schedule tab and enabling the automaitcally created schedule for "Update and reload intrusion detection rules".

When using IPS mode make sure all hardware offloading features are disabled in the interface settings

---

### Policy

Policies allow for granular control over the rules. By default the rulesets will be added in the `alert` action, we can modify our rulesets to `drop` using a policy.

1. Create a new policy
2. Select all rulesets
2. Action: Alert
3. New action: Drop

This will change the enabled, alert rules to be drop instead.

Removing the policy will revert the rules back to alert.

---

### Bypass Internal Networks

By configuring a bypass this will result in traffic only being inspected between external (WAN) networks and internal (LAN) networks. With bypass enabled, routing performance is improved significantly between local networks while IPS is used.

To bypass IPS for internal networks, create a "User Defined" rule.

In the example below the source and destination network is `192.168.0.0/16` with the action to pass and the bypass keyword enabled.

![Bypass for internal traffic]({{ page.assets }}/intrusion-lan-bypass.png)

---

### Alerts

Its important to apply rules progressively and monitor using the alerts tab.

IPS can break a network quickly if you decide to bulk add rulesets and drop everything



---

## Reverse Proxy

---

## NetFlow

---

## VPN Server

---

## VPN Client

---