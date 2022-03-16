---
title: "Ethical hacking"
date: 2019-09-10 20:00:00 +0000
categories: hacking
tags: ethical hacking footprinting recon scanning network system social engineering covering tracks
description: >- # this means to ignore newlines until "baseurl:"
  This article is a compressed series regarding Ethical hacking. Ethical hacking helps system administrators understand how to better protect the assets they manage.
---

**This series of articles has been compressed into a single post.**

1. [Footprinting and Recon](#footprinting-and-recon)
1. [Scanning Networks](#scanning-networks)
1. [System Hacking](#system-hacking)
1. [Social Engineering](#social-engineering)
1. [Covering Tracks](#covering-tracks)

---

## Footprinting and Recon

Ethical hacking helps system administrators understand how to better protect the assets they manage.

Footprinting and Reconnaissance (method of discovery) is the first stage and involves gathering information about the target.

**Footprinting**: learning as much as possible about the target, including remote access capabilities, open ports and services, and what security mechanisms are in place.

**Reconnaissance**: gathering information about the location of a target by scouting or by setting up covert observation points.

**Sequence of Steps**

* Gather information
* Locate the network range
* Discover active machines
* Determine operating systems
* Define running services
* Map the network

### Competitive Intelligence

Competitive Intelligence (legal) to dig public information can be a great nontechnical approach to footprinting and reconnaissance.

Used in business to help a company learn about its competitors in order to make better business decisions.

### Finding information

* Public Resources
  * Websites
  * Directories
  * Email Addresses
  * Job Sites (idea of systems via tech job postings)
  * Social Networks
* Logical Side
  * Network architecture
  * Defence mechanisms
  * Operating systems
  * Applications

### Questions before beginning

* Who is the target?
* What is the target?
* Where is the target?
* When is the best time for an attack?
* How? (learnt after footprinting)

**Document the Findings**: Its important to document any informations to help build a profile.

### Search Engine Hacking

Using advanced operators and keywords that may possibly yield pages that contain sensitive information such as protected login screens.

[Google hacking](https://en.wikipedia.org/wiki/Google_hacking)

[The Google hacking database](https://www.exploit-db.com/google-hacking-database)

* ext:pdf
* filetype:txt

### Social Engineering

Manipulating people to perform actions or reveal confidential information.

* Telephone,
* Online,
* Dumpster diving,
* Shoulder surfing,
* Eavesdropping,
* Phishing, Pharming
* Simple persuasion,
* Impersonation.

Defence: User Education, Authenication Mechanisms, Simply Questioning.

**Dangers of Social Media**:

* No autentication of users (acceptance)
* Forging someone's identity
* Revealing information (travel plans)
* Sharing of unsafe links

**Examples of Public Search Engines**

* [Anywho.com](https://www.anywho.com/whitepages)
* [Spokeo.com](https://www.spokeo.com/)
* [Zabasearch.com](https://www.zabasearch.com/)
* [Pipl.com](https://pipl.com/)
* [Vitalrec.com](http://www.vitalrec.com/)

### Tracking Reputation

* [Webhose.io](https://webhose.io/)
* [Twitter Alerts](https://help.twitter.com/en/managing-your-account/how-to-use-twitter-alerts)
* [Images.google.com](https://images.google.com/)
* [Google Alerts](https://www.google.co.uk/alerts)
* [raventools.com](https://raventools.com/)

### Email and Websites

### Email

Finding email addresses on public records/websites, crafting an email lists using gained knowledge of username conventions to target for phishing.

Defence:

* Sender Policy Framework (SPF) = 'The From' field spoofing
* Virus filtering and Antivirus techniques
* Strong Spam Filtering
* User Education

#### Email investigation

Reputation-based solutions for investigating email.

Email headers, tell the story of the journey, the stops etc

* [mxtoolbox.com](https://mxtoolbox.com/) - How to get email headers
* [whatismyip.com](https://www.whatismyip.com/) - Email header analyzer

### Website Mirroring

Download the entire website to examine the content, obtaining emails, phone number and other information.

You can sometimes see concealed comments, directories, links to protected content.

**Free and Paid Tools for Website Mirroring/Extracting**:

* [httrack.com](https://www.httrack.com/)
* [wget](https://www.gnu.org/software/wget/)
* [websiterippercopier.com](http://websiterippercopier.com/)

### OSINT Tools

Open-source intelligence gathering tools

Generates a more targeted discovery

* [Maltego](https://www.paterva.com/)
  * Open-source Data Analysis Software
  * Harvests Domain Names, Whois Information and IP Addresses
  * Person Specific Information: Websites and Associated Companies.

* [Shodan](https://www.shodan.io/)
  * Discovers Devices are Connected to the Internet

* [Metagoofil](https://tools.kali.org/information-gathering/metagoofil)
  * Extracts Metadata from the Target

* [FOCA](https://www.elevenpaths.com/labstools/foca/index.html)
  * Examines Metadata

* [theHarvester](https://tools.kali.org/information-gathering/theharvester)
  * Harvests Info from Public Sources

## DNS

DNS uses port 53 over UDP or TCP (zone transfers only)

**Common Types**

* A = IPv4 Address of Host
* AAAA = IPv6 Address of Host
* PTR = Reverse DNS lookup
* MX = Mail Exchange record

**Dangers of DNS**

* Exposed Zone File
* Flood Attack
  * Similar to a denial of service (DOS).
* Cache Poisoning
  * Changes the DNS Cache on the local name server to point toward a bogus server.
* DNS Footprinting
  * Find information managed by the SOA (Start of Authority).

**Good Practice**

* Restrict zone transfers to authorized servers
* Deny all inbound connection requests to TCP Port 53
* Consider using DNS security (authentication mechanisms)

### Domain Name Generators

When phishing, spoofing the brand in the hyperlink may get someone to click on the link.

Domain names and subdomain names can be used to trick a DNS server into transferring its zone file.

[Domain Name Analyzer](https://domainpunch.com/dna/) is an example of a domain name generator tool.

### ICMP

Internet Control Message Protcol (ICMP) resides in the network layer (OSI Layer 3), used by routers and intermediary devices to communicate updates or error information.

Also used for network troubleshooting and to test if a device is alive/available on the network.

### Tracert

Traces the route and provides the path and transit times.

Returns the FQDN and the IP address of each gate, used to help paint a picture of the network.

### Pathping

Combines features of ping and tracert.

Shows packet loss at any given router or link by computing statistics at the end.

### Nslookup

Non-interactive mode `nslookup google.co.uk`.

Interactive mode `nslookup` and then enter what you want to search after `google.co.uk`.

You can also set other options such as `set type=mx` then `google.co.uk` and you'll get the MX records.

### Domain Information Groper (DIG)

tool used to querying the DNS, native to Linux, installation is required for Windows machine and there are online tools such as [toolbox.googleapps.com](https://toolbox.googleapps.com/apps/main/)

### Steps to Reduce Exposure

* Administrators should use a non-standard format email address
* Keep patches up to date
* Monitor for scanning activity
* Shutdown all unnecessary services
* Use strong autentication methods
* Segment the network
* Shed paper based information

---

## Scanning Networks

* Learn the types of devices on the network.
* Check for listening services and open ports.
* Determine the operating systems on the network.
* Monitor for data being sent over the network in clear text.

### Network Scanning

* Develop a profile of a target organisation
* can be a valuable tool for an analyst

### Scanning Techniques

* Ping Sweep -
* Port Scan -
* Network Mapping -
* OS Fingerprinting -

### Vulnerability Scan

First stage and can be by anyone normally in-house security specialist. Generates a comprehensive report, these scans should be performed on a regular basis.

### Penetration Tester

Expertise required by a skilled tester normally an outside consultant, they will create a report with methodologies and possible solutions to problems for an executive audience. Should be tested once a year, costs can range into thousands.

### Regulation Requirements

* PCI
* GLBA
* Sarbanes-Oxley
* HIPPA
* FISMA

### Scanning on IPv6 Networks

* Manual - Pattern recognition.
* SLAAC - All addresses uses FFFE in the middle, commonly shared NIC card vendors.
* DHCPv6 - Predictable patterns.

### Port Scanning

Identifies which ports and services are open, records information based on the queries.

Precursor to an attack so measures need to be taken to protect devices.

**Firewall Responses**

* Open and Listening
* Closed and Denying
* No reply - in stealth mode

Firewalls and IPS can use adaptive firewall responses if port scanning is detected.

**Scanning Methods: Detection Avoidance**

* Strobe mode - quietly checks a few ports at a time.
* Stealth mode - uses scans designed to avoid detection.

### DNS

Security weaknesses:

* Modifying records at the domain.
* DDOS against DNS infastructure.
* Cache Poisoning.
* WHOIS directory information.

**Good Practice**

* Restrict Zone Transfers
* Deny inbound connections to TCP port 53
* Consider using DNSSec
* Conceal information at the registrars on file
* Use split horizon or split DNS
* Don't provide recursive servicees to the public
* Monitor your DNS infrastructure.

### ICMP

In ethical hacking ICMP packets are used to discover; live hosts, network topology, firewall detection and OS fingerprinting.

**Best Practice**

* Type 3 and Type 4 Required, the rest are optional.

### Banner Grabbing

Used to find out more information about the target host such as the operating system, open ports and services.

Prevent banner grabbing by:

* Mask or disable the webserver information.
* Hide file extensions.
* Disable unnecessary services.

### Passive operating system discovery

* BROWSER protocol - shares information about devices and services.
* HTTP Headers - can provide information about the server.

### Internet of Everything IoT

Self-configurating network allows devices to join, leave and learn about other devices

**Universal plug and play (UPnP)**

* Provides discovery and advertisements
* Awareness of services and devices on the network

**Simple Service Discovery Protol (SSDP)**

Drafted in late 1999

* Enables clients to discover network services
* Little or no static configuration required
* Used for passive discovery of network devices

**Best Practices**

* Configure registery to disable discovery messages
* Disable SSDP in the group policy object
* Create firewall rules to allow only trusted hosts on inbound port 1900/UDP

### Vulnerability Scanning

Probes targets on the network:

* Detect open ports
* Determines software, OSs, and versions
* Identifies known vulnerabilities

**Information Systems**

Software side, drives business processes and decision making, includes:

* DBMS,
* DSS,
* MIS

**Information Technology**

Hardware side

* Computers
* Networking Devices

Both work together in an organisation and both should be tested.

Two types of scanning:

**Unauthenticated Scan**

* Find basic configuration issues
* Uses no username or passwords
* Simple to run
* Will miss many vulnerabilties

**Authenticated Scan**

* Uses a valid username and password
* Mimic a user on the system or website
* More aggressive - can see inside a system
  * Closer look at software, versions
  * Netstat
* Some use of brute force techniques
  * Can cause crashes
* More thorough and provides a comprehensive report.

### Evading Detection

**Intrusion Detection Systems**

* Intrusion Detection or Prevention System
* Monitor network for unusual of suspicious activity.
* Stand-alone or integrated within an ASA or router.
* Detection - Works out of band to identify malicious activity.
* Prevention - Works in line to block attacks.

When scanning you can hide your host IP address by using the `-D` command this is called "Cloaking with Decoys" but doesn't work with all types of scans.

Total stealth mode using an IDLE scan, it uses a bystander or zombie.

Spoof your MAC or IP Address

Christmas Tree Attack sends a large number of packets with the FIN, PSH and URG flags set. This could be avoided by older systems.

**IP Fragmentation Scan**

Splits an IP packet into fragmented parts to avoid detection as the target would need to fully assemble to identify the host.

* Used to avoid detection
* Can overwhelm and crash a device

Tiny fragmented IP packets splits up the TCP header over several packets.

`nmap -f <IP addr>`

IP fragmentation can only occur on devices that allow for this type of packet.

**Staying Anonymous**

* Use private browsing
* Use Browser extensions
  * Privacy Badger
* Use password manager
* Use DuckDuckgo

* Information stored in Cookies, some can be dangerous
* HTTP doesn't keep a record of past visits (Stateles Protocol)
* Personal VPN
* Temp email addresses (10MinuteEmail)

* Mobile Users
  * Don't use your phone (burner phones for use case)
  * Don't use Google
  * Disable GPS
  * Think about the apps installed

### Concealing and Spoofing

__Hiding with Onion Routing ([TOR](https://www.torproject.org))__

* Encrypts and moves taffic within the TOR network.
* Enables anonymous browsing.
* Nodes know there neighbours but nothing else.
* Ensure safe browsing
  * Don't torrent.
  * Don't install or enable plugins (Flash, Quicktime).
  * Only use HTTPS (HTTPS Everywhere plugin).
  * Don't open documents while online.

[TOR Flow Map](https://torflow.uncharted.software)

**Proxifier and SocksChain**

Proxy is using something on your behalf. Proxy chaining is where you use multiple proxy servers concealing where the traffic came from.

SOCKS
 *Socket Secure
 * [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) offers more choices for autentication and IPv6, UDP support.

**IP address spoofing countermeasures**

Conceals the identify of the hacker, the header is modified with a fake IP address so that the packet appears to have come from another machine.

IP Spoofing has the source address modified and is normally used when no reply is required such as DDoS.

ARP Spoofing is sending counterfeit ARP messages so that the attacker's MAC is linked with a legitimate IP address, reply packets will be returned.

Use Case:

* Man-in-the-Middle Attack
  * SSL Strip - Eyesdrop
* Denial-of-Service Attack
  * Spoofing strengthens the attack.
  * Server is not sure if requests are legitimate.

Best Practices:

* Use cryptographic autentication methods (IPSec).
* Use bogon filters.
* Deny private IP addresses from coming into the network.

**IP spoofing detection techniques**

* Direct TTL Probe - Only useful when the attacker is on a different segment, we check the TTL value to ensure they are the same.
* IP Identification Number - Checking the ID number to ensure they are correct.
* TCP Flow Control Method - attackers will not be able to recieve a spoofed packet, sending a SYN packet, you will not recieve a SYN-ACK back.

### Tunneling

Types of Tunneling:

* Teredo or 6to4 tunneling for dual stack
* IPSec, LLTP, SSL for encryption

**HTTP Tunnel**

Wiki Link: <https://en.wikipedia.org/wiki/HTTP_tunnel>

* Access programs without being monitored
* Not a true tunnel
* Doesn't encapsulate within the HTTP protocol
* Plain text
* Sends content over port 80
* Reverse HTTP tunnel - a dangerous application
  * Sends a CONNECT packet to a proxy
* All traffic is tunneled inside normal GET and POST
* This works with most proxies and firewalls

**SSH Tunnel**

* Encrypted
* Host based autentication

**Defend against tunneling**

* Allow only preapproved software
* Close unnecessary ports and services
* Use of anti-virus and anti-malware programs

Detecting HTTP Tunnel

HTTP connections are not persistent and have small packet sizes. Monitor for lengthy connections using port 80.

Use of a intrusion detection system (IDS)
 
* Catch and mine data destined for port 80 using WireShark or NetworkMiner.
* Inspect log files regularly.
* Collect and analyse statistics.

Application Proxy Firewall

Actively Filter

* Post Request
* HTML Scripts
* Host or URL "filter url http 0 0 0 0"
* MIME and file extensions

Additional Precautions

* Set a connection timeout (prevents lengthy connections)
* Proxies with autentication
* Prevent HTTP-CONNECT queries
* Disable SSH port forwarding.

### Tools

* Nmap
* Netcat
* DMitry (Deepmagic Information Gathering Tool)
* Curl
* Armitage
* <https://sectools.org/tag/vuln-scanners/>
* netstat
* <https://dnsdumpster.com/>
* <https://w3dt.net/>
* <https://macvendorlookup.com/>
* <https://hackertarget.com/>
* Proxy Switcher
* Proxifier
* Proxy Workbench
* ProxyChains
* Acunetix - Web Vulnerability Scanner
* SAINT
* Nessus
* [hPing](https://tools.kali.org/information-gathering/hping3)
  * Command-line packet crafting tool (ICMP, UDP or TCP).
  * Specific flags and options can be set.
* Nikto - Web Server Scanner
* NetScan Tools - Paid for Suite of tools.
* Microsoft Baseline Security Analyzer
* Qualys Browser Check
* [Cloud Shark](https://cloudshark.io/products/enterprise/)
* ManageEngine OpManager
* Solarwinds Network Topology Mapper
* The Dude (Mikrotik)
* Spiceworks Network Monitor
* NetworkMiner
* Mobile Devices
  * Fing - Network Tools
  * Net Scan
  * IP Tools: Wifi Analyzer

### Additional

<https://chrissanders.org/packet-captures/>

---

## System Hacking

Advanced Persistent Threat (APT)

* Stay in the network undetected
* Goal is to obtain high-value information

**Set the Stage**

Information about the systems has been obtained in previous steps:

* Reconnaissance has been completed
  * Target location
  * Good times for attack
  * How the target operates
  * Valuable data or services identified
* Scanning and Mapping has been completed
  * Make and model of devices
  * Listening services
  * Evidence of data being sent
  * Live systems
  * Operating systems
* Enumeration has identified weaknesses
  * Users (Windows, Linux)
  * Windows groups
  * Networked devices
  * Identified exploitable devices

This stage is System Hacking, which contains the following:

* Obtaining the password
  * Active online attack
    * Dictionary, brute force, or keylogger
  * Passive online attack
    * Packet sniffing, MITM, and reply attacks
  * Offline evaluation
    * Rainbow attacks
* Escalation of privilege
  * Administration level is the aim
  * Unmounted filesystems or development tools
* Executing applications
  * Install spyware with backdoor
* Hiding files and tools
  * Methods:
    * Rootkits
    * Steganography
    * Alternate data streams
* Covering tracks
  * Clean up any evidence
  * Delete or modify logs

**Authenticate a User**

New Technology LAN Manager (NTLM)

* Microsoft proprietary authentication protocol
* Operates within Explorer
* Uses a challenge/response method
* Use Cases:
  * Authenticating to a non-domain server
  * Peer-to-Peer network or workgroup
  * Firewall restricts Kerberos (Port 88)

Kerberos

* Built into Active Directory
* Uses tickets to access services
* Domain Controller
  * Houses user accounts and passwords
  * Acts as the Key Distribution Center (KDC)
    * Authentication service (AS)
    * Ticket-granting service (TGS)
  * Active Directory as its account database

Pluggable Authentication Modules (PAM)

* Authentication
* Account management
* Session management
* Password management

Simple Authentication and Security Layer (SASL)

* Authentication and data security services
* Used for various connection oriented protcols (LDAP, PAM, Kerberos etc.) to interact together
* Protocol must include a command for identifying and authenticating a user to a server

### Gaining Access

Ways for a user to authenticate:

* What you know: Password
* What you are: Biometric
* What you have: ID Card

**Where are passwords stored?**

Windows:

* Found in %SystemRoot%/system32/config/SAM
* Accessible only with admin privileges
* Not available while operating system is booted

Syskey was introduced to increase security of the SAM against offline cracking

* Encrypts the password hash values
* 128 RC4 Encryption key, stored in the SAM registry hive
* Not accessible while the operating system is booted

Linux:

* /etc/passwd

**How to obtain?**

Passive Online:

* Sniffing of passwords using a packet analysis tool, such as Wireshark
* MITM (Man-in-the-Middle) such as replay attacks

Active Online:

* Password cracking
  * Software
    * L0phtCrack (Paid)
    * Ophtcrack (Open-Source, supports Rainbow tables)
    * John the Ripper (Cross-platform)
    * Cain and Abel (Windows, extra features: password sniff, cracking and voIP capture)
  * Uses patterns
* Trojan
* Guessing
  * Common passwords: <https://www.passwordrandom.com/most-popular-passwords>
  * Manufacturer defaults: <https://cirt.net/passwords>
  * Dictionary Attack
  * Brute Force Attack
  * Hybrid Attack - Dictionary combined with Brute Force
* Phishing
* Keylogger
* Spyware

Hash Injections: "Pass the Hash"

* A technique that sends the hash value instead of the plain password
* Can be done against any service accepting LM or NTLM authentication

Offline:

* Using a distributed rainbow table
  * Rainbow tables are tables containing hash values
  * Users authenticate by entering their password which gets converted into a hash then compared
  * Sites:
    * <https://www.fileformat.info/tool/hash.htm> - Hash Generator
    * <https://project-rainbowcrack.com/> - Downloadable Rainbow Tables
    * <http://onlinemd5.com/> - MD5 Hash Generator
    * <http://reverse-hash-lookup.online-domain-tools.com/> - Reverse Hash Lookup
  * Salting (random string, stored in the database or with the hash string) will help protect against a rainbow attack

Other Methods:

* Shoulder surfing
* Dumpster diving
* Social engineering
* Buying a password

### Privilege Escalation

Administrative accounts are normally protected so access is gained through lower privileged accounts. Escalation takes advantage of a vulnerability in a piece of software or operating system.

Escalation in two ways:

* Horizontal (peer privileged)
* Vertical (higher privileged)

Default accounts are known and targets. Make sure they are and secure as a ethical hacker will test these accounts.

Local access once obtained can be used to collect data, install rootkits, keyloggers, botnet.

Online botnet checker: <https://checkip.kaspersky.com/>

Once completed the hacker will clean the system to ensure they are undetected.

**Best Practices**

* Restrict Interactive Logon Privileges
  * MFA
  * Logon to certain machines
* Routine Services
  * Run as unprivileged (non-admin)
* Principle of Least Privilege
  * Users and applications have least privilege to complete the job
* Using encryption
  * Additional layer of protection
* Test and Patch
  * Regular patching
* Browser
  * Security settings of IE to zero or low
* Monitor log files
  * Easy to miss alerts if logging to much
* Education and Training
  * Training for all staff

### Spyware

**Malware Categories**

* Spyware
  * Harvests data:
    * Screen Activity
    * Keystrokes
    * Web form data
    * Internet usage
    * Access to sensitive data
  * Affects the machine:
    * Tracking the users
    * Redirection of hyperlinks
    * Pop-ups
    * Poor Performance
* Viruses
* Worms
* Trojans
  * Presented as a useful tool or free download
* Rootkits

**Internet Browsers**

You may want to block third-party cookies, this can break some sites.

Compact privacy policy tells the user how their information is shared, normally third-party cookies are used for tracking.

Disable ActiveX, although these are some benefits this has been known as a security concern allowing the installation of spyware.

**Protect Your Phone**

* Install app that monitors for security vulnerabilties
* Use caution when downloading apps
* Do not use free Wi-Fi hotspots
* Use "Find my phone" features
* Use strong autentication methods

### Keyloggers

Keyloggers are hard to detect and can cause more damage than a virus.

* Software
  * Runs in the background
  * Records every keystroke
  * Stored on the systems hard drive
  * Can log online activity and screen
* Hardware
  * Physically attached to the system
  * Records each keystroke
  * Saves to onboard memory
  * Easy to install
  * Can be installed inside another device or USB
  * No software installed, undetectable by anti-malware

**Best Practices**

* Use a firewall
  * Egress (outbound) filtering
* Anti-spyware and Anti-Malware
* Windows Users Account Control (UAC)
* Avoid free software
* Use a more secure browser
* Password the system
* Use a limited user
* Install using the admin

### Hiding in Plain Sight

**NTFS Alternate Data Streaming (ADS)**

* Providies compatibility with non-Windows file systems
* Stores data in hidden files linked to a regular file
* Streams are not limited in size
* Attackers can hide tools and data

**Steganography**

"Hiding in Plain Sight"

* Three elements
  * Carrier (e.g. Image, Audio, Text)
  * Payload
  * Hidden message

The human eye can only see a range of colours, slightly tweaking these values we can hide data within pixels (demo: <https://cs.vu.nl/~ast/books/mos2/zebras.html>)

**Detecting Steganography (Steganalysis)**

Image steganography tools:

* Compare against the original
* Watch for a large image
* Blocky artifacts (pixelated)

Tools:

* Stego Analyst
  * Search for evidence in a image and audio file
* Stego Watch
  * Scans the entire file system
  * Flags suspected files
* Stego Break
  * Obtains the passphrase used on a file (Encryption)

### Cover Your Tracks

Hiding files and tools

* Alternate data streams
* Steganography
* Rootkit
  * Hidden Tools
  * Backdoor access
  * Log scrubbers

Hide any trace of activity

* Disable auditing
  * `auditpol` (CMD)
  * Local Security Policy (GUI)

Clean Up - Linux

* Metasploit `meterpreter > clearev`
* Log files `kwrite /var/log/messages`
* Erase Command History `export HISTSIZE=0`
* Shread Command History `shred -zu root/.bash_history`

Clean Up - Windows

* Event Viewer - Clear Log

---

## Social Engineering

A con game relying on influence, social skills, and human interaction to obtain information about an organisation or computer system.

Security appliances and anti-malware protection has gotten better, so a hacker will try to attack a softer target - People.

Ways to attack:

* Phone phishing
* Online recon
* Dumpster diving
* Shoulder surfing.

Scam artists work on our emotions:

* May promise free gifts or prices
* Offer important information
* Threaten to take action if you do not reply.

**Four main phases of Social Engineering**

1. Reconnaissance
1. Establishing Trust
1. Exploiting that Trust
1. Exit

**Recognising an attack**

* Watch out for unscheduled utility service calls
* Be hesitant with calls claiming to be from the help desk
* Be aware of anyone who says you will get in trouble if the issue isn't dealt with immediately

**Best Practices**

* Require visitors to check in
* Require visitors to wear a badge
* Be polite and calmly call for verification
* Escort them even when inside the lobby

### Social Engineering Mechanisms

Catfishing is a newer form of social engineering where the attacker poses as a love interest, luring their victim into a relationship.

Browsers are commonly used in social engineering as the portal into the world wide web, a few tips for keeping safe:

* Use a modern browser
* Secure browser settings
* Be careful with extensions
  * They can track
  * Act as a keylogger
  * Insert ads
  * Redirect you
* Use extra protection
  * Anti-exploit (<https://www.malwarebytes.com/antiexploit/>)
  * Microsoft EMET (Enhanced Mitigation Experience Toolkit, <https://support.microsoft.com/en-us/help/2458544/the-enhanced-mitigation-experience-toolkit>)

**Mobile based attacks**

Ploys:

* Links to Funny Videos
* Dial a number for a voice mail
* Phony patch - cloned website
* Free offers
* App switch - taking a legimate app and publishing on another site with embedded code

Best Practices:

* Use reputable publishers
* Search under the publishers name
* Don't jailbreak mobile devices
* Look for ratings, comments etc
* Check traffic volumes
* Watch for subscriptions
* Beware of Developers (Permissions)

Social media:

Lack of company policies, oversight on employee actions. Hackers are aware of this common lack of oversight and prey on individuals in an informal environment, appealing to their sense of belonging and fear of what everyone thinks of them.

Reputation Risk:

An organisation cannot control reputation risk as they are an external factor, but it is good practice to monitor for inappropriate disclosure, create and enforce policies.

### Misuse of Trust

Disgruntled employees

Attacks can come from within from disgruntled employees. Hackers will target these employees as they hold little loyalty.

Reasons:

* Unappreciated
* Overworked
* Underpaid
* Passed up for a promotion

Best Practices to protection against insider (trusted) attacks

* The principle of least privilege
  * Only the privilege needed
  * Shortest time necessary
  * Smallest domain (scope)
* Avoid permission creep
* Auditing and Logging
* Limit access
* Inventory Assets

### Penetration Testing with Social Engineering

**Email and Websites**

Phishing and Pharming

* Send out massive emails
* Bait victims to open and respond
* Message appear urgent
* 1 in 10 will respond

Always go directly to any linked sites, do not use links.

Be aware of counterfeit wesbites, malicious content in advertisements and websites taking advantage of exploited or out of date browsers.

Malicious Emails may have attachments that contain malware

Best Practices:

* Think before opening links or attachments
* Stay away from risky websites
* Keep up to date
* Use a safe search tool

**In person and on the phone**

If the employee is busy they may provide the information without thinking for example a busy receptionist providing a key card because they are swamped with work.

**Social-Engineering Toolkit**

Open-source tool, downloadable or already installed on Kali Linux.

Get the victim to:

* Click on a link
* Open a file
* Goto a malicious site

The toolkit allows for the bait creation but you'll need to use Metasploit to create the exploit.

Attacks from 3 main categories

* Phishing and Spear Phishing
* Generate malicious files
* Create a malicious website

The toolkit: <https://www.trustedsec.com/tools/the-social-engineer-toolkit-set/>

**SET in Kali Linux**

Make sure that the SET configuration has been updated regularly.

There are lots of options in SET to build the bait but there is a requirement to use Metasploit to deliver the content.

SET should be part of the vulnerabilities tests as we need to test the 'human firewall'.

**Countermeasures**

Defending against social engineering is hard as we cannot just defend using hardware and software alone.

* Policies
* Standards
* Education

**Best Practices**

* Caller ID
  * Seperate Ringtone for Internal and External
* Hesitate before transferring an outside call
  * Take the name, company, telephone number and forward the details, hackers use this to collect data of staff
* Helpdesk Policies
* Only authorised individuals to roam freely
  * Escort when possible
* Contractors to show identification
  * Train receptionists to make a phone call when unsure
* Know your employees
  * Employees to wear appropriate ID
  * Protect their ID badges
  * Remove ID when in public
* Browsers and Web
  * Set privacy settings
  * Read privacy policies
  * Use encryption for portal access
  * Train employees to watch for tells of secure and real sites
  * Review company websites removing sensitive information
* Disposal of Media
  * Use of shredders
  * Storage with lockers
* Passwords
  * Use strong, complex passwords
  * Do not give away passwords
  * Do not leave passwords
  * Challenge question on password reset
* Policies
  * Create and enforce realistic policies
  * Clear and Easy to understand policies
* Education
  * Use caution when giving out information
  * How to spot a phish
  * Train supervisors in security awareness
  * Website dedicated to security including tips
* Entire organisation
  * Reinforce observant behaviour (example: reward employees that spot phishing)
  * Employees at all levels are important to security
