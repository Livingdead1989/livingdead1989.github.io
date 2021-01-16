---
title:  "Scanning Networks"
date:   2019-09-30 18:00:00 +0000
categories: hacking
---

1. Foot Printing and Recon
1. __Scanning Networks__
1. Gaining Access
1. Maintaining Access
1. Covering Tracks

## Phase 2: Scanning

* Learn the types of devices on the network.
* Check for listening services and open ports.
* Determine the operating systems on the network.
* Monitor for data being sent over the network in clear text.

## Network Scanning

* Develop a profile of a target organisation
* can be a valuable tool for an analyst

## Scanning Techniques

* Ping Sweep - 
* Port Scan -
* Network Mapping -
* OS Fingerprinting - 

## Vulnerability Scan

First stage and can be by anyone normally in-house security specialist. Generates a comprehensive report, these scans should be performed on a regular basis.

## Penetration Tester

Expertise required by a skilled tester normally an outside consultant, they will create a report with methodologies and possible solutions to problems for an executive audience. Should be tested once a year, costs can range into thousands.

## Regulation Requirements

* PCI
* GLBA
* Sarbanes-Oxley
* HIPPA
* FISMA

## Scanning on IPv6 Networks

* Manual - Pattern recognition.
* SLAAC - All addresses uses FFFE in the middle, commonly shared NIC card vendors.
* DHCPv6 - Predictable patterns.

## Port Scanning

Identifies which ports and services are open, records information based on the queries.

Precursor to an attack so measures need to be taken to protect devices.

__Firewall Responses__

* Open and Listening
* Closed and Denying
* No reply - in stealth mode

Firewalls and IPS can use adaptive firewall responses if port scanning is detected.

__Scanning Methods: Detection Avoidance__

* Strobe mode - quietly checks a few ports at a time.
* Stealth mode - uses scans designed to avoid detection.

## DNS

Security weaknesses: 

* Modifying records at the domain.
* DDOS against DNS infastructure.
* Cache Poisoning.
* WHOIS directory information.

__Good Practice__

* Restrict Zone Transfers
* Deny inbound connections to TCP port 53
* Consider using DNSSec
* Conceal information at the registrars on file
* Use split horizon or split DNS
* Don't provide recursive servicees to the public
* Monitor your DNS infrastructure.

## ICMP

In ethical hacking ICMP packets are used to discover; live hosts, network topology, firewall detection and OS fingerprinting.

__Best Practice__

* Type 3 and Type 4 Required, the rest are optional.

## Banner Grabbing

Used to find out more information about the target host such as the operating system, open ports and services.

Prevent banner grabbing by:

* Mask or disable the webserver information.
* Hide file extensions.
* Disable unnecessary services.

## Passive operating system discovery

* BROWSER protocol - shares information about devices and services.
* HTTP Headers - can provide information about the server.

## Internet of Everything IoT

Self-configurating network allows devices to join, leave and learn about other devices

__Universal plug and play (UPnP)__

* Provides discovery and advertisements
* Awareness of services and devices on the network

__Simple Service Discovery Protol (SSDP)__

Drafted in late 1999

* Enables clients to discover network services
* Little or no static configuration required
* Used for passive discovery of network devices

__Best Practices__

* Configure registery to disable discovery messages
* Disable SSDP in the group policy object
* Create firewall rules to allow only trusted hosts on inbound port 1900/UDP

## Vulnerability Scanning

Probes targets on the network:

* Detect open ports
* Determines software, OSs, and versions
* Identifies known vulnerabilities

__Information Systems__

Software side, drives business processes and decision making, includes:

* DBMS, 
* DSS,
* MIS

__Information Technology__

Hardware side

* Computers 
* Networking Devices

Both work together in an organisation and both should be tested.

Two types of scanning:

__Unauthenticated Scan__

* Find basic configuration issues
* Uses no username or passwords
* Simple to run
* Will miss many vulnerabilties

__Authenticated Scan__

* Uses a valid username and password
* Mimic a user on the system or website
* More aggressive - can see inside a system
	* Closer look at software, versions
	* Netstat
* Some use of brute force techniques
	* Can cause crashes
* More thorough and provides a comprehensive report.

## Evading Detection

__Intrusion Detection Systems__

* Intrusion Detection or Prevention System
 * Monitor network for unusual of suspicious activity.
 * Stand-alone or integrated within an ASA or router.
 * Detection - Works out of band to identify malicious activity.
 * Prevention - Works in line to block attacks.

When scanning you can hide your host IP address by using the `-D` command this is called "Cloaking with Decoys" but doesn't work with all types of scans.

Total stealth mode using an IDLE scan, it uses a bystander or zombie.

Spoof your MAC or IP Address

Christmas Tree Attack sends a large number of packets with the FIN, PSH and URG flags set. This could be avoided by older systems.

__IP Fragmentation Scan__

Splits an IP packet into fragmented parts to avoid detection as the target would need to fully assemble to identify the host.

* Used to avoid detection
* Can overwhelm and crash a device

Tiny fragmented IP packets splits up the TCP header over several packets.

`nmap -f <IP addr>`

IP fragmentation can only occur on devices that allow for this type of packet.

__Staying Anonymous__

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

## Concealing and Spoofing 

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

__Proxifier and SocksChain__

Proxy is using something on your behalf. Proxy chaining is where you use multiple proxy servers concealing where the traffic came from.

SOCKS
	* Socket Secure
	* [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) offers more choices for autentication and IPv6, UDP support.

__IP address spoofing countermeasures__

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

__IP spoofing detection techniques__

* Direct TTL Probe - Only useful when the attacker is on a different segment, we check the TTL value to ensure they are the same.
* IP Identification Number - Checking the ID number to ensure they are correct.
* TCP Flow Control Method - attackers will not be able to recieve a spoofed packet, sending a SYN packet, you will not recieve a SYN-ACK back.

## Tunneling

Types of Tunneling:

* Teredo or 6to4 tunneling for dual stack
* IPSec, LLTP, SSL for encryption

__HTTP Tunnel__

Wiki Link: https://en.wikipedia.org/wiki/HTTP_tunnel

* Access programs without being monitored
* Not a true tunnel
* Doesn't encapsulate within the HTTP protocol
* Plain text
* Sends content over port 80
* Reverse HTTP tunnel - a dangerous application
	* Sends a CONNECT packet to a proxy
* All traffic is tunneled inside normal GET and POST
* This works with most proxies and firewalls

__SSH Tunnel__

* Encrypted
* Host based autentication

__Defend against tunneling__

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

## Tools

* Nmap
* Netcat
* DMitry (Deepmagic Information Gathering Tool)
* Curl
* Armitage
* https://sectools.org/tag/vuln-scanners/
* netstat
* https://dnsdumpster.com/
* https://w3dt.net/
* https://macvendorlookup.com/
* https://hackertarget.com/
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

## Additional

https://chrissanders.org/packet-captures/