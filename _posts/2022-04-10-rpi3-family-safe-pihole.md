---
title: "RPI3 Family Safe PiHole"
date: 2022-04-10 18:30:00 +0000
categories: server
tags: rpi rpi3 pihole dns dhcp
description: >- # this means to ignore newlines until "baseurl:"
  Deploying a RPI3 PiHole as a DNS and DHCP server, removing adverts, trackers and forced safe search to keep our family safe.
---

In this article I will be deploying a Raspberry Pi 3 powered PiHole server to act as our networks DNS and DHCP server, removing pesky adverts and trackers for the whole network and making use of forced safe search and adult content filtering to keep our family safe.

I am using a Raspberry Pi 3, which has plenty of available resources for this deployment.

![rpi-pihole-system-resource](/assets/images/posts/rpi-pihole-system-resource.png)

Lets get started!

## Flash microSD

Using the [Raspberry Pi Imager](https://www.raspberrypi.com/software/), flash the Micro SD card with "Raspberry Pi OS Lite (32-Bit)".

![rpi-pihole-flash](/assets/images/posts/rpi-pihole-flash.png)

## Enable SSH

Before ejecting the MicroSD card, go to the `boot` directory and create a file called `ssh`, this will enable SSH at initial boot, removing the requirement to plug a monitor, mouse and keyboard in to access the device.

```bash
touch ssh
```

![rpi-pihole-ssh](/assets/images/posts/rpi-pihole-ssh.png)

## Boot

Eject the MicroSD card, insert into the Raspberry Pi and start the initial boot up. Once the device is ready connect to it via SSH.

```bash
ssh pi@raspberrypi
```

## Hostname

The first step is to change the hostname, the below command will set the hostname to "pihole".

```bash
hostnamectl set-hostname pihole
```

![rpi-pihole-hostname-1](/assets/images/posts/rpi-pihole-hostname-1.png)

After change the hosts file to reflect this change

```bash
sudo nano /etc/hosts
```

```text
127.0.0.1 pihole
```

![rpi-pihole-hostname-2](/assets/images/posts/rpi-pihole-hostname-2.png)

## Password

To change the default password use the `passwd` command and follow the prompts.

![rpi-pihole-password](/assets/images/posts/rpi-pihole-password.png)

## Static IP

To set a static IP address edit the `dhcpcd.conf` file

```bash
sudo nano /etc/dhcpcd.conf
```

![rpi-pihole-static-ip-1](/assets/images/posts/rpi-pihole-static-ip-1.png)

Un-comment the example static IP configuration and set the appropriate values

```text
interface eth0
static ip_address=192.168.1.195/24
static ip6_address=fd51:42f8:caae:d92e::ff/64
static routers=192.168.1.1
static domain_name_servers=1.1.1.3 1.0.0.3
```

![rpi-pihole-static-ip-2](/assets/images/posts/rpi-pihole-static-ip-2.png)

## Update

We will update our repositories and upgrade any existing packages before we start installation. This ensures we are working with the latest.

```bash
sudo apt update && sudo apt upgrade -y
```

![rpi-pihole-update-upgrade](/assets/images/posts/rpi-pihole-update-upgrade.png)

There may be a pending restart so perform that before the installation

```bash
sudo shutdown -r now
```

## Install PiHole

I will be running the PiHole installer script, its always recommended to fully understand what will be happening when using an piping a script to bash.

In this situation we trust this script.

```bash
curl -sSL https://install.pi-hole.net | bash
```

![rpi-pihole-install-script](/assets/images/posts/rpi-pihole-install-script.png)

The next set of screenshots are of the installation wizard.

![rpi-pihole-install-1](/assets/images/posts/rpi-pihole-install-1.png)

We have already configured a static IP address and can safely select "Yes".

![rpi-pihole-install-2](/assets/images/posts/rpi-pihole-install-2.png)

Because we have already configured we can "Skip".

![rpi-pihole-install-3](/assets/images/posts/rpi-pihole-install-3.png)

For our Upstream DNS provider I will be using Cloudflare's Family DNS, therefore select "Custom".

![rpi-pihole-install-4](/assets/images/posts/rpi-pihole-install-4.png)

Enter `1.1.1.3,1.0.0.3` for Cloudflare's Family DNS.

![rpi-pihole-install-5](/assets/images/posts/rpi-pihole-install-5.png)

I will be adding block lists later therefore I will de-select the default value and continue.

![rpi-pihole-install-6](/assets/images/posts/rpi-pihole-install-6.png)

The default value of "On" for the web interface is perfect.

![rpi-pihole-install-7](/assets/images/posts/rpi-pihole-install-7.png)

I am happy for the installer to add `lighttpd` web server and the appropriate PHP modules, therefore "On" and fine.

![rpi-pihole-install-8](/assets/images/posts/rpi-pihole-install-8.png)

I do want to log any DNS queries.

![rpi-pihole-install-9](/assets/images/posts/rpi-pihole-install-9.png)

I also want to see all information so option 0 is fine.

![rpi-pihole-install-10](/assets/images/posts/rpi-pihole-install-10.png)

The installation completes with all the details shown.

![rpi-pihole-install-11](/assets/images/posts/rpi-pihole-install-11.png)

To change the default password I will issue the command

```bash
pihole -a -p
```

and set a new password.

![rpi-pihole-install-12](/assets/images/posts/rpi-pihole-install-12.png)

Installation is now complete and we can log into the web GUI

```http
http://192.168.1.2/admin
```

## Configuration

### GUI

To change the interface appearance and add an administrator email, navigate to **Settings** > **API/Web interface**. I have unchecked the boxed layout, as this works better on my screen.

![rpi-pihole-gui](/assets/images/posts/rpi-pihole-gui.png)

### Upstream DNS

 To add IPv6 upstream servers navigate to **Settings** > **DNS**.

A few suggests of family friendly services providers, these are designed to filter out age in-appropriate content for example adult websites.

AdGuard

* IPv4: 94.140.14.15, 94.140.15.16
* IPv6: 2a10:50c0::bad1:ff, 2a10:50c0::bad2:ff

Cloudflare

* IPv4: 1.1.1.3, 1.0.0.3
* IPv6: 2606:4700:4700::1113, 2606:4700:4700::1003

![rpi-pihole-configure-dns](/assets/images/posts/rpi-pihole-configure-dns.png)

### DHCP Server

Make sure to only have 1 DHCP server active on your network, otherwise you'll run into problems with clients being split.

I will be using built-in DHCP server capability. Navigate to **Settings** > **DHCP**.

First enable the DHCP server. Next set a pool of addresses you would like the DHCP server to issue out, I have configured from 192.168.1.10 to 192.168.1.49.

Configure a domain name for your clients to be issued, I am using "home.lan", make sure this is not a public domain.

Lastly enable IPv6 support.

![rpi-pihole-configure-dhcp](/assets/images/posts/rpi-pihole-configure-dhcp.png)

### Adlists

Now I will be adding some adlists, this can be performed by navigating to **Group Management** > **Adlists** and adding an address to a list.

Below is a single line list, which will add multiple lists in a single add.

![rpi-pihole-adlists-1](/assets/images/posts/rpi-pihole-adlists-1.png)

The lists that will be added, presented on separate lines to make it easier to read.

A prepared single line version is available below.

```text
https://raw.githubusercontent.com/PolishFiltersTeam/KADhosts/master/KADhosts.txt
https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Spam/hosts
https://v.firebog.net/hosts/static/w3kbl.txt
https://adaway.org/hosts.txt
https://v.firebog.net/hosts/AdguardDNS.txt
https://v.firebog.net/hosts/Admiral.txt
https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt
https://s3.amazonaws.com/lists.disconnect.me/simple_ad.txt
https://v.firebog.net/hosts/Easylist.txt
https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext
https://raw.githubusercontent.com/FadeMind/hosts.extras/master/UncheckyAds/hosts
https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts
https://raw.githubusercontent.com/jdlingyu/ad-wars/master/hosts
https://v.firebog.net/hosts/Easyprivacy.txt
https://v.firebog.net/hosts/Prigent-Ads.txt
https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.2o7Net/hosts
https://raw.githubusercontent.com/crazy-max/WindowsSpyBlocker/master/data/hosts/spy.txt
https://hostfiles.frogeye.fr/firstparty-trackers-hosts.txt
https://hostfiles.frogeye.fr/multiparty-trackers-hosts.txt
https://www.github.developerdan.com/hosts/lists/ads-and-tracking-extended.txt
https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/android-tracking.txt
https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt
https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/AmazonFireTV.txt
https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-blocklist.txt
https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareHosts.txt
https://osint.digitalside.it/Threat-Intel/lists/latestdomains.txt
https://s3.amazonaws.com/lists.disconnect.me/simple_malvertising.txt
https://v.firebog.net/hosts/Prigent-Crypto.txt
https://bitbucket.org/ethanr/dns-blacklists/raw/8575c9f96e5b4a1308f2f12394abd86d0927a4a0/bad_lists/Mandiant_APT1_Report_Appendix_D.txt
https://phishing.army/download/phishing_army_blocklist_extended.txt
https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-malware.txt
https://raw.githubusercontent.com/Spam404/lists/master/main-blacklist.txt
https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Risk/hosts
https://urlhaus.abuse.ch/downloads/hostfile/
https://zerodot1.gitlab.io/CoinBlockerLists/hosts_browser
http://sbc.io/hosts/alternates/fakenews-gambling-porn/hosts
```

Single Line for PiHole Import, copy the below and paste it into your address field and click add.

```text
https://raw.githubusercontent.com/PolishFiltersTeam/KADhosts/master/KADhosts.txt https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Spam/hosts https://v.firebog.net/hosts/static/w3kbl.txt https://adaway.org/hosts.txt https://v.firebog.net/hosts/AdguardDNS.txt https://v.firebog.net/hosts/Admiral.txt https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt https://s3.amazonaws.com/lists.disconnect.me/simple_ad.txt https://v.firebog.net/hosts/Easylist.txt https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext https://raw.githubusercontent.com/FadeMind/hosts.extras/master/UncheckyAds/hosts https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts https://raw.githubusercontent.com/jdlingyu/ad-wars/master/hosts https://v.firebog.net/hosts/Easyprivacy.txt https://v.firebog.net/hosts/Prigent-Ads.txt https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.2o7Net/hosts https://raw.githubusercontent.com/crazy-max/WindowsSpyBlocker/master/data/hosts/spy.txt https://hostfiles.frogeye.fr/firstparty-trackers-hosts.txt https://hostfiles.frogeye.fr/multiparty-trackers-hosts.txt https://www.github.developerdan.com/hosts/lists/ads-and-tracking-extended.txt https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/android-tracking.txt https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/AmazonFireTV.txt https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-blocklist.txt https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareHosts.txt https://osint.digitalside.it/Threat-Intel/lists/latestdomains.txt https://s3.amazonaws.com/lists.disconnect.me/simple_malvertising.txt https://v.firebog.net/hosts/Prigent-Crypto.txt https://bitbucket.org/ethanr/dns-blacklists/raw/8575c9f96e5b4a1308f2f12394abd86d0927a4a0/bad_lists/Mandiant_APT1_Report_Appendix_D.txt https://phishing.army/download/phishing_army_blocklist_extended.txt https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-malware.txt https://raw.githubusercontent.com/Spam404/lists/master/main-blacklist.txt https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Risk/hosts https://urlhaus.abuse.ch/downloads/hostfile/ https://zerodot1.gitlab.io/CoinBlockerLists/hosts_browser http://sbc.io/hosts/alternates/fakenews-gambling-porn/hosts
```

Now that the lists have been added we'll need to update. Navigate to **Tools** > **Update Gravity** and perform an **Update**.

![rpi-pihole-adlists-2](/assets/images/posts/rpi-pihole-adlists-2.png)

![rpi-pihole-adlists-3](/assets/images/posts/rpi-pihole-adlists-3.png)

### RegEx

In addition to the adlists I will be adding a few regular expressions to help filter out addresses. Navigate to **Blacklist** > **RegEx filter**.

![rpi-pihole-regex](/assets/images/posts/rpi-pihole-regex.png)

Add the following

```text
^ad([sxv]?[0-9]*|system)[_.-]([^.[:space:]]+\.){1,}|[_.-]ad([sxv]?[0-9]*|system)[_.-]

^(.+[_.-])?adse?rv(er?|ice)?s?[0-9]*[_.-]

^(.+[_.-])?telemetry[_.-]

^adim(age|g)s?[0-9]*[_.-]

^adtrack(er|ing)?[0-9]*[_.-]

^advert(s|is(ing|ements?))?[0-9]*[_.-]

^aff(iliat(es?|ion))?[_.-]

^analytics?[_.-]

^banners?[_.-]

^beacons?[0-9]*[_.-]

^count(ers?)?[0-9]*[_.-]

^mads\.

^pixels?[-.]

^stat(s|istics)?[0-9]*[_.-]

```

### Block TLD

Next change to the **Domain** tab and add the following as wildcards. There are some of the most abused top level domains (TLD).

![rpi-pihole-block-tld-1](/assets/images/posts/rpi-pihole-block-tld-1.png)

![rpi-pihole-block-tld-2](/assets/images/posts/rpi-pihole-block-tld-2.png)

#### Spam TLD

[https://www.spamhaus.org/statistics/tlds/]

```text
surf
cn
gq
ga
cf
cc
tk
ml
work
su
top
```

#### Porn TLD

[https://tld-list.com/tld-categories]

```text
xxx
webcam
sex
sexy
tube
cam
porn
adult
```

#### Abused TLD

[https://unit42.paloaltonetworks.com/top-level-domains-cybercrime/]

```text
icu
xyz
pw
zw
bd
ke
am
sbs
date
quest
cd
bid
cyou
support
win
rest
casa
help
ws
wtf
```

### Whitelist

Now we have quite a lot of different blocks in place and there may be some false positives or services we do not wish to block. To manually add a whitelist item via web panel navigate to **Whitelist** > **Domain** and add the address with comment.

![rpi-pihole-whitelist-1](/assets/images/posts/rpi-pihole-whitelist-1.png)

To add addresses faster use the command line interface (CLI) via SSH. The command below can be used to add to the Whitelist.

```bash
pihole -w <address> --comment "<comment>"
```

![rpi-pihole-whitelist-2](/assets/images/posts/rpi-pihole-whitelist-2.png)

Below are some that I use, copy all and paste into the terminal session to add in bulk.

```bash
pihole -w eu-api.coolkit.cc --comment "Home Assistant - Sonoff"

pihole -w improving.duckduckgo.com --comment "DuckDuckGo Stats"

pihole -w links.duckduckgo.com --comment "DuckDuckGo prevents search from hanging"

pihole -w incoming.telemetry.mozilla.org --comment "FireFox Stats"

pihole -w tracking-protection.cdn.mozilla.net --comment "FireFox used for DoNotTrack"

pihole -w webhook.logentries.com --comment "IKEA Tradfri Smart Home Hub"

pihole -w github.map.fastly.net --comment "GitHub CNAME for raw.githubusercontent.com"

pihole -w githubusercontent.com --comment "GitHub"

pihole -w c.paypal.com --comment "PayPal prevents being unable to pay"

pihole -w ud-chat.signal.org chat.signal.org  storage.signal.org signal.org www.signal.org updates2.signal.org textsecure-service-whispersystems.org giphy-proxy-production.whispersystems.org cdn.signal.org whispersystems-textsecure-attachments.s3-accelerate.amazonaws.com d83eunklitikj.cloudfront.net souqcdn.com cms.souqcdn.com api.directory.signal.org contentproxy.signal.org turn1.whispersystems.org --comment "Signal"

pihole -w s.youtube.com --comment "YouTube History" 

pihole -w video-stats.l.google.com --comment "YouTube History"

pihole -w clients4.google.com --comment "Google Services including Maps"

pihole -w clients2.google.com --comment "Google Services including Maps"

pihole -w gstaticadssl.l.google.com --comment "Google Fonts"

pihole -w connectivitycheck.android.com android.clients.google.com clients3.google.com connectivitycheck.gstatic.com --comment "Google captive portal tests"

pihole -w msftncsi.com www.msftncsi.com ipv6.msftncsi.com --comment "Microsoft captive portal tests"

pihole -w captive.apple.com gsp1.apple.com www.apple.com www.appleiphonecell.com --comment "Apple captive portal tests"

pihole -w upload.facebook.com creative.ak.fbcdn.net external-lhr0-1.xx.fbcdn.net external-lhr1-1.xx.fbcdn.net external-lhr10-1.xx.fbcdn.net external-lhr2-1.xx.fbcdn.net external-lhr3-1.xx.fbcdn.net external-lhr4-1.xx.fbcdn.net external-lhr5-1.xx.fbcdn.net external-lhr6-1.xx.fbcdn.net external-lhr7-1.xx.fbcdn.net external-lhr8-1.xx.fbcdn.net external-lhr9-1.xx.fbcdn.net fbcdn-creative-a.akamaihd.net scontent-lhr3-1.xx.fbcdn.net scontent.xx.fbcdn.net scontent.fgdl5-1.fna.fbcdn.net graph.facebook.com b-graph.facebook.com connect.facebook.com cdn.fbsbx.com api.facebook.com edge-mqtt.facebook.com mqtt.c10r.facebook.com portal.fb.com star.c10r.facebook.com star-mini.c10r.facebook.com b-api.facebook.com fb.me bigzipfiles.facebook.com l.facebook.com www.facebook.com scontent-atl3-1.xx.fbcdn.net static.xx.fbcdn.net edge-chat.messenger.com video.xx.fbcdn.net external-ort2-1.xx.fbcdn.net scontent-ort2-1.xx.fbcdn.net edge-chat.facebook.com scontent-mia3-1.xx.fbcdn.net web.facebook.com rupload.facebook.com l.messenger.com --comment "Facebook including Messenger"

pihole -w twitter.com upload.twitter.com api.twitter.com mobile.twitter.com --comment "Twitter"

pihole --white-regex (\.|^)twimg\.com$ --comment "Twitter"

pihole -w gsp-ssl.ls.apple.com gsp-ssl.ls-apple.com.akadns.net --comment "Apple iOS Weather App"

pihole -w appleid.apple.com --comment "Apple ID"

```

![rpi-pihole-whitelist-3](/assets/images/posts/rpi-pihole-whitelist-3.png)

### Safe Search

To force safe search on the common search engines; Google, Bing, Yandex and DuckDuckGo.

I have added Yahoo to my Blacklist as there is currently no safe search support via DNS.

```text
yahoo.com
```

#### Bing

[Bing safe search](https://support.microsoft.com/en-gb/topic/block-adult-content-with-safesearch-946059ed-992b-46a0-944a-28e8fb8f1814) can be forced by using a CNAME record, simply add the domain `www.bing.com` with a target of `strict.bing.com`.

```text
www.bing.com strict.bing.com
```

![rpi-pihole-safesearch-bing](/assets/images/posts/rpi-pihole-safesearch-bing.png)

Alternatively you can add the following to `custom.list`.

```text
204.79.197.220 bing.com
204.79.197.220 www.bing.com
```

#### Google, Yandex and DuckDuckGo

To force safe search on these search engines I will be using the `custom.list` file within PiHole. Connect using SSH to your PiHole and edit the following file.

```bash
sudo nano /etc/pihole/custom.list
```

I have provided a full list, this includes strict YouTube. Copy the below list and paste into the `custom.list` file.

```text
52.142.126.100 duckduckgo.com
52.142.126.100 www.duckduckgo.com
52.142.126.100 duck.com
52.142.126.100 www.duck.com

213.180.193.56 yandex.com
213.180.193.56 yandex.ru
213.180.193.56 yandex.eu

216.239.38.120 youtube.com
216.239.38.120 www.youtube.com
216.239.38.120 m.youtube.com
216.239.38.120 youtubei.googleapis.com
216.239.38.120 youtube.googleapis.com
216.239.38.120 www.youtube-nocookie.com

216.239.38.120 www.google.com
216.239.38.120 www.google.ad
216.239.38.120 www.google.ae
216.239.38.120 www.google.com.af
216.239.38.120 www.google.com.ag
216.239.38.120 www.google.com.ai
216.239.38.120 www.google.al
216.239.38.120 www.google.am
216.239.38.120 www.google.co.ao
216.239.38.120 www.google.com.ar
216.239.38.120 www.google.as
216.239.38.120 www.google.at
216.239.38.120 www.google.com.au
216.239.38.120 www.google.az
216.239.38.120 www.google.ba
216.239.38.120 www.google.com.bd
216.239.38.120 www.google.be
216.239.38.120 www.google.bf
216.239.38.120 www.google.bg
216.239.38.120 www.google.com.bh
216.239.38.120 www.google.bi
216.239.38.120 www.google.bj
216.239.38.120 www.google.com.bn
216.239.38.120 www.google.com.bo
216.239.38.120 www.google.com.br
216.239.38.120 www.google.bs
216.239.38.120 www.google.bt
216.239.38.120 www.google.co.bw
216.239.38.120 www.google.by
216.239.38.120 www.google.com.bz
216.239.38.120 www.google.ca
216.239.38.120 www.google.cd
216.239.38.120 www.google.cf
216.239.38.120 www.google.cg
216.239.38.120 www.google.ch
216.239.38.120 www.google.ci
216.239.38.120 www.google.co.ck
216.239.38.120 www.google.cl
216.239.38.120 www.google.cm
216.239.38.120 www.google.cn
216.239.38.120 www.google.com.co
216.239.38.120 www.google.co.cr
216.239.38.120 www.google.com.cu
216.239.38.120 www.google.cv
216.239.38.120 www.google.com.cy
216.239.38.120 www.google.cz
216.239.38.120 www.google.de
216.239.38.120 www.google.dj
216.239.38.120 www.google.dk
216.239.38.120 www.google.dm
216.239.38.120 www.google.com.do
216.239.38.120 www.google.dz
216.239.38.120 www.google.com.ec
216.239.38.120 www.google.ee
216.239.38.120 www.google.com.eg
216.239.38.120 www.google.es
216.239.38.120 www.google.com.et
216.239.38.120 www.google.fi
216.239.38.120 www.google.com.fj
216.239.38.120 www.google.fm
216.239.38.120 www.google.fr
216.239.38.120 www.google.ga
216.239.38.120 www.google.ge
216.239.38.120 www.google.gg
216.239.38.120 www.google.com.gh
216.239.38.120 www.google.com.gi
216.239.38.120 www.google.gl
216.239.38.120 www.google.gm
216.239.38.120 www.google.gr
216.239.38.120 www.google.com.gt
216.239.38.120 www.google.gy
216.239.38.120 www.google.com.hk
216.239.38.120 www.google.hn
216.239.38.120 www.google.hr
216.239.38.120 www.google.ht
216.239.38.120 www.google.hu
216.239.38.120 www.google.co.id
216.239.38.120 www.google.ie
216.239.38.120 www.google.co.il
216.239.38.120 www.google.im
216.239.38.120 www.google.co.in
216.239.38.120 www.google.iq
216.239.38.120 www.google.is
216.239.38.120 www.google.it
216.239.38.120 www.google.je
216.239.38.120 www.google.com.jm
216.239.38.120 www.google.jo
216.239.38.120 www.google.co.jp
216.239.38.120 www.google.co.ke
216.239.38.120 www.google.com.kh
216.239.38.120 www.google.ki
216.239.38.120 www.google.kg
216.239.38.120 www.google.co.kr
216.239.38.120 www.google.com.kw
216.239.38.120 www.google.kz
216.239.38.120 www.google.la
216.239.38.120 www.google.com.lb
216.239.38.120 www.google.li
216.239.38.120 www.google.lk
216.239.38.120 www.google.co.ls
216.239.38.120 www.google.lt
216.239.38.120 www.google.lu
216.239.38.120 www.google.lv
216.239.38.120 www.google.com.ly
216.239.38.120 www.google.co.ma
216.239.38.120 www.google.md
216.239.38.120 www.google.me
216.239.38.120 www.google.mg
216.239.38.120 www.google.mk
216.239.38.120 www.google.ml
216.239.38.120 www.google.com.mm
216.239.38.120 www.google.mn
216.239.38.120 www.google.ms
216.239.38.120 www.google.com.mt
216.239.38.120 www.google.mu
216.239.38.120 www.google.mv
216.239.38.120 www.google.mw
216.239.38.120 www.google.com.mx
216.239.38.120 www.google.com.my
216.239.38.120 www.google.co.mz
216.239.38.120 www.google.com.na
216.239.38.120 www.google.com.ng
216.239.38.120 www.google.com.ni
216.239.38.120 www.google.ne
216.239.38.120 www.google.nl
216.239.38.120 www.google.no
216.239.38.120 www.google.com.np
216.239.38.120 www.google.nr
216.239.38.120 www.google.nu
216.239.38.120 www.google.co.nz
216.239.38.120 www.google.com.om
216.239.38.120 www.google.com.pa
216.239.38.120 www.google.com.pe
216.239.38.120 www.google.com.pg
216.239.38.120 www.google.com.ph
216.239.38.120 www.google.com.pk
216.239.38.120 www.google.pl
216.239.38.120 www.google.pn
216.239.38.120 www.google.com.pr
216.239.38.120 www.google.ps
216.239.38.120 www.google.pt
216.239.38.120 www.google.com.py
216.239.38.120 www.google.com.qa
216.239.38.120 www.google.ro
216.239.38.120 www.google.ru
216.239.38.120 www.google.rw
216.239.38.120 www.google.com.sa
216.239.38.120 www.google.com.sb
216.239.38.120 www.google.sc
216.239.38.120 www.google.se
216.239.38.120 www.google.com.sg
216.239.38.120 www.google.sh
216.239.38.120 www.google.si
216.239.38.120 www.google.sk
216.239.38.120 www.google.com.sl
216.239.38.120 www.google.sn
216.239.38.120 www.google.so
216.239.38.120 www.google.sm
216.239.38.120 www.google.sr
216.239.38.120 www.google.st
216.239.38.120 www.google.com.sv
216.239.38.120 www.google.td
216.239.38.120 www.google.tg
216.239.38.120 www.google.co.th
216.239.38.120 www.google.com.tj
216.239.38.120 www.google.tl
216.239.38.120 www.google.tm
216.239.38.120 www.google.tn
216.239.38.120 www.google.to
216.239.38.120 www.google.com.tr
216.239.38.120 www.google.tt
216.239.38.120 www.google.com.tw
216.239.38.120 www.google.co.tz
216.239.38.120 www.google.com.ua
216.239.38.120 www.google.co.ug
216.239.38.120 www.google.co.uk
216.239.38.120 www.google.com.uy
216.239.38.120 www.google.co.uz
216.239.38.120 www.google.com.vc
216.239.38.120 www.google.co.ve
216.239.38.120 www.google.vg
216.239.38.120 www.google.co.vi
216.239.38.120 www.google.com.vn
216.239.38.120 www.google.vu
216.239.38.120 www.google.ws
216.239.38.120 www.google.rs
216.239.38.120 www.google.co.za
216.239.38.120 www.google.co.zm
216.239.38.120 www.google.co.zw
216.239.38.120 www.google.cat

2001:4860:4802:32::78 youtube.com
2001:4860:4802:32::78 www.youtube.com
2001:4860:4802:32::78 m.youtube.com
2001:4860:4802:32::78 youtubei.googleapis.com
2001:4860:4802:32::78 youtube.googleapis.com
2001:4860:4802:32::78 www.youtube-nocookie.com

2001:4860:4802:32::78 www.google.com
2001:4860:4802:32::78 www.google.ad
2001:4860:4802:32::78 www.google.ae
2001:4860:4802:32::78 www.google.com.af
2001:4860:4802:32::78 www.google.com.ag
2001:4860:4802:32::78 www.google.com.ai
2001:4860:4802:32::78 www.google.al
2001:4860:4802:32::78 www.google.am
2001:4860:4802:32::78 www.google.co.ao
2001:4860:4802:32::78 www.google.com.ar
2001:4860:4802:32::78 www.google.as
2001:4860:4802:32::78 www.google.at
2001:4860:4802:32::78 www.google.com.au
2001:4860:4802:32::78 www.google.az
2001:4860:4802:32::78 www.google.ba
2001:4860:4802:32::78 www.google.com.bd
2001:4860:4802:32::78 www.google.be
2001:4860:4802:32::78 www.google.bf
2001:4860:4802:32::78 www.google.bg
2001:4860:4802:32::78 www.google.com.bh
2001:4860:4802:32::78 www.google.bi
2001:4860:4802:32::78 www.google.bj
2001:4860:4802:32::78 www.google.com.bn
2001:4860:4802:32::78 www.google.com.bo
2001:4860:4802:32::78 www.google.com.br
2001:4860:4802:32::78 www.google.bs
2001:4860:4802:32::78 www.google.bt
2001:4860:4802:32::78 www.google.co.bw
2001:4860:4802:32::78 www.google.by
2001:4860:4802:32::78 www.google.com.bz
2001:4860:4802:32::78 www.google.ca
2001:4860:4802:32::78 www.google.cd
2001:4860:4802:32::78 www.google.cf
2001:4860:4802:32::78 www.google.cg
2001:4860:4802:32::78 www.google.ch
2001:4860:4802:32::78 www.google.ci
2001:4860:4802:32::78 www.google.co.ck
2001:4860:4802:32::78 www.google.cl
2001:4860:4802:32::78 www.google.cm
2001:4860:4802:32::78 www.google.cn
2001:4860:4802:32::78 www.google.com.co
2001:4860:4802:32::78 www.google.co.cr
2001:4860:4802:32::78 www.google.com.cu
2001:4860:4802:32::78 www.google.cv
2001:4860:4802:32::78 www.google.com.cy
2001:4860:4802:32::78 www.google.cz
2001:4860:4802:32::78 www.google.de
2001:4860:4802:32::78 www.google.dj
2001:4860:4802:32::78 www.google.dk
2001:4860:4802:32::78 www.google.dm
2001:4860:4802:32::78 www.google.com.do
2001:4860:4802:32::78 www.google.dz
2001:4860:4802:32::78 www.google.com.ec
2001:4860:4802:32::78 www.google.ee
2001:4860:4802:32::78 www.google.com.eg
2001:4860:4802:32::78 www.google.es
2001:4860:4802:32::78 www.google.com.et
2001:4860:4802:32::78 www.google.fi
2001:4860:4802:32::78 www.google.com.fj
2001:4860:4802:32::78 www.google.fm
2001:4860:4802:32::78 www.google.fr
2001:4860:4802:32::78 www.google.ga
2001:4860:4802:32::78 www.google.ge
2001:4860:4802:32::78 www.google.gg
2001:4860:4802:32::78 www.google.com.gh
2001:4860:4802:32::78 www.google.com.gi
2001:4860:4802:32::78 www.google.gl
2001:4860:4802:32::78 www.google.gm
2001:4860:4802:32::78 www.google.gr
2001:4860:4802:32::78 www.google.com.gt
2001:4860:4802:32::78 www.google.gy
2001:4860:4802:32::78 www.google.com.hk
2001:4860:4802:32::78 www.google.hn
2001:4860:4802:32::78 www.google.hr
2001:4860:4802:32::78 www.google.ht
2001:4860:4802:32::78 www.google.hu
2001:4860:4802:32::78 www.google.co.id
2001:4860:4802:32::78 www.google.ie
2001:4860:4802:32::78 www.google.co.il
2001:4860:4802:32::78 www.google.im
2001:4860:4802:32::78 www.google.co.in
2001:4860:4802:32::78 www.google.iq
2001:4860:4802:32::78 www.google.is
2001:4860:4802:32::78 www.google.it
2001:4860:4802:32::78 www.google.je
2001:4860:4802:32::78 www.google.com.jm
2001:4860:4802:32::78 www.google.jo
2001:4860:4802:32::78 www.google.co.jp
2001:4860:4802:32::78 www.google.co.ke
2001:4860:4802:32::78 www.google.com.kh
2001:4860:4802:32::78 www.google.ki
2001:4860:4802:32::78 www.google.kg
2001:4860:4802:32::78 www.google.co.kr
2001:4860:4802:32::78 www.google.com.kw
2001:4860:4802:32::78 www.google.kz
2001:4860:4802:32::78 www.google.la
2001:4860:4802:32::78 www.google.com.lb
2001:4860:4802:32::78 www.google.li
2001:4860:4802:32::78 www.google.lk
2001:4860:4802:32::78 www.google.co.ls
2001:4860:4802:32::78 www.google.lt
2001:4860:4802:32::78 www.google.lu
2001:4860:4802:32::78 www.google.lv
2001:4860:4802:32::78 www.google.com.ly
2001:4860:4802:32::78 www.google.co.ma
2001:4860:4802:32::78 www.google.md
2001:4860:4802:32::78 www.google.me
2001:4860:4802:32::78 www.google.mg
2001:4860:4802:32::78 www.google.mk
2001:4860:4802:32::78 www.google.ml
2001:4860:4802:32::78 www.google.com.mm
2001:4860:4802:32::78 www.google.mn
2001:4860:4802:32::78 www.google.ms
2001:4860:4802:32::78 www.google.com.mt
2001:4860:4802:32::78 www.google.mu
2001:4860:4802:32::78 www.google.mv
2001:4860:4802:32::78 www.google.mw
2001:4860:4802:32::78 www.google.com.mx
2001:4860:4802:32::78 www.google.com.my
2001:4860:4802:32::78 www.google.co.mz
2001:4860:4802:32::78 www.google.com.na
2001:4860:4802:32::78 www.google.com.ng
2001:4860:4802:32::78 www.google.com.ni
2001:4860:4802:32::78 www.google.ne
2001:4860:4802:32::78 www.google.nl
2001:4860:4802:32::78 www.google.no
2001:4860:4802:32::78 www.google.com.np
2001:4860:4802:32::78 www.google.nr
2001:4860:4802:32::78 www.google.nu
2001:4860:4802:32::78 www.google.co.nz
2001:4860:4802:32::78 www.google.com.om
2001:4860:4802:32::78 www.google.com.pa
2001:4860:4802:32::78 www.google.com.pe
2001:4860:4802:32::78 www.google.com.pg
2001:4860:4802:32::78 www.google.com.ph
2001:4860:4802:32::78 www.google.com.pk
2001:4860:4802:32::78 www.google.pl
2001:4860:4802:32::78 www.google.pn
2001:4860:4802:32::78 www.google.com.pr
2001:4860:4802:32::78 www.google.ps
2001:4860:4802:32::78 www.google.pt
2001:4860:4802:32::78 www.google.com.py
2001:4860:4802:32::78 www.google.com.qa
2001:4860:4802:32::78 www.google.ro
2001:4860:4802:32::78 www.google.ru
2001:4860:4802:32::78 www.google.rw
2001:4860:4802:32::78 www.google.com.sa
2001:4860:4802:32::78 www.google.com.sb
2001:4860:4802:32::78 www.google.sc
2001:4860:4802:32::78 www.google.se
2001:4860:4802:32::78 www.google.com.sg
2001:4860:4802:32::78 www.google.sh
2001:4860:4802:32::78 www.google.si
2001:4860:4802:32::78 www.google.sk
2001:4860:4802:32::78 www.google.com.sl
2001:4860:4802:32::78 www.google.sn
2001:4860:4802:32::78 www.google.so
2001:4860:4802:32::78 www.google.sm
2001:4860:4802:32::78 www.google.sr
2001:4860:4802:32::78 www.google.st
2001:4860:4802:32::78 www.google.com.sv
2001:4860:4802:32::78 www.google.td
2001:4860:4802:32::78 www.google.tg
2001:4860:4802:32::78 www.google.co.th
2001:4860:4802:32::78 www.google.com.tj
2001:4860:4802:32::78 www.google.tl
2001:4860:4802:32::78 www.google.tm
2001:4860:4802:32::78 www.google.tn
2001:4860:4802:32::78 www.google.to
2001:4860:4802:32::78 www.google.com.tr
2001:4860:4802:32::78 www.google.tt
2001:4860:4802:32::78 www.google.com.tw
2001:4860:4802:32::78 www.google.co.tz
2001:4860:4802:32::78 www.google.com.ua
2001:4860:4802:32::78 www.google.co.ug
2001:4860:4802:32::78 www.google.co.uk
2001:4860:4802:32::78 www.google.com.uy
2001:4860:4802:32::78 www.google.co.uz
2001:4860:4802:32::78 www.google.com.vc
2001:4860:4802:32::78 www.google.co.ve
2001:4860:4802:32::78 www.google.vg
2001:4860:4802:32::78 www.google.co.vi
2001:4860:4802:32::78 www.google.com.vn
2001:4860:4802:32::78 www.google.vu
2001:4860:4802:32::78 www.google.ws
2001:4860:4802:32::78 www.google.rs
2001:4860:4802:32::78 www.google.co.za
2001:4860:4802:32::78 www.google.co.zm
2001:4860:4802:32::78 www.google.co.zw
2001:4860:4802:32::78 www.google.cat
```

At this point the PiHole is acting as a black hole for ads and trackers, which was the intended purpose. PiHole is also acting as our DNS and DHCP server and keeping our family safe with safe search and adult content blocks.

This concludes this article.
